const { generateAccessTokenFor } = require('#app/utils/auth');

module.exports = async (req, res) => {
    return res.status(200).send({
        token: generateAccessTokenFor(req.utilisateur),
    });
};