const db = require('#db/index');
const { trim } = require('validator');
const {
    frontend_url: frontUrl,
} = require('#app/config');
const stripe = require('#app/utils/stripe');

/**
 * Sanitizes input
 * 
 * @param {Object} data
 */
function sanitize(data) {
    return {
        code: typeof data.code === 'string' ? trim(data.code) : null,
        challenge: parseInt(data.challenge, 10),
        adresse: typeof data.adresse === 'string' ? trim(data.adresse) : null,
        ville: typeof data.ville === 'string' ? trim(data.ville) : null,
        code_postal: typeof data.code_postal === 'string' ? trim(data.code_postal) : null,
        region: typeof data.region === 'string' ? trim(data.region) : '',
        pays: typeof data.pays === 'string' ? trim(data.pays.toUpperCase()) : null,
    };
}

module.exports = async (req, res) => {
    const { body } = req;
    const sanitized = sanitize(body);

    // check challenge
    let challenge;
    try {
        challenge = await db.Produit.findOne({
            where: {
                challenge_id: sanitized.challenge,
            }
        });
    } catch (error) {
        return res
            .status(500)
            .send({
                user_message: 'Une erreur est survenue lors de la lecture en base de données',
            });
    }

    if (challenge === null) {
        return res
            .status(400)
            .send({
                user_message: 'Le défi n\'existe pas en base de données',
            });
    }

    if (challenge.quantite_restante !== null && challenge.quantite_restante <= 0) {
        return res
            .status(400)
            .send({
                user_message: 'Désolé, il ne reste plus de places pour ce défi',
            });
    }

    if (req.utilisateur.challengeIds.indexOf(sanitized.challenge) !== -1) {
        return res
            .status(400)
            .send({
                user_message: 'Votre panier contient un défi pour lequel vous êtes déjà inscrit(e)',
            });
    }

    const serializedChallenge = challenge.serialize();
    const limitedChallenges = ['la-traversee-de-la-corse', 'la-traversee-des-pyrenees'];
    if (limitedChallenges.indexOf(serializedChallenge.slug) !== -1
        && req.utilisateur.challengeActifs.some(({ slug }) => limitedChallenges.indexOf(slug) !== -1)) {
        return res
            .status(400)
            .send({
                user_message: 'Vous ne pouvez pas vous inscrire aux deux traversées simultanément',
            });
    }

    // check code
    let offre = null;
    if (sanitized.code !== null && sanitized.code !== '') {
        try {
            offre = await db.Offre.findValidOne(sanitized.code, sanitized.challenge);
        } catch (error) {
            return res
                .status(500)
                .send({
                    user_message: 'Une erreur est survenue lors de la validation du code réduction',
                });
        }

        if (offre === null) {
            return res
                .status(400)
                .send({
                    user_message: 'Code de réduction invalide ou expiré',
                });
        }
    }

    if (challenge.code_obligatoire === true && offre === null) {
        return res
            .status(400)
            .send({
                user_message: 'Un code de réduction spécial est obligatoire pour l\'inscription à ce challenge',
            });
    }

    // check adresse
    try {
        const pays = db.Pays.findOne({
            where: {
                code: sanitized.pays,
            },
        });

        if (pays === null) {
            return res
                .status(400)
                .send({
                    user_message: 'Le pays sélectionné n\'existe pas en base de données',
                });
        }
    } catch (error) {
        return res
            .status(500)
            .send({
                user_message: 'Une erreur est survenue lors de la validation de l\'adresse',
            });
    }

    const adresseFields = ['adresse', 'code_postal', 'ville'];
    if (sanitized.pays !== 'FRA') {
        adresseFields.push('region');
    }

    const errors = {};
    adresseFields.forEach((field) => {
        if (!sanitized[field]) {
            errors[field] = ['Ce champ est obligatoire'];
        }
    });

    if (Object.keys(errors).length > 0) {
        return res
            .status(400)
            .send({
                user_message: 'Certaines données saisies sont manquantes ou invalides',
                details: errors,
            });
    }

    let commandeId;
    try {
        await db.sequelize.transaction(async (transaction) => {
            // create adresse
            const [[{ adresseId }]] = await db.sequelize.query(
                `INSERT INTO
                    adresses
                        (adresse, ville, code_postal, region, fk_pays)
                    VALUES
                        (:adresse, :ville, :code_postal, :region, :pays)
                RETURNING adresse_id AS "adresseId"`,
                {
                    replacements: sanitized,
                    transaction,
                }
            );

            // create commande
            [[{ commandeId }]] = await db.sequelize.query(
                `INSERT INTO
                    commandes
                        (fk_utilisateur, fk_adresse_livraison, stripe_session)
                    VALUES
                        (:utilisateur, :adresseId, :sessionId)
                RETURNING commande_id AS "commandeId"`,
                {
                    replacements: {
                        utilisateur: req.utilisateur.utilisateur_id,
                        adresseId,
                        sessionId: 'pending',
                    },
                    transaction,
                }
            );

            // create stripe session
            const prix = Math.round(
                (challenge.prix * (1 - (offre !== null ? offre.pourcentage / 100 : 0)))
                * 100
            ) / 100;

            let payee = false;
            if (prix > 0) {
                session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [{
                        price_data: {
                            product_data: {
                                name: challenge.nom,
                                description: challenge.description,
                                images: [
                                    serializedChallenge.images.miniature,
                                ],
                            },
                            currency: 'EUR',
                            unit_amount_decimal: prix * 100,
                        },
                        quantity: 1,
                    }],
                    client_reference_id: commandeId,
                    mode: 'payment',
                    success_url: `${frontUrl}/finalisation-achat?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${frontUrl}/finalisation-achat?session_id={CHECKOUT_SESSION_ID}`,
                });
            } else {
                payee = true;
                session = {
                    id: `free_${Date.now()}`,
                };
            }

            await db.sequelize.query(
                `UPDATE commandes SET stripe_session = :sessionId, payee = :payee WHERE commande_id = :id`,
                {
                    replacements: {
                        id: commandeId,
                        sessionId: session.id,
                        payee,
                    },
                    transaction,
                }
            );

            // create lignes_reduction
            if (offre !== null) {
                await db.sequelize.query(
                    `INSERT INTO
                        lignes_reduction
                            (fk_commande, fk_offre, libelle, pourcentage)
                        VALUES
                            (:commandeId, :code, :libelle, :pourcentage)`,
                    {
                        replacements: {
                            commandeId,
                            code: offre.offre_id,
                            libelle: `Réduction "${offre.nom}" (- ${offre.pourcentage}%)`,
                            pourcentage: offre.pourcentage,
                        },
                        transaction,
                    }
                );
            }

            return db.sequelize.query(
                `INSERT INTO
                    lignes_achat
                        (fk_commande, fk_challenge, libelle, montant)
                    VALUES
                        (:commandeId, :challenge, :libelle, :montant)`,
                {
                    replacements: {
                        commandeId,
                        challenge: challenge.challenge_id,
                        libelle: challenge.nom,
                        montant: challenge.prix,
                    },
                    transaction,
                }
            );
        });
    } catch (error) {
        return res
            .status(500)
            .send({
                user_message: 'Une erreur est survenue lors de l\'enregistrement de votre commande, cette dernière n\'a pas été prise en compte.',
            });
    }

    // congratulations
    const commandes = await db.Commande.findFull([commandeId]);
    return res
        .status(200)
        .send(db.Commande.serialize(commandes[0]));
};