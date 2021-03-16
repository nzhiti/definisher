const db = require('#db/index');

module.exports = async (req, res) => {
    let classement;
    try {
        return res
            .status(200)
            .send(
                await db.sequelize.query(
                    `SELECT
                        off.code,
                        prenom,
                        nom_de_famille,
                        total_activites_solo,
                        total_distance_solo / 1000 AS total_distance_solo,
                        total_denivele_solo
                    FROM
                        commandes co
                    LEFT JOIN
                        lignes_achat la ON la.fk_commande = co.commande_id
                    LEFT JOIN
                        lignes_reduction lr ON lr.fk_commande = co.commande_id
                    LEFT JOIN
                        offres off ON lr.fk_offre = off.offre_id
                    LEFT JOIN
                        challenges c ON la.fk_challenge = c.challenge_id
                    LEFT JOIN
                        goals g ON g.fk_challenge = c.challenge_id
                    LEFT JOIN
                        progressions_individuelles pi ON (pi.utilisateur_id = co.fk_utilisateur AND pi.goal_id = g.goal_id)
                    LEFT JOIN
                        utilisateurs u ON pi.utilisateur_id = u.utilisateur_id
                    WHERE c.slug = 'un-ticket-pour-la-lune-prive' AND co.payee = TRUE
                    ORDER BY off.code ASC, total_distance_solo DESC`,
                    {
                        type: db.sequelize.QueryTypes.SELECT,
                    },
                ),
            );
    } catch (error) {
        return res
            .status(500)
            .send({
                user_message: 'Une erreur est survenue lors de la lecture en base de données',
            });
    }
};
