const strava = require('strava-v3');
const config = require('#app/config');

module.exports = async (req, res) => {
    try {
        return res.status(200).send(
            await strava.pushSubscriptions.create({
                callback_url: `${config.host.path}/strava/activities`,
                verify_token: config.strava.token,
            }),
        );
    } catch (error) {
        return res.status(500).send({
            user_message: 'Une erreur est survenue lors de l\'inscription aux webhooks Strava',
        });
    }
};