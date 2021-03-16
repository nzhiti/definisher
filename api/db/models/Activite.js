const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    /** *********************************************************************************************
     * SCHEMA
     ********************************************************************************************* */

    class Schema extends Model { }
    Schema.init({
        activite_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        distance: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        denivele: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        uid: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        fk_utilisateur: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        fk_goal: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        tableName: 'activites',
    });

    /**
     * @constraint fk_activites_goal
     */

    /**
     * @constraint fk_activites_utilisateur
     */

    /**
     * @constraint uk_activites_uid
     * 
     * Ensures every tuple (uid, fk_goal, fk_utilisateur) is unique
     */


    class Activite extends Schema {
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
            // @none
        }
    }

    // The End
    return Activite;
};
