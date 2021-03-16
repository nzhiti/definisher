const db = require('#db/index');

module.exports = async (req, res) => {
    let commandes;
    try {
        commandes = await db.Commande.find(req.body.ids);

    } catch (error) {
        return res
            .status(500)
            .send({
                user_message: 'Une erreur est survenue lors de la lecture en base de données',
            });
    }

    if (commandes.some(({ pourcentage_de_completion }) => pourcentage_de_completion !== 1)) {
        return res
            .status(400)
            .send({
                user_message: 'Toutes les commandes demandées ne sont pas terminées, traitement impossible',
            });
    }

    try {
        await db.sequelize.query(
            `UPDATE commandes SET traitee = TRUE WHERE commande_id IN (:ids)`,
            {
                replacements: {
                    ids: req.body.ids,
                },
            }
        );
    } catch (error) {
        return res
            .status(500)
            .send({
                user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
            });
    }

    return res
        .status(200)
        .send(await db.Commande.find());
};
