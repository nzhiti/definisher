module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction =>
            // clean all direct links between challenges and activites
            queryInterface.sequelize.query(
                `DROP VIEW progressions`,
                {
                    transaction,
                }
            )
                .then(() => queryInterface.removeConstraint(
                    'activites',
                    'fk_activites_challenge',
                    { transaction }
                ))
                .then(() => queryInterface.removeConstraint(
                    'activites',
                    'uk_activites_uid',
                    { transaction }
                ))

                // create a new link between challenges and goals
                .then(() => queryInterface.addColumn(
                    'activites',
                    'fk_goal',
                    {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    {
                        transaction,
                    },
                ))
                .then(() => queryInterface.sequelize.query(
                    `SELECT
                    g.goal_id,
                    c.challenge_id
                FROM
                    goals g
                LEFT JOIN
                    challenges c ON g.fk_challenge = c.challenge_id`,
                    {
                        type: queryInterface.sequelize.QueryTypes.SELECT,
                        transaction,
                    },
                ))
                .then((rows) => rows.length > 0
                    ? queryInterface.sequelize.query(
                        `UPDATE
                        activites
                    SET
                        fk_goal = CASE
                            ${rows.map(() => 'WHEN fk_challenge = ? THEN ?').join('\n')}
                        END`,
                        {
                            replacements: rows.reduce((acc, { goal_id, challenge_id }) => [
                                ...acc,
                                challenge_id,
                                goal_id,
                            ], []),
                            transaction,
                        }
                    )
                    : Promise.resolve()
                )
                .then(() => queryInterface.changeColumn(
                    'activites',
                    'fk_goal',
                    {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    {
                        transaction,
                    }
                ))
                .then(() => queryInterface.addConstraint(
                    'activites',
                    ['fk_goal'],
                    {
                        type: 'foreign key',
                        name: 'fk_activites_goal',
                        references: {
                            table: 'goals',
                            field: 'goal_id',
                        },
                        onUpdate: 'cascade',
                        onDelete: 'restrict',
                        transaction,
                    },
                ))
                .then(() => queryInterface.addConstraint(
                    'activites',
                    ['uid', 'fk_goal', 'fk_utilisateur'],
                    {
                        type: 'unique',
                        name: 'uk_activites_uid',
                        transaction,
                    },
                ))
                .then(() => queryInterface.removeColumn(
                    'activites',
                    'fk_challenge',
                    { transaction }
                ))
                .then(() => queryInterface.sequelize.query(
                    `
                    create view progressions_collectives as (
                        select
                            ac.fk_goal as goal_id,
                            count(ac.*) as total_activites_equipe,
                            sum(ac.distance)::float as total_distance_equipe,
                            sum(ac.denivele)::float as total_denivele_equipe
                        from
                            activites ac
                        left join
                            goals g on ac.fk_goal = g.goal_id
                        left join
                            challenges ch on g.fk_challenge = ch.challenge_id
                        where
                            ch.par_equipe = true
                        group by ac.fk_goal
                    )`,
                    {
                        transaction,
                    }
                ))
                .then(() => queryInterface.sequelize.query(
                    `
                    create view progressions_individuelles as (
                        select
                            ch.challenge_id,
                            ch.par_equipe,
                            g.goal_id,
                            case
                                when g.distance >= 0 then g.distance * 1000
                                else null
                            end as objectif_distance,
                            case
                                when g.denivele >= 0 then g.denivele
                                else null
                            end as objectif_denivele,
                            co.fk_utilisateur as utilisateur_id,
                            coalesce(total_activites, 0) as total_activites_solo,
                            coalesce(total_distance, 0.0) as total_distance_solo,
                            coalesce(total_denivele, 0.0) as total_denivele_solo
                        from
                            commandes co
                        left join
                            lignes_achat la on la.fk_commande = co.commande_id
                        left join
                            challenges ch on la.fk_challenge = ch.challenge_id 
                        left join
                            goals g on g.fk_challenge = ch.challenge_id
                        left join (
                            /** Progression (partielle) individuelle **/
                            select
                                ac.fk_goal,
                                ac.fk_utilisateur,
                                count(ac.*) as total_activites,
                                sum(ac.distance)::float as total_distance,
                                sum(ac.denivele)::float as total_denivele
                            from
                                activites ac
                            left join
                                goals g on ac.fk_goal = g.goal_id
                            left join
                                challenges ch on g.fk_challenge = ch.challenge_id
                            group by ac.fk_utilisateur, ac.fk_goal
                        ) as progression_individuelle_partielle on (progression_individuelle_partielle.fk_goal = g.goal_id and progression_individuelle_partielle.fk_utilisateur = co.fk_utilisateur)
                        where
                            co.payee = true
                    )
                `,
                    {
                        transaction,
                    },
                ))
                .then(() => queryInterface.sequelize.query(
                    `
                    create view progressions_agregees as (
                        select
                            *,
                            case
                                when objectif_distance >= 0 then greatest(0.0, objectif_distance - coalesce(total_distance_equipe, total_distance_solo))
                                else 0.0
                            end as distance_restante,
                            case
                                when objectif_denivele >= 0 then greatest(0.0, objectif_denivele - coalesce(total_denivele_equipe, total_denivele_solo))
                                else 0.0
                            end as denivele_restant,
                            case
                                when objectif_distance >= 0 then least(1.0, coalesce(total_distance_equipe, total_distance_solo) / objectif_distance)
                                else 1.0
                            end as pourcentage_distance,
                            case
                                when objectif_denivele >= 0 then least(1.0, coalesce(total_denivele_equipe, total_denivele_solo) / objectif_denivele)
                                else 1.0
                            end as pourcentage_denivele
                        from (select
                            pi.utilisateur_id,
                            pi.goal_id,
                            pi.objectif_distance,
                            pi.objectif_denivele,
                            pi.total_activites_solo,
                            pi.total_distance_solo,
                            pi.total_denivele_solo,
                            case
                                when pi.par_equipe = true then coalesce(pc.total_activites_equipe, 0)
                                else null
                            end as total_activites_equipe,
                            case
                                when pi.par_equipe = true then coalesce(pc.total_distance_equipe, 0.0)
                                else null
                            end as total_distance_equipe,
                            case
                                when pi.par_equipe = true then coalesce(pc.total_denivele_equipe, 0.0)
                                else null
                            end as total_denivele_equipe
                        from
                            progressions_individuelles pi
                        left join
                            progressions_collectives pc on pi.goal_id = pc.goal_id) as tmp
                    )
                `,
                    {
                        transaction,
                    },
                ))
                ,
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `DROP VIEW progressions_agregees`,
            {
                transaction,
            }
        )
            .then(() => queryInterface.sequelize.query(
                `DROP VIEW progressions_individuelles`,
                {
                    transaction,
                }
            ))
            .then(() => queryInterface.sequelize.query(
                `DROP VIEW progressions_collectives`,
                {
                    transaction,
                }
            ))
            .then(() => queryInterface.removeConstraint(
                'activites',
                'fk_activites_goal',
                { transaction }
            ))
            .then(() => queryInterface.removeConstraint(
                'activites',
                'uk_activites_uid',
                { transaction }
            ))

            .then(() => queryInterface.addColumn(
                'activites',
                'fk_challenge',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `SELECT
                    g.goal_id,
                    c.challenge_id
                FROM
                    goals g
                LEFT JOIN
                    challenges c ON g.fk_challenge = c.challenge_id`,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            ))
            .then((rows) => queryInterface.sequelize.query(
                `UPDATE
                    activites
                SET
                    fk_challenge = CASE
                        ${rows.map(() => 'WHEN fk_goal = ? THEN ?').join('\n')}
                    END`,
                {
                    replacements: rows.reduce((acc, { goal_id, challenge_id }) => [
                        ...acc,
                        goal_id,
                        challenge_id,
                    ], []),
                    transaction,
                }
            ))
            .then(() => queryInterface.changeColumn(
                'activites',
                'fk_challenge',
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                {
                    transaction,
                }
            ))
            .then(() => queryInterface.addConstraint(
                'activites',
                ['fk_challenge'],
                {
                    type: 'foreign key',
                    name: 'fk_activites_challenge',
                    references: {
                        table: 'challenges',
                        field: 'challenge_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'activites',
                ['uid', 'fk_challenge', 'fk_utilisateur'],
                {
                    type: 'unique',
                    name: 'uk_activites_uid',
                    transaction,
                },
            ))
            .then(() => queryInterface.removeColumn(
                'activites',
                'fk_goal',
                { transaction }
            ))
            .then(() => queryInterface.sequelize.query(
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
            )),
    ),

};
