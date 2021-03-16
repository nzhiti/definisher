module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `
            CREATE VIEW offres_quantite AS (
                SELECT
                    o.code,
                    CASE
                        WHEN o.quantite IS NOT NULL THEN GREATEST(o.quantite - COUNT(CASE WHEN co.commande_id IS NULL THEN NULL ELSE 1 END), 0)
                        ELSE NULL
                    END AS quantite_restante
                FROM
                    offres o
                LEFT JOIN
                    lignes_reduction lr ON lr.fk_offre = o.offre_id
                LEFT JOIN
                    commandes co ON (
                        lr.fk_commande = co.commande_id
                        AND (
                            co.payee = TRUE
                            OR
                            EXTRACT(
                                epoch FROM (now()::DATE - co.created_at)
                            ) < 300
                        )
                    )
                GROUP BY o.code, o.quantite
            )
            `,
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `DROP VIEW offres_quantite`,
            {
                transaction,
            }
        ),
    ),

};
