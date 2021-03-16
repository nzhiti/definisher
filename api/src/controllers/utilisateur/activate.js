const jwt = require('jsonwebtoken');
const { authentication: authConfig } = require('#app/config');
const db = require('#db/index');

module.exports = async (req, res) => {
    // valider le token
    const { token } = req.body;

    let decoded;
    try {
        decoded = jwt.verify(token, authConfig.secret);
    } catch (error) {
        return res.status(400).send({
            code: 1,
            user_message: 'Le jeton d\'activation est invalide ou expiré',
        });
    }

    if (decoded.type !== 'activation') {
        return res.status(400).send({
            code: 2,
            user_message: 'Le jeton d\'activation est invalide ou expiré',
        });
    }

    if (parseInt(req.params.utilisateur_id, 10) !== parseInt(decoded.id, 10)) {
        return res.status(400).send({
            code: 3,
            user_message: 'Le jeton d\'activation est invalide ou expiré',
        });
    }

    let utilisateur;
    try {
        utilisateur = await db.Utilisateur.findOne({
            where: {
                utilisateur_id: parseInt(decoded.id, 10),
            }
        });
    } catch (error) {
        return res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });
    }

    if (utilisateur === null) {
        return res.status(400).send({
            code: 4,
            user_message: 'Le jeton d\'activation est invalide ou expiré',
        });
    }

    if (decoded.email !== utilisateur.email) {
        return res.status(400).send({
            code: 5,
            user_message: 'Le jeton d\'activation est invalide ou expiré',
        });
    }

    if (utilisateur.est_actif === true) {
        return res.status(400).send({
            user_message: 'Ce compte utilisateur est déjà activé',
        });
    }

    try {
        await utilisateur.activate();
    } catch (error) {
        return res.status(500).send({
            user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
        });
    }

    return res.status(200).send(utilisateur.serialize());
};