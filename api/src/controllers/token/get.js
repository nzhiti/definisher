const db = require('#db/index');
const { hashPassword, generateAccessTokenFor } = require('#app/utils/auth');

module.exports = async (req, res) => {
    const { email, mot_de_passe } = req.query;

    if (typeof email !== 'string' || typeof mot_de_passe !== 'string') {
        return res.status(403).send({
            user_message: 'Ces identifiants sont incorrects',
        });
    }

    const utilisateur = await db.Utilisateur.findOne({
        where: {
            email: email,
        },
    });

    if (utilisateur === null) {
        return res.status(403).send({
            user_message: 'Ces identifiants sont incorrects',
        });
    }

    if (utilisateur.est_actif !== true) {
        return res.status(400).send({
            user_message: 'Vous devez activer votre compte avant de pouvoir vous connecter',
        });
    }

    const hashedPassword = hashPassword(mot_de_passe, utilisateur.sel);
    if (hashedPassword !== utilisateur.mot_de_passe) {
        return res.status(403).send({
            user_message: 'Ces identifiants sont incorrects',
        });
    }

    return res.status(200).send({
        id: utilisateur.utilisateur_id,
        token: generateAccessTokenFor(utilisateur),
    });
};