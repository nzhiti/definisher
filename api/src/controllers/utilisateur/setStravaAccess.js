const strava = require('strava-v3');
const db = require('#db');

module.exports = async (req, res) => {
    let data;
    try {
        data = await strava.oauth.getToken(req.body.code);
    } catch (error) {
        return res.status(500).send({
            user_message: 'Une erreur est survenue lors de la synchronisation avec Strava',
        });
    }

    try {
        const obj = {
            strava_access_token: data.access_token,
            strava_refresh_token: data.refresh_token,
            strava_id: data.athlete.id,
            strava_expires_at: data.expires_at,
        };
        await db.Utilisateur.update(obj, {
            where: {
                utilisateur_id: req.utilisateur.utilisateur_id,
            },
        });
        return res.status(200).send(obj);
    } catch (error) {
        return res.status(500).send({
            user_message: 'Une erreur est survenue lors de la mise à jour de la base de donnés',
        });
    }
};