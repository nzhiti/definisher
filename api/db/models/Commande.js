const { Model } = require('sequelize');
const { dateToFormat } = require('#app/utils/date');

module.exports = (sequelize, DataTypes) => {
    /** *********************************************************************************************
     * SCHEMA
     ********************************************************************************************* */

    class Schema extends Model { }
    Schema.init({
        commande_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        fk_utilisateur: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        fk_adresse_livraison: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        stripe_session: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        payee: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },

        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
            onUpdate: DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'commandes',
    });

    /**
     * @constraint fk_commandes_utilisateur
     */

    /**
     * @constraint fk_commandes_adresse_livraison
     */


    class Commande extends Schema {
        /** *****************************************************************************************
         * CUSTOM METHODS
         ***************************************************************************************** */

        static async find(ids = []) {
            const rows = await sequelize.query(
                `
                SELECT
                    co.commande_id,
                    co.created_at,
                    co.traitee,
                    ch.challenge_id,
                    ch.nom,
                    ut.utilisateur_id,
                    ut.prenom,
                    ut.nom_de_famille,
                    ut.email,
                    ad.*,
                    pays.nom AS pays,
                    prc.pourcentage_challenge
                FROM
                    commandes co
                LEFT JOIN
                    lignes_achat la ON la.fk_commande = co.commande_id
                LEFT JOIN
                    challenges ch ON la.fk_challenge = ch.challenge_id
                LEFT JOIN
                    adresses ad ON co.fk_adresse_livraison = ad.adresse_id
                LEFT JOIN
                    pays ON ad.fk_pays = pays.code
                LEFT JOIN
                    utilisateurs ut ON co.fk_utilisateur = ut.utilisateur_id
                LEFT JOIN
                    progressions_par_challenge prc ON prc.fk_utilisateur = ut.utilisateur_id and prc.fk_challenge = ch.challenge_id
                WHERE
                    co.payee = TRUE
                    ${ids.length > 0 ? `AND co.commande_id IN (:ids)` : ''}
                `,
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: {
                        ids,
                    },
                },
            );

            return rows.map((row) => ({
                id: row.commande_id,
                commandee_le: dateToFormat(row.created_at, 'Y-m-d'),
                pourcentage_de_completion: row.pourcentage_challenge,
                est_traitee: row.traitee,
                challenge: {
                    nom: row.nom,
                },
                utilisateur: {
                    prenom: row.prenom,
                    nom_de_famille: row.nom_de_famille,
                    email: row.email,
                    adresse: `${row.adresse}${row.region ? `\n${row.region}` : ''}\n${row.code_postal} ${row.ville}\n${row.pays}`,
                },
            }));
        }

        static async findFull(ids, idType = 'commande') {
            const [commandes, achats, reductions] = await Promise.all([
                sequelize.query(
                    `SELECT
                        commandes.commande_id,
                        commandes.fk_utilisateur,
                        commandes.stripe_session,
                        commandes.payee,
                        adresses.*,
                        pays.*,
                        commandes.created_at
                    FROM commandes
                    LEFT JOIN adresses ON commandes.fk_adresse_livraison = adresses.adresse_id
                    LEFT JOIN pays ON adresses.fk_pays = pays.code
                    WHERE ${idType === 'session' ? 'stripe_session' : 'commande_id'} IN(:commande_ids)`,
                    {
                        type: sequelize.QueryTypes.SELECT,
                        replacements: {
                            commande_ids: ids,
                        },
                    },
                ),
                sequelize.query(
                    `SELECT
                        commandes.commande_id,
                        lignes_achat.*,
                        challenges.*
                    FROM commandes
                    LEFT JOIN lignes_achat ON lignes_achat.fk_commande = commandes.commande_id
                    LEFT JOIN challenges ON lignes_achat.fk_challenge = challenges.challenge_id
                    WHERE ${idType === 'session' ? 'stripe_session' : 'commande_id'} IN(:commande_ids)`,
                    {
                        type: sequelize.QueryTypes.SELECT,
                        replacements: {
                            commande_ids: ids,
                        },
                    },
                ),
                sequelize.query(
                    `SELECT
                        commandes.commande_id,
                        lignes_reduction.*,
                        offres.*
                    FROM commandes
                    LEFT JOIN lignes_reduction ON lignes_reduction.fk_commande = commandes.commande_id
                    LEFT JOIN offres ON lignes_reduction.fk_offre = offres.offre_id
                    WHERE ${idType === 'session' ? 'stripe_session' : 'commande_id'} IN(:commande_ids)`,
                    {
                        type: sequelize.QueryTypes.SELECT,
                        replacements: {
                            commande_ids: ids,
                        },
                    },
                ),
            ]);

            if (commandes.length === 0) {
                return [];
            }

            const hashed = commandes.reduce((acc, row) => {
                row.lignes_achat = [];
                row.lignes_reduction = [];

                return Object.assign({}, acc, {
                    [row.commande_id]: row,
                });
            }, {});

            achats.forEach((row) => {
                hashed[row.commande_id].lignes_achat.push(row);
            });
            reductions.forEach((row) => {
                hashed[row.commande_id].lignes_reduction.push(row);
            });

            return commandes;
        }

        static serialize(commande) {
            return {
                id: commande.commande_id,
                session: commande.stripe_session,
                adresse: {
                    adresse: commande.adresse,
                    ville: commande.ville,
                    code: commande.code_postal,
                    region: commande.region,
                    pays: commande.nom,
                },
                lignes_achat: commande.lignes_achat.map((achat) => ({
                    libelle: achat.libelle,
                    montant: achat.montant,
                    challenge: achat.challenge_id,
                })),
                reduction: commande.lignes_reduction.length > 0
                    ? {
                        libelle: commande.lignes_reduction[0].libelle,
                        pourcentage: commande.lignes_reduction[0].pourcentage,
                    }
                    : null,
                payee: commande.payee,
                date: commande.created_at.getTime(),
            };
        }

        /** *****************************************************************************************
         * ASSOCIATIONS
         ***************************************************************************************** */

        /**
         * Creates the proper associations between this model and others
         *
         * @param {Object.<String,Model>} models
         *
         * @returns {undefined}
         */
        static associate(models) {
            Commande.models = models;

            models.Commande.belongsTo(models.Utilisateur, {
                foreignKey: 'fk_utilisateur',
            });
            models.Commande.belongsTo(models.Adresse, {
                foreignKey: 'fk_adresse_livraison',
            });
            models.Commande.hasMany(models.LigneAchat, {
                foreignKey: 'fk_commande',
            });
            models.Commande.hasOne(models.LigneReduction, {
                foreignKey: 'fk_commande',
            });
        }
    }

    // The End
    return Commande;
};
