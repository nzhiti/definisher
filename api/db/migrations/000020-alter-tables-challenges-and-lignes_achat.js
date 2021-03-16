module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.removeConstraint(
                'challenges',
                'check_prix',
                {
                    transaction,
                },
            ),
            queryInterface.removeConstraint(
                'lignes_achat',
                'check_montant',
                {
                    transaction,
                },
            )
        ])
            .then(() => Promise.all([
                queryInterface.addConstraint(
                    'challenges',
                    ['prix'],
                    {
                        type: 'check',
                        name: 'check_prix',
                        where: {
                            prix: {
                                [Sequelize.Op.gte]: 0.0,
                            }
                        },
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'lignes_achat',
                    ['montant'],
                    {
                        type: 'check',
                        name: 'check_montant',
                        where: {
                            montant: {
                                [Sequelize.Op.gte]: 0.0,
                            }
                        },
                        transaction,
                    },
                ),
            ]))
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.removeConstraint(
                'challenges',
                'check_prix',
                {
                    transaction,
                },
            ),
            queryInterface.removeConstraint(
                'lignes_achat',
                'check_montant',
                {
                    transaction,
                },
            )
        ])
            .then(() => Promise.all([
                queryInterface.addConstraint(
                    'challenges',
                    ['prix'],
                    {
                        type: 'check',
                        name: 'check_prix',
                        where: {
                            prix: {
                                [Sequelize.Op.gt]: 0.0,
                            }
                        },
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'lignes_achat',
                    ['montant'],
                    {
                        type: 'check',
                        name: 'check_montant',
                        where: {
                            montant: {
                                [Sequelize.Op.gt]: 0.0,
                            }
                        },
                        transaction,
                    },
                ),
            ]))
    ),

};
