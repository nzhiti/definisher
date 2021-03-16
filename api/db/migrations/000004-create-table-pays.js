module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'pays',
            {
                code: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true,
                },
                nom: {
                    type: Sequelize.STRING,
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
                'pays',
                ['nom'],
                {
                    type: 'unique',
                    name: 'uk_pays_nom',
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'pays',
            'uk_pays_nom',
            { transaction },
        )
            .then(() => queryInterface.dropTable('pays', { transaction })),
    ),

};
