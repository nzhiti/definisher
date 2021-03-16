const { getPasswordResetLink } = require('#app/utils/auth');
const db = require('#db/index');
const { dateToFormat } = require('#app/utils/date');
const { send: sendMail } = require('#app/utils/mail');

module.exports = async (req, res) => {
    // validate the email
    const { email } = req.params;

    if (typeof email !== 'string') {
        return res.status(400).send({
            user_message: 'L\'email est obligatoire',
        });
    }

    // ensure a user exists
    const sanitizedEmail = db.Utilisateur.cleanEmail(email);

    let utilisateur;
    try {
        utilisateur = await db.Utilisateur.findOne({
            where: {
                email: sanitizedEmail,
            }
        });
    } catch (error) {
        return res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });
    }

    if (utilisateur === null) {
        return res.status(203).send({});
    }

    // ensure the user is not already activated 
    if (utilisateur.est_actif === false) {
        return res.status(400).send({
            user_message: 'Vous devez d\'abord activer votre compte avant de changer de mot de passe',
        });
    }

    // send the mail
    const { link, expiracyDate } = getPasswordResetLink(utilisateur);
    const formattedDate = dateToFormat(expiracyDate, 'd M Y, à h:i');
    try {
        await sendMail(utilisateur, {
            'Subject': 'Votre nouveau mot de passe',

            'TextPart': `Bonjour ${utilisateur.cleanPrenom},\n\nNous avons reçu une demande de réinitialisation du mot de passe de votre compte Definisher.\nSi vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce mail.\n\nSi vous souhaitez effectivement réinitialiser votre mot de passe, merci de copier le lien suivant dans votre navigateur avant le ${formattedDate} :\n\n${link}\n\nCe lien vous permettra de choisir un nouveau mot de passe.\n\nL'équipe Definisher`,

            'HTMLPart': `Bonjour ${utilisateur.cleanPrenom},<br/><br/>Nous avons reçu une demande de réinitialisation du mot de passe de votre compte Definisher.<br/><strrong>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce mail.</strong><br/><br/>Si vous souhaitez effectivement réinitialiser votre mot de passe, merci de cliquer sur le lien suivant avant le ${formattedDate} :<br/><br/><a href="${link}">${link}</a><br/><br/>(<em>Si le lien n'est pas cliquable, vous pouvez toujours le copier à la main dans votre navigateur.</em>)<br/><br/>Ce lien vous permettra de choisir un nouveau mot de passe.<br/><br/>L'équipe Definisher`,
        });
    } catch (error) {
        return res.status(500).send({
            user_message: 'L\'envoi du mail de réinitialisation du mot de passe a échoué',
        });
    }

    // hurray
    return res.status(204).send({});
};