module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `CREATE VIEW progressions_par_challenge AS (
                select
                    utilisateur_id as fk_utilisateur,
                    fk_challenge,
                    avg(pourcentage_general) as pourcentage_challenge
                from (select
                    pa.utilisateur_id,
                    g.fk_challenge,
                    case
                        when objectif_distance is not null and objectif_denivele is not null
                        then
                            (pourcentage_distance + pourcentage_denivele) / 2.0
                        when objectif_denivele is not null
                        then
                            pourcentage_denivele 
                        else
                            pourcentage_distance 
                    end as pourcentage_general
                from
                    progressions_agregees pa
                left join
                    goals g on pa.goal_id = g.goal_id) as tmp
                group by fk_challenge, utilisateur_id
            )
        `,
            {
                transaction,
            },
        ),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `DROP VIEW progressions_par_challenge`,
            {
                transaction,
            }
        ),
    ),

};
