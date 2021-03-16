module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'challenges',
            {
                challenge_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                slug: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                nom: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                catch: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                description_titre: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                description_contenu: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                medaille_titre: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                medaille_contenu: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                prix: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                },
                quantite: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                distance: {
                    type: Sequelize.FLOAT,
                    allowNull: true,
                },
                denivele: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                date_fin: {
                    type: Sequelize.DATEONLY,
                    allowNull: true,
                },
                visible: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                fk_theme: {
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
                'challenges',
                ['fk_theme'],
                {
                    type: 'foreign key',
                    name: 'fk_challenges_theme',
                    references: {
                        table: 'themes',
                        field: 'nom',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
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
            ))
            .then(() => queryInterface.addConstraint(
                'challenges',
                ['slug'],
                {
                    type: 'unique',
                    name: 'uk_challenges_slug',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'challenges',
                ['quantite'],
                {
                    type: 'check',
                    name: 'check_quantite',
                    where: {
                        quantite: {
                            [Sequelize.Op.or]: [
                                { [Sequelize.Op.eq]: null },
                                { [Sequelize.Op.gt]: 0 },
                            ]
                        },
                    },
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'challenges',
                ['distance'],
                {
                    type: 'check',
                    name: 'check_distance',
                    where: {
                        distance: {
                            [Sequelize.Op.or]: [
                                { [Sequelize.Op.eq]: null },
                                { [Sequelize.Op.gt]: 0.0 },
                            ]
                        },
                    },
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'challenges',
                ['denivele'],
                {
                    type: 'check',
                    name: 'check_denivele',
                    where: {
                        denivele: {
                            [Sequelize.Op.or]: [
                                { [Sequelize.Op.eq]: null },
                                { [Sequelize.Op.gt]: 0 },
                            ]
                        },
                    },
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'challenges',
                ['distance', 'denivele'],
                {
                    type: 'check',
                    name: 'check_objectif',
                    where: {
                        [Sequelize.Op.or]: [
                            {
                                distance: { [Sequelize.Op.ne]: null },
                            },
                            {
                                denivele: { [Sequelize.Op.ne]: null },
                            }
                        ]
                    },
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'challenges',
            'check_objectif',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'challenges',
                'check_denivele',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'challenges',
                'check_distance',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'challenges',
                'check_quantite',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'challenges',
                'uk_challenges_slug',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'challenges',
                'check_prix',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'challenges',
                'fk_challenges_theme',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('challenges', { transaction })),
    ),

};
