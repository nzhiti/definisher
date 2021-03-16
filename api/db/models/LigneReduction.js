const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    /** *********************************************************************************************
     * SCHEMA
     ********************************************************************************************* */

    class Schema extends Model { }
    Schema.init({
        lignes_reduction_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        fk_commande: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        fk_offre: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        libelle: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        pourcentage: {
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
        tableName: 'lignes_reduction',
    });

    /**
     * @constraint fk_lignes_reduction_commande
     */

    /**
     * @constraint fk_lignes_reduction_offre
     */

    /**
     * @constraint uk_lignes_reduction
     * 
     * Ensures a commande cannot have more than one reduction
     */

    /**
     * @constraint check_pourcentage
     * 
     * Ensures pourcentage is > 0 and <= 100
     */


    class LigneReduction extends Schema {
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
            models.LigneReduction.belongsTo(models.Commande, {
                foreignKey: 'fk_commande',
            });
            models.LigneReduction.belongsTo(models.Offre, {
                foreignKey: 'fk_offre',
            });
        }
    }

    // The End
    return LigneReduction;
};
