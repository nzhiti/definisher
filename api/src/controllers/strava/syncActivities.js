const strava = require('strava-v3');
const stravaUtils = require('#app/utils/strava');
const db = require('#db');
const logger = require('#app/utils/logger');

module.exports = async (req, res) => {
    let utilisateur;
    try {
        utilisateur = await db.Utilisateur.findOneFull(787);
    } catch (error) {
        logger.error({
            event: 'SYNC_FAILURE',
            message: 'Une erreur est survenue lors de la lecture en base de données (2)',
            error,
        });
        return res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données (2)',
        });
    }

    // for all these users, refresh the access token
    try {
        await stravaUtils.refreshToken(utilisateur).then((accessToken) => {
            utilisateur.strava_access_token = accessToken;
        });
    } catch (error) {
        logger.error({
            event: 'SYNC_FAILURE',
            message: 'Une erreur est survenue lors de la mise à jour du token des utilisateurs',
            error,
        });
        return res.status(500).send({
            user_message: 'Une erreur est survenue lors de la mise à jour du token des utilisateurs',
        });
    }

    // filter out users with no active challenge
    if (utilisateur.challengeActifs.length === 0) {
        return res.status(200).send({});
    }

    // get the date of the last known activite
    const refDate = utilisateur.challengeActifs.reduce((date, challenge) => {
        let challengeRefDate = challenge.souscrit_le;
        if (challenge.date_debut !== null && challenge.date_debut > challenge.souscrit_le) {
            challengeRefDate = challenge.date_debut;
        }

        if (date === null || date > challengeRefDate) {
            return challengeRefDate;
        }

        return date;
    }, null);

    // fetch all activities since the reference date
    logger.info({
        event: 'SYNC_INFO',
        message: 'Fetching activities for user #' + utilisateur.utilisateur_id,
        refDate,
    });
    const activites = await strava.athlete.listActivities({
        after: refDate.getTime() / 1000,
        access_token: utilisateur.strava_access_token,
    });

    logger.info({
        event: 'SYNC_INFO',
        message: 'Found ' + activites.length + ' activities for user #' + utilisateur.utilisateur_id,
        refDate,
    });
    await Promise.all(
        activites.map((activite) => stravaUtils.register(utilisateur, activite)),
    );

    return res.status(200).send({});
};