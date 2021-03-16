const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    /** *********************************************************************************************
     * SCHEMA
     ********************************************************************************************* */

    class Schema extends Model { }
    Schema.init({
        adresse_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        adresse: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        ville: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        code_postal: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        region: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        fk_pays: {
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
        tableName: 'adresses',
    });

    /**
     * @constraint fk_adresses_pays
     */


    class Adresse extends Schema {
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
            models.Adresse.belongsTo(models.Pays, {
                foreignKey: 'fk_pays',
            });
            models.Adresse.hasOne(models.Commande, {
                foreignKey: 'fk_adresse_livraison',
            });
        }
    }

    // The End
    return Adresse;
};
