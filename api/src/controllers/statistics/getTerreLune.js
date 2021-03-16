const db = require('#db/index');

module.exports = async (req, res) => {
    let classement;
    try {
        return res
            .status(200)
            .send(
                await db.sequelize.query(
                    `SELECT
                        u.nom_de_famille,
                        u.prenom,
                        COUNT(a.*) AS nombre_activites,
                        FLOOR(SUM(a.distance) / 1000) AS distance,
                        SUM(a.denivele) AS denivele
                    FROM activites a
                    LEFT JOIN goals g ON a.fk_goal = g.goal_id
                    LEFT JOIN challenges c ON g.fk_challenge = c.challenge_id
                    LEFT JOIN utilisateurs u ON a.fk_utilisateur = u.utilisateur_id
                    WHERE c.slug = 'un-ticket-pour-la-lune'
                    GROUP BY u.nom_de_famille, u.prenom
                    ORDER BY distance DESC`,
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
