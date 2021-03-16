const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    /** *********************************************************************************************
     * SCHEMA
     ********************************************************************************************* */

    class Schema extends Model { }
    Schema.init({
        ligne_achat_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        fk_commande: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        fk_challenge: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        libelle: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        montant: {
            type: DataTypes.FLOAT,
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
        tableName: 'lignes_achat',
    });

    /**
     * @constraint fk_lignes_achat_commande
     */

    /**
     * @constraint fk_lignes_achat_challenge
     */

    /**
     * @constraint uk_lignes_achat_produit
     * 
     * Ensures a single commmande does not reference the same challenge more than once
     */

    /**
     * @constraint check_montant
     * 
     * Ensures montant is > 0.0
     */


    class LigneAchat extends Schema {
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
            models.LigneAchat.belongsTo(models.Commande, {
                foreignKey: 'fk_commande',
            });
            models.LigneAchat.belongsTo(models.Produit, {
                foreignKey: 'fk_challenge',
            });
        }
    }

    // The End
    return LigneAchat;
};
