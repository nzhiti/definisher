module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'commandes',
            'traitee',
            {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'commandes',
                ['traite', 'payee'],
                {
                    type: 'check',
                    name: 'check_traitement',
                    where: {
                        [Sequelize.Op.or]: [
                            {
                                traitee: {
                                    [Sequelize.Op.eq]: false,
                                },
                            },
                            {
                                [Sequelize.Op.and]: {
                                    traitee: {
                                        [Sequelize.Op.eq]: true,
                                    },
                                    payee: {
                                        [Sequelize.Op.eq]: true,
                                    },
                                },
                            }
                        ],
                    },
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'commandes',
            'check_traitement',
            { transaction }
        )
            .then(() => queryInterface.removeColumn(
                'commandes',
                'traitee',
                { transaction },
            )),
    ),

};
