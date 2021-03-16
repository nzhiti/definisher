module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'goals',
            {
                goal_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                fk_type: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                fk_challenge: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                distance: {
                    type: Sequelize.FLOAT,
                    allowNull: true,
                },
                denivele: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                ordre: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                en_une_activite: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                },
                manuel_autorise: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: null,
                    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'goals',
                ['fk_type'],
                {
                    type: 'foreign key',
                    name: 'fk_goals_type',
                    references: {
                        table: 'goal_types',
                        field: 'slug',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'goals',
                ['fk_challenge'],
                {
                    type: 'foreign key',
                    name: 'fk_goals_challenge',
                    references: {
                        table: 'challenges',
                        field: 'challenge_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'goals',
                ['fk_challenge', 'ordre'],
                {
                    type: 'unique',
                    name: 'uk_goals_ordre',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'goals',
                ['ordre'],
                {
                    type: 'check',
                    name: 'check_ordre_min',
                    where: {
                        ordre: { [Sequelize.Op.gte]: 1 },
                    },
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'goals',
                ['distance'],
                {
                    type: 'check',
                    name: 'check_distance',
                    where: {
                        distance: {
                            [Sequelize.Op.or]: [
                                { [Sequelize.Op.eq]: null },
                                { [Sequelize.Op.gt]: 0.0 },
                            ]
                        },
                    },
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'goals',
                ['denivele'],
                {
                    type: 'check',
                    name: 'check_denivele',
                    where: {
                        denivele: {
                            [Sequelize.Op.or]: [
                                { [Sequelize.Op.eq]: null },
                                { [Sequelize.Op.gt]: 0 },
                            ]
                        },
                    },
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'goals',
                ['distance', 'denivele'],
                {
                    type: 'check',
                    name: 'check_objectif',
                    where: {
                        [Sequelize.Op.or]: [
                            {
                                distance: { [Sequelize.Op.ne]: null },
                            },
                            {
                                denivele: { [Sequelize.Op.ne]: null },
                            }
                        ]
                    },
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `SELECT challenge_id, distance, denivele, en_une_activite FROM challenges`,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                }
            ))
            .then((rows) => rows.length > 0
                ? queryInterface.bulkInsert(
                    'goals',
                    rows.map(({ challenge_id, distance, denivele, en_une_activite }) => ({
                        fk_type: 'run',
                        fk_challenge: challenge_id,
                        distance,
                        denivele,
                        ordre: 1,
                        en_une_activite,
                    })),
                    {
                        transaction
                    }
                )
                : Promise.resolve()
            )
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'goals',
            'check_objectif',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'goals',
                'check_denivele',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'goals',
                'check_distance',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'goals',
                'check_ordre_min',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'goals',
                'uk_goals_ordre',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'goals',
                'fk_goals_challenge',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'goals',
                'fk_goals_type',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('goals', { transaction })),
    ),

};
