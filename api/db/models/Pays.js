const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    /** *********************************************************************************************
     * SCHEMA
     ********************************************************************************************* */

    class Schema extends Model { }
    Schema.init({
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },

        nom: {
            type: DataTypes.STRING,
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
        tableName: 'pays',
    });

    /**
     * @constraint uk_pays_nom
     */


    class Pays extends Schema {
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
            models.Pays.hasMany(models.Adresse, {
                foreignKey: 'fk_pays',
            });
        }
    }

    // The End
    return Pays;
};
