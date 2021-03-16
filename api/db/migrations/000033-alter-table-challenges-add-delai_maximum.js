module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'challenges',
            'delai_maximum',
            {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'challenges',
            'delai_maximum',
            { transaction },
        ),
    ),

};
