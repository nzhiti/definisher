module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'utilisateurs',
            {
                utilisateur_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                email: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                prenom: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                nom_de_famille: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                mot_de_passe: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                sel: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                est_actif: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                est_administrateur: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                strava_access_token: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                strava_refresh_token: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                strava_id: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                strava_expires_at: {
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
                'utilisateurs',
                ['email'],
                {
                    type: 'unique',
                    name: 'uk_utilisateurs_email',
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'utilisateurs',
            'uk_utilisateurs_email',
            {
                transaction,
            },
        )
            .then(() => queryInterface.dropTable('utilisateurs', { transaction })),
    ),

};
