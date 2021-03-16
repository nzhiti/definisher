module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'lignes_achat',
            {
                ligne_achat_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                fk_commande: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_challenge: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                libelle: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                montant: {
                    type: Sequelize.FLOAT,
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
                'lignes_achat',
                ['fk_commande'],
                {
                    type: 'foreign key',
                    name: 'fk_lignes_achat_commande',
                    references: {
                        table: 'commandes',
                        field: 'commande_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'lignes_achat',
                ['fk_challenge'],
                {
                    type: 'foreign key',
                    name: 'fk_lignes_achat_challenge',
                    references: {
                        table: 'challenges',
                        field: 'challenge_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'lignes_achat',
                ['fk_commande', 'fk_challenge'],
                {
                    type: 'unique',
                    name: 'uk_lignes_achat_produit',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
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
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'lignes_achat',
            'fk_lignes_achat_commande',
            { transaction },
        )
            .then(queryInterface.removeConstraint(
                'lignes_achat',
                'fk_lignes_achat_challenge',
                { transaction },
            ))
            .then(queryInterface.removeConstraint(
                'lignes_achat',
                'uk_lignes_achat_produit',
                { transaction },
            ))
            .then(queryInterface.removeConstraint(
                'lignes_achat',
                'check_montant',
                { transaction },
            ))
            .then(() => queryInterface.dropTable('lignes_achat', { transaction })),
    ),

};
