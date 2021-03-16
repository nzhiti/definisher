module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'offres',
            'fk_challenge',
            {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'offres',
                ['fk_challenge'],
                {
                    type: 'foreign key',
                    name: 'fk_offres_challenge',
                    references: {
                        table: 'challenges',
                        field: 'challenge_id'
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'offres',
            'fk_offres_challenge',
            { transaction },
        )
            .then(() => queryInterface.removeColumn(
                'offres',
                'fk_challenge',
                { transaction },
            )),
    ),

};
