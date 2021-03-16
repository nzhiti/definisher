const { strava } = require('#app/config');

module.exports = async (req, res) => {
    const {
        'hub.mode': mode,
        'hub.challenge': challenge,
        'hub.verify_token': token,
    } = req.query;

    if (mode !== 'subscribe') {
        return res.status(400).send({
            user_message: 'Mode invalide',
        });
    }

    if (token !== strava.token) {
        return res.status(400).send({
            user_message: 'Token invalide',
        });
    }

    return res.status(200).send({
        'hub.challenge': challenge,
    });
};