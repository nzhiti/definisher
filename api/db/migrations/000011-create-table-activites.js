module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'activites',
            {
                activite_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                distance: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                },
                denivele: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                uid: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                fk_utilisateur: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_challenge: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
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
                'activites',
                ['uid', 'fk_challenge', 'fk_utilisateur'],
                {
                    type: 'unique',
                    name: 'uk_activites_uid',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'activites',
                ['fk_utilisateur'],
                {
                    type: 'foreign key',
                    name: 'fk_activites_utilisateur',
                    references: {
                        table: 'utilisateurs',
                        field: 'utilisateur_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
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
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'activites',
            'uk_activites_uid',
            { transaction },
        )
            .then(queryInterface.removeConstraint(
                'activites',
                'fk_activites_utilisateur',
                { transaction },
            ))
            .then(queryInterface.removeConstraint(
                'activites',
                'fk_activites_challenge',
                { transaction },
            ))
            .then(() => queryInterface.dropTable('activites', { transaction })),
    ),

};
