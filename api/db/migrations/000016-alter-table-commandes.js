module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'commandes',
            'stripe_session',
            {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'n/a',
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.changeColumn(
                'commandes',
                'stripe_session',
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: null,
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.addColumn(
                'commandes',
                'payee',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'commandes',
            'stripe_session',
            { transaction },
        ),
    ),

};
