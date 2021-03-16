module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'commandes',
            {
                commande_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                fk_utilisateur: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_adresse_livraison: {
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
                'commandes',
                ['fk_utilisateur'],
                {
                    type: 'foreign key',
                    name: 'fk_commandes_utilisateur',
                    references: {
                        table: 'utilisateurs',
                        field: 'utilisateur_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'commandes',
                ['fk_adresse_livraison'],
                {
                    type: 'foreign key',
                    name: 'fk_commandes_adresse_livraison',
                    references: {
                        table: 'adresses',
                        field: 'adresse_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'commandes',
            'fk_commandes_utilisateur',
            { transaction },
        )
            .then(() => queryInterface.removeConstraint(
                'commandes',
                'fk_commandes_adresse_livraison',
                { transaction },
            ))
            .then(() => queryInterface.dropTable('commandes', { transaction })),
    ),

};
