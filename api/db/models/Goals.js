const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    /** *********************************************************************************************
     * SCHEMA
     ********************************************************************************************* */

    class Schema extends Model { }
    Schema.init({
        goal_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        fk_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        fk_challenge: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        distance: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },

        denivele: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        ordre: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        en_une_activite: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        manuel_autorise: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.NOW,
        },

        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
            onUpdate: sequelize.NOW,
        },
    }, {
        sequelize,
        tableName: 'goals',
    });

    /**
     * @constraint fk_type
     */

    /**
     * @constraint fk_challenge
     */

    /**
     * @constraint uk_goals_ordre
     */

    /**
     * @constraint check_ordre_min
     * 
     * Ensures "ordre" is either >= 1
     */

    /**
     * @constraint check_distance
     * 
     * Ensures "distance" is either null or > 0.0
     */

    /**
     * @constraint check_denivele
     * 
     * Ensures "denivele" is either null or > 0
     */

    /**
     * @constraint check_objectif
     * 
     * Ensures "distance" and "denivele" are not both null
     */


    class Goal extends Schema {
        /** *****************************************************************************************
         * CUSTOM METHODS
         ***************************************************************************************** */

        // none

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
            models.Goal.belongsTo(models.GoalType, {
                foreignKey: 'fk_type',
            });
            models.Goal.belongsTo(models.Produit, {
                foreignKey: 'fk_challenge',
            });
        }
    }

    // The End
    return Goal;
};
