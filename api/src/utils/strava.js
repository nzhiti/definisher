const strava = require('strava-v3');
const db = require('#db');

module.exports = {
    refreshToken: async (utilisateur) => {
        if (utilisateur.strava_expires_at !== null
            && utilisateur.strava_expires_at - (Date.now() / 1000) > 2) {
            return utilisateur.strava_access_token;
        }

        const {
            access_token,
            refresh_token,
            expires_at
        } = await strava.oauth.refreshToken(utilisateur.strava_refresh_token);

        await db.Utilisateur.update(
            {
                strava_access_token: access_token,
                strava_refresh_token: refresh_token,
                strava_expires_at: expires_at,
            },
            {
                where: {
                    utilisateur_id: utilisateur.utilisateur_id,
                },
            },
        );

        return access_token;
    },

    register: (utilisateur, activite) => {
        const challenges = [...utilisateur.challengeActifs];
        challenges.forEach(c => {
            c.etapeEnCours = c.etapes.find(({ distance_restante, denivele_restant }) => {
                return distance_restante > 0 || denivele_restant > 0;
            });
        });

        const today = new Date();
        const eligibleChallenges = challenges
            .filter((challenge) => {
                const date = new Date(activite.start_date);
                if (date < challenge.souscrit_le) {
                    return false;
                }

                if (challenge.date_debut !== null && date < challenge.date_debut) {
                    return false;
                }

                if (challenge.date_fin !== null && date > challenge.date_fin) {
                    return false;
                }

                if (challenge.etapeEnCours.en_une_activite === true) {
                    if (challenge.etapeEnCours.distance !== null && activite.distance < challenge.etapeEnCours.distance) {
                        return false;
                    }

                    if (challenge.etapeEnCours.denivele !== null && activite.denivele < challenge.etapeEnCours.denivele) {
                        return false;
                    }
                }

                const allowedTypes = challenge.etapeEnCours.strava_types.split(';');
                if (allowedTypes.indexOf(activite.type) === -1) {
                    return false;
                }

                if ((!activite.map || activite.map.summary_polyline === null) && challenge.etapeEnCours.manuel_autorise !== true) {
                    return false;
                }

                if (challenge.delai_maximum !== null && challenge.etapes[0].premiere_activite_le !== null) {
                    const diff = (today - new Date(challenge.etapes[0].premiere_activite_le)) / (1000 * 60);
                    if (diff > challenge.delai_maximum) {
                        return false;
                    }
                }

                return true;
            });

        if (eligibleChallenges.length === 0) {
            return 'Pas de défi éligible';
        }

        // enregistrer l'activité en base
        const denivele = parseInt(Math.floor(activite.total_elevation_gain), 10);

        return db.sequelize.transaction(async (transaction) => {
            return Promise.all(
                eligibleChallenges.map((challenge) => {
                    return db.Activite.create({
                        distance: activite.distance,
                        denivele: denivele,
                        uid: activite.id,
                        date: activite.start_date,
                        fk_utilisateur: utilisateur.utilisateur_id,
                        fk_goal: challenge.etapeEnCours.id,
                    }, { transaction });
                }),
            );
        });
    },
};