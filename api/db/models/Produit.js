const config = require('#app/config');
const { Model } = require('sequelize');
const fs = require('fs');
const path = require('path');

module.exports = (sequelize, DataTypes) => {
    /** *********************************************************************************************
     * SCHEMA
     ********************************************************************************************* */

    class Schema extends Model { }
    Schema.init({
        challenge_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        slug: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        catch: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description_titre: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description_contenu: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        medaille_titre: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        medaille_contenu: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        prix: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        type: {
            type: DataTypes.ENUM('run', 'tri'),
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

        quantite: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        date_debut: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        date_fin: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        visible: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

        fk_theme: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        en_une_activite: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        code_obligatoire: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        code_obligatoire: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        delai_maximum: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        par_equipe: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        // abstract columns, generated in the view
        quantite_restante: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
        tableName: 'produits', // that's a view based on table "challenges"
    });

    /**
     * @constraint uk_challenges_slug
     */

    /**
     * @constraint fk_challenges_theme
     */

    /**
     * @constraint check_price
     * 
     * Ensures "prix" is > 0.0
     */

    /**
     * @constraint check_quantite
     * 
     * Ensures "quantite" is either null or > 0
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


    class Produit extends Schema {
        /** *****************************************************************************************
         * CUSTOM METHODS
         ***************************************************************************************** */

        static myFindAll() {
            return Produit.findAll({
                where: {
                    // visible: true,
                },
                order: [['challenge_id', 'ASC']]
            });
        }

        serialize() {
            const slides = fs
                .readdirSync(path.resolve(config.assetsPath, 'img', `${this.slug}`))
                .filter((name) => /^slide_[0-9]+\.jpg$/.test(name));

            const today = new Date();

            const assetsUsedInDescription = this.description_contenu.match(/:assets(\/.+)+:/g);
            const descriptionContenu = (assetsUsedInDescription || [])
                .map(m => m.split('').slice(8, -1).join(''))
                .reduce((description, match) => {
                    const filePath = path.resolve(config.assetsPath, match);

                    if (!fs.existsSync(filePath)) {
                        return description;
                    }

                    return description.replace(
                        `:assets/${match}:`,
                        `${config.host.path}/assets/${match}`,
                    );
                }, this.description_contenu);

            return {
                id: this.challenge_id,
                slug: this.slug,
                nom: this.nom,
                type: this.type,
                description: this.description,
                catch: this.catch,
                sections: {
                    description: {
                        titre: this.description_titre,
                        contenu: descriptionContenu,
                    },
                    medaille: {
                        titre: this.medaille_titre,
                        contenu: this.medaille_contenu,
                    },
                },
                prix: this.prix,
                theme: this.fk_theme,
                date_debut: this.date_debut !== null ? this.date_debut.getTime() : null,
                pas_encore_debute: this.date_debut !== null && today < this.date_debut,
                par_equipe: this.par_equipe === true,
                est_expire: this.date_fin !== null && today > this.date_fin,
                est_complet: this.quantite_restante !== null && this.quantite_restante <= 0,
                images: {
                    miniature: `${config.host.path}/assets/img/${this.slug}/miniature.jpg`,
                    banner: `${config.host.path}/assets/img/${this.slug}/banner.jpg`,
                    medal: `${config.host.path}/assets/img/${this.slug}/medal.png`,
                    slideshow: slides.map((name, index) => ({
                        src: `${config.host.path}/assets/img/${this.slug}/${name}`,
                        alt: `Photo ${index + 1} du parcours`,
                    })),
                },
                visible: this.visible,
            };
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
            models.Produit.belongsTo(models.Theme, {
                foreignKey: 'fk_theme',
            });
            models.Produit.hasMany(models.LigneAchat, {
                foreignKey: 'fk_challenge',
            });
            models.Produit.hasMany(models.Offre, {
                foreignKey: 'fk_challenge',
            });
            models.Produit.hasMany(models.Goal, {
                foreignKey: 'fk_challenge',
            });
        }
    }

    // The End
    return Produit;
};
