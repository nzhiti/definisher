module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'challenges',
            'type',
            {
                type: Sequelize.ENUM('run', 'tri'),
                allowNull: false,
                defaultValue: 'run',
            },
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'challenges',
            'type',
            { transaction },
        ),
    ),

};
