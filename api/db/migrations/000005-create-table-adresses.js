module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'adresses',
            {
                adresse_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                adresse: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                ville: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                code_postal: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                region: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                fk_pays: {
                    type: Sequelize.STRING,
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
                'adresses',
                ['fk_pays'],
                {
                    type: 'foreign key',
                    name: 'fk_adresses_pays',
                    references: {
                        table: 'pays',
                        field: 'code',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'adresses',
            'fk_adresses_pays',
            { transaction },
        )
            .then(() => queryInterface.dropTable('adresses', { transaction })),
    ),

};
