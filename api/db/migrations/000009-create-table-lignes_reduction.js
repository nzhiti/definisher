module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'lignes_reduction',
            {
                lignes_reduction_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                fk_commande: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_offre: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                libelle: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                pourcentage: {
                    type: Sequelize.INTEGER,
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
                'lignes_reduction',
                ['fk_commande'],
                {
                    type: 'foreign key',
                    name: 'fk_lignes_reduction_commande',
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
                'lignes_reduction',
                ['fk_offre'],
                {
                    type: 'foreign key',
                    name: 'fk_lignes_reduction_offre',
                    references: {
                        table: 'offres',
                        field: 'offre_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'lignes_reduction',
                ['fk_commande'],
                {
                    type: 'unique',
                    name: 'uk_lignes_reduction',
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

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'lignes_reduction',
            'fk_lignes_reduction_commande',
            { transaction },
        )
            .then(queryInterface.removeConstraint(
                'lignes_reduction',
                'fk_lignes_reduction_offre',
                { transaction },
            ))
            .then(queryInterface.removeConstraint(
                'lignes_reduction',
                'uk_lignes_reduction',
                { transaction },
            ))
            .then(queryInterface.removeConstraint(
                'lignes_reduction',
                'check_pourcentage',
                { transaction },
            ))
            .then(() => queryInterface.dropTable('lignes_reduction', { transaction })),
    ),

};
