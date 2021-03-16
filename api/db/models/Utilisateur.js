const { trim } = require('validator');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    /** *********************************************************************************************
     * SCHEMA
     ********************************************************************************************* */

    class Schema extends Model { }
    Schema.init({
        utilisateur_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        prenom: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        nom_de_famille: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        mot_de_passe: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        sel: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        est_actif: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

        est_administrateur: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

        strava_access_token: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        strava_refresh_token: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        strava_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        strava_expires_at: {
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
        tableName: 'utilisateurs',
    });

    /**
     * @constraint uk_utilisateurs_email
     */


    class Utilisateur extends Schema {
        /** *****************************************************************************************
         * CUSTOM METHODS
         ***************************************************************************************** */

        static async findOneFull(id = null, stravaId = null) {
            // get the user with it's list of commande ids
            let rows = await sequelize.query(
                `
                    SELECT
                        utilisateurs.*,
                        commandes.commande_id
                    FROM
                        utilisateurs
                    LEFT JOIN commandes ON (commandes.fk_utilisateur = utilisateurs.utilisateur_id AND commandes.payee = TRUE)
                    WHERE
                        utilisateurs.${id !== null ? 'utilisateur_id' : 'strava_id'} = :id
                `,
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: {
                        id: id !== null ? id : stravaId,
                    },
                },
            );

            if (rows.length === 0) {
                return null;
            }

            // get full details about each commande
            const utilisateur = new Utilisateur(rows[0]);
            utilisateur.commandes = (await Utilisateur.models.Commande.findFull(
                rows.map(({ commande_id }) => commande_id),
            ));

            // get full details about challenges related to the commandes
            if (utilisateur.challengeIds.length > 0) {
                rows = await sequelize.query(
                    `
                        SELECT
                            ch.challenge_id,
                            ch.nom AS "challenge_nom",
                            ch.slug AS "challenge_slug",
                            ch.date_debut AS "challenge_date_debut",
                            ch.date_fin AS "challenge_date_fin",
                            ch.delai_maximum AS "challenge_delai_maximum",
                            tmp.premiere_activite as "goal_premiere_activite_le",
                            ch.par_equipe,
                            g.goal_id,
                            g.en_une_activite,
                            g.manuel_autorise,
                            gt.strava_types,
                            gt.nom,
                            pr.*
                        FROM
                            progressions_agregees pr
                        LEFT JOIN
                            goals g ON pr.goal_id = g.goal_id
                        LEFT JOIN
                            goal_types gt ON g.fk_type = gt.slug
                        LEFT JOIN
                            challenges ch ON g.fk_challenge = ch.challenge_id
                        LEFT JOIN
                            (SELECT fk_utilisateur, fk_goal, MIN(activites.date) AS premiere_activite FROM activites GROUP BY fk_utilisateur, fk_goal) tmp
                            ON
                            (tmp.fk_goal = g.goal_id AND tmp.fk_utilisateur = :utilisateurId)
                        WHERE
                            pr.utilisateur_id = :utilisateurId AND g.fk_challenge IN (:challengeIds)
                        ORDER BY ch.challenge_id ASC, g.ordre ASC
                    `,
                    {
                        type: sequelize.QueryTypes.SELECT,
                        replacements: {
                            utilisateurId: utilisateur.utilisateur_id,
                            challengeIds: utilisateur.challengeIds,
                        }
                    },
                );

                const hash = {};
                utilisateur.challenges = [];

                rows.forEach((row) => {
                    if (hash[row.challenge_id] === undefined) {
                        const today = new Date();

                        let date_debut = null;
                        if (row.challenge_date_debut !== null) {
                            date_debut = new Date(row.challenge_date_debut);
                        }

                        let date_fin = null;
                        if (row.challenge_date_fin !== null) {
                            date_fin = new Date(row.challenge_date_fin);
                        }

                        hash[row.challenge_id] = {
                            challenge_id: row.challenge_id,
                            slug: row.challenge_slug,
                            nom: row.challenge_nom,
                            date_debut: row.challenge_date_debut,
                            date_fin: row.challenge_date_fin,
                            delai_maximum: row.challenge_delai_maximum,
                            pas_encore_debute: date_debut !== null && today < date_debut,
                            est_expire: date_fin !== null && today > date_fin,
                            souscrit_le: utilisateur.challengeSubscriptionDates[row.challenge_id],
                            par_equipe: row.par_equipe,
                            etapes: [],
                        };
                        utilisateur.challenges.push(hash[row.challenge_id]);
                    }

                    hash[row.challenge_id].etapes.push({
                        id: row.goal_id,
                        nom: row.nom,
                        en_une_activite: row.en_une_activite,
                        distance: row.objectif_distance,
                        denivele: row.objectif_denivele,
                        distance_restante: row.distance_restante,
                        denivele_restant: row.denivele_restant,
                        strava_types: row.strava_types,
                        manuel_autorise: row.manuel_autorise,
                        premiere_activite_le: row.goal_premiere_activite_le,
                        activites: {
                            mine: {
                                number: parseInt(row.total_activites_solo, 10),
                                distance: row.total_distance_solo,
                                denivele: row.total_denivele_solo,
                            },
                            all: row.par_equipe === true
                                ? {
                                    number: parseInt(row.total_activites_equipe, 10),
                                    distance: row.total_distance_equipe || 0,
                                    denivele: row.total_denivele_equipe || 0,
                                }
                                : {
                                    number: parseInt(row.total_activites_solo, 10),
                                    distance: row.total_distance_solo,
                                    denivele: row.total_denivele_solo,
                                },
                        },
                    });
                });

                function calculerPourcentageCompletion(etapes) {
                    const unite = 1 / (etapes.length);

                    let pourcentage = 0;
                    for (let i = 0; i < etapes.length; i += 1) {
                        let p = 0;
                        let divider = 0;
                        if (etapes[i].distance !== null) {
                            p += Math.min(
                                1,
                                (etapes[i].distance - etapes[i].distance_restante) / etapes[i].distance,
                            );
                            divider += 1;
                        }

                        if (etapes[i].denivele !== null) {
                            p += Math.min(
                                1,
                                (etapes[i].denivele - etapes[i].denivele_restant) / etapes[i].denivele,
                            );
                            divider += 1;
                        }

                        let percentage = p / divider;
                        if (percentage < 1) {
                            pourcentage += percentage * unite;
                            break;
                        }

                        pourcentage += unite;
                    }

                    return pourcentage;
                }

                utilisateur.challenges.forEach((challenge) => {
                    challenge.pourcentage_completion = calculerPourcentageCompletion(
                        challenge.etapes,
                    );
                });
            }

            return utilisateur;
        }

        serialize() {
            return {
                id: this.utilisateur_id,
                email: this.email,
                prenom: this.prenom,
                nom_de_famille: this.nom_de_famille,
                est_actif: this.est_actif,
                est_administrateur: this.est_administrateur,
                commandes: this.commandes ? this.commandes.map(Utilisateur.models.Commande.serialize) : [],
                strava_id: this.strava_id,
                challenges: this.challenges || [],
            };
        }

        activate() {
            return Utilisateur.update({ est_actif: true }, {
                where: {
                    utilisateur_id: this.utilisateur_id,
                }
            });
        }

        get challengeIds() {
            if (!this.commandes) {
                return [];
            }

            return this.commandes.reduce((list, { lignes_achat }) => {
                return [
                    ...list,
                    ...lignes_achat.map(({ fk_challenge }) => fk_challenge),
                ];
            }, []);
        }

        get challengeSubscriptionDates() {
            return this.commandes.reduce((acc, { created_at, lignes_achat }) => Object.assign(
                {},
                acc,
                lignes_achat.reduce((subAcc, { fk_challenge }) => Object.assign({}, subAcc, {
                    [fk_challenge]: created_at,
                }), {}),
            ), {});
        }

        get challengeActifs() {
            if (!this.challenges) {
                return [];
            }

            const today = new Date();

            return this.challenges.filter(({ pourcentage_completion, date_debut, date_fin }) => {
                // has the challenge started?
                if (date_debut !== null && today < date_debut) {
                    return false;
                }

                // is it over?
                return pourcentage_completion < 1;
            });
        }

        get nom() {
            return `${this.cleanPrenom} ${this.nom_de_famille.toUpperCase()}`;
        }

        get cleanPrenom() {
            return `${this.prenom.slice(0, 1).toUpperCase()}${this.prenom.slice(1)}`;
        }

        static cleanEmail(email) {
            return trim(email).toLowerCase();
        }

        static checkPassword(password) {
            if (password.length < 10) {
                return ['Le mot de passe doit faire au moins 10 caractères'];
            }

            return [];
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
            Utilisateur.models = models;

            models.Utilisateur.hasMany(models.Commande, {
                foreignKey: 'fk_utilisateur',
            });
        }
    }

    // The End
    return Utilisateur;
};
