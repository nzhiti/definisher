module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'challenges',
            'date_debut',
            {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'challenges',
            'date_debut',
            { transaction },
        ),
    ),

};
