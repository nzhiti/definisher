module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'challenges',
            'code_obligatoire',
            {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'challenges',
            'code_obligatoire',
            { transaction },
        ),
    ),

};
