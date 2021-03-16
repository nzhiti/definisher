const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    /** *********************************************************************************************
     * SCHEMA
     ********************************************************************************************* */

    class Schema extends Model { }
    Schema.init({
        offre_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        slug: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        pourcentage: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        date_debut: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        date_fin: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        quantite: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        fk_challenge: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },

        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
            onUpdate: DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'offres',
    });

    /**
     * @constraint uk_offres_slug
     */

    /**
     * @constraint uk_offres_code
     */

    /**
     * @constraint fk_offres_challenge
     */

    /**
     * @constraint check_pourcentage
     * 
     * Ensures that pourcentage is > 0 and <= 100
     */

    /**
     * @constraint check_dates
     * 
     * Ensures that if both dates are set, date_fin is >= date_debut
     */

    /**
     * @constraint check_quantite
     * 
     * Ensures quantite is either null or > 0
     */


    class Offre extends Schema {
        /** *****************************************************************************************
         * CUSTOM METHODS
         ***************************************************************************************** */

        static async findValidOne(code, challengeId = null) {
            const rows = await sequelize.query(
                `
                SELECT
                    offres.*
                FROM
                    offres
                LEFT JOIN offres_quantite ON offres_quantite.code = offres.code
                WHERE
                    (offres_quantite.quantite_restante IS NULL OR offres_quantite.quantite_restante > 0)
                    AND
                    (offres.date_debut IS NULL OR offres.date_debut <= now()::date)
                    AND
                    (offres.date_fin IS NULL OR offres.date_fin >= now()::date)
                    AND
                    offres.code = :code
                    AND (offres.fk_challenge IS NULL${challengeId ? ` OR offres.fk_challenge = :challengeId` : ''})
                `,
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: {
                        code,
                        challengeId,
                    },
                },
            );

            return rows.length === 1 ? rows[0] : null;
        }

        /** *****************************************************************************************
         * ASSOCIATIONS
         ***************************************************************************************** */

        /**
         * Creates the proper associations between this model and others
         *
         * @param {Object.<String,Model>} models
         *
         * @returns {undefined}
         */
        static associate(models) {
            models.Offre.hasMany(models.LigneReduction, {
                foreignKey: 'fk_offre',
            });
            models.Offre.belongsTo(models.Produit, {
                foreignKey: 'fk_challenge',
            });
        }
    }

    // The End
    return Offre;
};
