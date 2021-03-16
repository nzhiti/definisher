module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'offres',
            {
                offre_id: {
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
                code: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                pourcentage: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                date_debut: {
                    type: Sequelize.DATEONLY,
                    allowNull: true,
                },
                date_fin: {
                    type: Sequelize.DATEONLY,
                    allowNull: true,
                },
                quantite: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
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
                'offres',
                ['slug'],
                {
                    type: 'unique',
                    name: 'uk_offres_slug',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'offres',
                ['code'],
                {
                    type: 'unique',
                    name: 'uk_offres_code',
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
                'offres',
                ['date_fin'],
                {
                    type: 'check',
                    name: 'check_dates',
                    where: {
                        [Sequelize.Op.or]: [
                            {
                                date_debut: { [Sequelize.Op.eq]: null },
                            },
                            {
                                [Sequelize.Op.and]: {
                                    date_debut: { [Sequelize.Op.ne]: null },
                                    date_fin: { [Sequelize.Op.gte]: Sequelize.col('date_debut') },
                                }
                            }
                        ],
                    },
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'offres',
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
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'offres',
            'uk_offres_slug',
            { transaction },
        )
            .then(() => queryInterface.removeConstraint(
                'offres',
                'uk_offres_code',
                { transaction },
            ))
            .then(() => queryInterface.removeConstraint(
                'offres',
                'check_pourcentage',
                { transaction },
            ))
            .then(() => queryInterface.removeConstraint(
                'offres',
                'check_dates',
                { transaction },
            ))
            .then(() => queryInterface.removeConstraint(
                'offres',
                'check_quantite',
                { transaction },
            ))
            .then(() => queryInterface.dropTable('offres', { transaction })),
    ),

};
