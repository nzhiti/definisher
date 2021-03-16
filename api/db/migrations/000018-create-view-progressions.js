module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `
            CREATE VIEW progressions AS (
                SELECT
                    fk_utilisateur,
                    fk_challenge,
                    SUM(distance) AS distance_totale,
                    SUM(denivele) AS denivele_total
                FROM activites
                GROUP BY fk_utilisateur, fk_challenge
            )
            `,
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `DROP VIEW progressions`,
            {
                transaction,
            }
        ),
    ),

};
