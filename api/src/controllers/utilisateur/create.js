const { trim, isEmail } = require('validator');
const db = require('#db/index');
const { dateToFormat } = require('#app/utils/date');
const { send: sendMail } = require('#app/utils/mail');
const { generateSalt, hashPassword, getAccountActivationLink } = require('#app/utils/auth');

function sanitize(input) {
    const sanitized = {
        email: null,
        mot_de_passe: null,
        prenom: null,
        nom_de_famille: null,
    };

    if (typeof input.email === 'string') {
        sanitized.email = db.Utilisateur.cleanEmail(input.email);
    }

    if (typeof input.mot_de_passe === 'string') {
        sanitized.mot_de_passe = input.mot_de_passe;
    }

    if (typeof input.prenom === 'string') {
        sanitized.prenom = trim(input.prenom);
    }

    if (typeof input.nom_de_famille === 'string') {
        sanitized.nom_de_famille = trim(input.nom_de_famille);
    }

    return sanitized;
}

async function validate(input) {
    const errors = {};
    function addError(input, error) {
        if (errors[input] === undefined) {
            errors[input] = [];
        }

        errors[input].push(error);
    }

    // email
    if (input.email === null) {
        addError('email', 'L\'email est obligatoire');
    } else if (!isEmail(input.email)) {
        addError('email', 'L\'email est invalide');
    } else {
        const utilisateur = await db.Utilisateur.findOne({
            where: {
                email: input.email,
            },
        });
        if (utilisateur !== null) {
            addError('email', 'Cet email est déjà utilisé par un autre utilisateur');
        }
    }

    // password
    if (input.mot_de_passe === null) {
        addError('mot_de_passe', 'Le mot de passe est obligatoire');
    } else {
        db.Utilisateur
            .checkPassword(input.mot_de_passe)
            .forEach(error => addError('mot_de_passe', error));
    }

    // first name
    if (input.prenom === null || input.prenom === '') {
        addError('prenom', 'Le prénom est obligatoire');
    }

    // last name
    if (input.nom_de_famille === null || input.nom_de_famille === '') {
        addError('nom_de_famille', 'Le nom de famille est obligatoire');
    }

    return errors;
}

module.exports = async (req, res) => {
    // validate input
    const input = sanitize(req.body);

    let errors = {};
    try {
        errors = await validate(input);
    } catch (error) {
        return res.status(500).send({
            user_message: 'Une erreur inconnue est survenue lors de la validation de vos données',
        });
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).send({
            user_message: 'Certaines informations saisies sont incorrectes',
            details: errors,
        });
    }

    // insert user into database
    let utilisateur;
    const sel = generateSalt();
    try {
        utilisateur = await db.Utilisateur.create({
            email: input.email,
            mot_de_passe: hashPassword(input.mot_de_passe, sel),
            sel,
            prenom: input.prenom,
            nom_de_famille: input.nom_de_famille,
            est_actif: false,
            est_administrateur: false,
        });
    } catch (error) {
        return res.status(500).send({
            user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
        });
    }

    // send mails
    const { link, expiracyDate } = getAccountActivationLink(utilisateur);
    const formattedDate = dateToFormat(expiracyDate, 'd M Y, à h:i');

    try {
        await sendMail(utilisateur, {
            'Subject': 'Activation de votre compte Definisher',

            'TextPart': `Bonjour ${utilisateur.cleanPrenom},\n\nAfin d'assurer la validité de votre adresse email, et pour pouvoir activer définitivement votre compte Definisher, merci de copier le lien suivant dans votre navigateur avant le ${formattedDate} :\n\n${link}\n\nUne fois cela fait, vous pourrez vous connecter à l'espace membre, vous inscrire à nos nombreux challenges, et relever nos défis !\n\nL'équipe Definisher`,

            'HTMLPart': `Bonjour ${utilisateur.cleanPrenom},<br/><br/>Afin d'assurer la validité de votre adresse email, et pour pouvoir activer définitivement votre compte Definisher, merci de cliquer sur le lien suivant avant le ${formattedDate} :<br/><br/><a href="${link}">${link}</a><br/><br/>(<em>Si le lien n'est pas cliquable, vous pouvez toujours le copier à la main dans votre navigateur.</em>)<br/><br/>Une fois cela fait, vous pourrez vous connecter à l'espace membre, vous inscrire à nos nombreux challenges, et relever nos défis !<br/><br/>L'équipe Definisher`,
        });
    } catch (error) {
        return res.status(500).send({
            user_message: 'Votre compte utilisateur a été créé, mais le mail d\'activation n\'a pas pu être envoyé'
        });
    }

    // congratulations
    return res.status(200).send({
        user: utilisateur.serialize(),
    });
};