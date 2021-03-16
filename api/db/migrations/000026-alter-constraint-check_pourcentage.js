module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'offres',
            'check_pourcentage',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'lignes_reduction',
                'check_pourcentage',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'offres',
                ['pourcentage'],
                {
                    type: 'check',
                    name: 'check_pourcentage',
                    where: {
                        pourcentage: {
                            [Sequelize.Op.and]: {
                                [Sequelize.Op.gte]: 0,
                                [Sequelize.Op.lte]: 100,
                            }
                        },
                    },
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'lignes_reduction',
                ['pourcentage'],
                {
                    type: 'check',
                    name: 'check_pourcentage',
                    where: {
                        pourcentage: {
                            [Sequelize.Op.and]: {
                                [Sequelize.Op.gte]: 0,
                                [Sequelize.Op.lte]: 100,
                            }
                        },
                    },
                    transaction,
                },
            )),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'offres',
            'check_pourcentage',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'offres',
                'check_pourcentage',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'offres',
                ['pourcentage'],
                {
                    type: 'check',
                    name: 'check_pourcentage',
                    where: {
                        pourcentage: {
                            [Sequelize.Op.and]: {
                                [Sequelize.Op.gt]: 0,
                                [Sequelize.Op.lte]: 100,
                            }
                        },
                    },
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'lignes_reduction',
                ['pourcentage'],
                {
                    type: 'check',
                    name: 'check_pourcentage',
                    where: {
                        pourcentage: {
                            [Sequelize.Op.and]: {
                                [Sequelize.Op.gt]: 0,
                                [Sequelize.Op.lte]: 100,
                            }
                        },
                    },
                    transaction,
                },
            )),
    ),

};
