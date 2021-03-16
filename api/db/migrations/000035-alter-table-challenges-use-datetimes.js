module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `DROP VIEW produits`,
            {
                transaction,
            },
        )
            .then(() => queryInterface.changeColumn(
                'challenges',
                'date_debut',
                {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.changeColumn(
                'challenges',
                'date_fin',
                {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `
                CREATE VIEW produits AS (
                    SELECT
                        challenges.challenge_id,
                        challenges.slug,
                        challenges.nom,
                        challenges.type,
                        challenges.description,
                        challenges.catch,
                        challenges.description_titre,
                        challenges.description_contenu,
                        challenges.medaille_titre,
                        challenges.medaille_contenu,
                        challenges.prix,
                        challenges.quantite,
                        challenges.distance,
                        challenges.denivele,
                        challenges.date_fin,
                        challenges.visible,
                        challenges.fk_theme,
                        challenges.created_at,
                        challenges.updated_at,
                        challenges.date_debut,
                        challenges.en_une_activite,
                        challenges.code_obligatoire,
                        challenges.par_equipe,
                        challenges.delai_maximum,
                        (
                            challenges.quantite
                            -
                            (SELECT COUNT(*) FROM lignes_achat WHERE lignes_achat.fk_challenge = challenges.challenge_id)
                        ) AS quantite_restante
                    FROM
                        challenges
                )
                `,
                {
                    transaction,
                },
            )),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `DROP VIEW produits`,
            {
                transaction,
            },
        )
            .then(() => queryInterface.changeColumn(
                'challenges',
                'date_debut',
                {
                    type: Sequelize.DATEONLY,
                    allowNull: true
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.changeColumn(
                'challenges',
                'date_fin',
                {
                    type: Sequelize.DATEONLY,
                    allowNull: true
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `
                CREATE VIEW produits AS (
                    SELECT
                        challenges.challenge_id,
                        challenges.slug,
                        challenges.nom,
                        challenges.type,
                        challenges.description,
                        challenges.catch,
                        challenges.description_titre,
                        challenges.description_contenu,
                        challenges.medaille_titre,
                        challenges.medaille_contenu,
                        challenges.prix,
                        challenges.quantite,
                        challenges.distance,
                        challenges.denivele,
                        challenges.date_fin,
                        challenges.visible,
                        challenges.fk_theme,
                        challenges.created_at,
                        challenges.updated_at,
                        challenges.date_debut,
                        challenges.en_une_activite,
                        challenges.code_obligatoire,
                        challenges.par_equipe,
                        challenges.delai_maximum,
                        (
                            challenges.quantite
                            -
                            (SELECT COUNT(*) FROM lignes_achat WHERE lignes_achat.fk_challenge = challenges.challenge_id)
                        ) AS quantite_restante
                    FROM
                        challenges
                )
                `,
                {
                    transaction,
                },
            )),
    ),

};
