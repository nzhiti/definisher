const jwt = require('jsonwebtoken');
const { authentication: authConfig } = require('#app/config');
const db = require('#db/index');
const { hashPassword } = require('#app/utils/auth');

module.exports = async (req, res) => {
    // valider le token
    const { token, mot_de_passe } = req.body;

    let decoded;
    try {
        decoded = jwt.verify(token, authConfig.secret);
    } catch (error) {
        return res.status(400).send({
            code: 1,
            user_message: 'Le jeton est invalide ou expiré',
        });
    }

    if (decoded.type !== 'password_reset') {
        return res.status(400).send({
            code: 2,
            user_message: 'Le jeton est invalide ou expiré',
        });
    }

    if (parseInt(req.params.utilisateur_id, 10) !== parseInt(decoded.id, 10)) {
        return res.status(400).send({
            code: 3,
            user_message: 'Le jeton est invalide ou expiré',
        });
    }

    // valider l'utilisateur
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
            user_message: 'Le jeton est invalide ou expiré',
        });
    }

    if (decoded.email !== utilisateur.email) {
        return res.status(400).send({
            code: 5,
            user_message: 'Le jeton est invalide ou expiré',
        });
    }

    if (utilisateur.est_actif !== true) {
        return res.status(400).send({
            user_message: 'Ce compte utilisateur n\'a pas encore été activé, son mot de passe ne peut pas être modifié',
        });
    }

    // valider le mot de passe
    if (typeof mot_de_passe !== 'string') {
        return res.status(400).send({
            user_message: 'Certaines informations saisies sont incorrectes',
            details: {
                mot_de_passe: ['Le mot de passe est obligatoire'],
            },
        });
    }

    const errors = db.Utilisateur.checkPassword(mot_de_passe);
    if (errors.length > 0) {
        return res.status(400).send({
            user_message: 'Certaines informations saisies sont incorrectes',
            details: {
                mot_de_passe: errors,
            },
        });
    }

    try {
        await db.Utilisateur.update(
            {
                mot_de_passe: hashPassword(mot_de_passe, utilisateur.sel),
            },
            {
                where: {
                    utilisateur_id: utilisateur.utilisateur_id,
                }
            },
        );
    } catch (error) {
        return res.status(500).send({
            user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
        });
    }

    // epic success
    return res.status(203).send({});
};