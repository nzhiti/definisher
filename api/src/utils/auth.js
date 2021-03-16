const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
    frontend_url: frontUrl,
    authentication: authConfig,
    activationTokenExpiresIn,
    passwordResetTokenExpiresIn,
} = require('#app/config');
const db = require('#db/index');

class AuthenticateError extends Error {
    constructor(details, ...args) {
        super(details.user_message, ...args);
        this.details = details;
    }
}

/**
 * Generates an access token for the given user
 *
 * @param {Utilisateur} user
 * @param {String}      [type]
 * @param {string}      [expiresIn]
 *
 * @returns {string}
 */
function generateAccessTokenFor(utilisateur, type = 'default', expiresIn = null) {
    return jwt.sign(
        {
            type,
            id: utilisateur.utilisateur_id,
            email: utilisateur.email,
        },
        authConfig.secret,
        {
            expiresIn: expiresIn !== null ? expiresIn : authConfig.expiresIn,
        },
    );
}

module.exports = {
    generateAccessTokenFor,

    /**
     * Authenticates a user based on the given access-token
     * 
     * @param {HttpReq} req
     * 
     * @returns {Utilisateur}
     */
    async authenticate(req) {
        const token = (req.headers && req.headers['x-access-token']) || req.query.accessToken;

        if (!token) {
            throw new AuthenticateError({
                code: 1,
                user_message: 'Vous devez être connecté pour accéder à ce contenu',
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, authConfig.secret);
        } catch (error) {
            throw new AuthenticateError({
                code: 2,
                user_message: 'Votre session a expiré',
            });
        }

        let utilisateur;
        try {
            utilisateur = await db.Utilisateur.findOneFull(decoded.id);
        } catch (error) {
            throw error;
        }

        if (utilisateur === null) {
            throw new AuthenticateError({
                code: 3,
                user_message: 'Votre session a expiré',
            });
        }

        if (utilisateur.est_actif !== true) {
            throw new AuthenticateError({
                code: 4,
                user_message: 'Votre session a expiré',
            });
        }

        return utilisateur;
    },

    /**
     * Hashes the given password
     *
     * @param {string} password The plain password
     * @param {string} salt     The salt to be used
     *
     * @returns {string}
     */
    hashPassword(password, salt) {
        return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    },

    /**
     * Generates a random salt
     *
     * @returns {string}
     */
    generateSalt() {
        return crypto.randomBytes(16).toString('hex');
    },

    /**
     * Generates a user activation link
     *
     * @param {Utilisateur} utilisateur
     *
     * @returns {Object}
     */
    getAccountActivationLink(utilisateur) {
        if (!utilisateur) {
            throw new Error('`utilisateur` is mandatory to generate an account activation link');
        }

        const token = generateAccessTokenFor(utilisateur, 'activation', activationTokenExpiresIn);

        return {
            link: `${frontUrl}/activer-mon-compte/${utilisateur.utilisateur_id}/${encodeURIComponent(token)}#titre`,
            expiracyDate: new Date(Date.now() + (parseInt(activationTokenExpiresIn, 10) * 60 * 60 * 1000)),
        };
    },

    /**
     * Generates a password-reset link
     *
     * @param {Utilisateur} utilisateur
     *
     * @returns {String}
     */
    getPasswordResetLink(utilisateur) {
        if (!utilisateur) {
            throw new Error('`utilisateur` is mandatory to generate a password-reset link');
        }

        const token = generateAccessTokenFor(utilisateur, 'password_reset', passwordResetTokenExpiresIn);

        return {
            link: `${frontUrl}/nouveau-mot-de-passe/${utilisateur.utilisateur_id}/${encodeURIComponent(token)}#titre`,
            expiracyDate: new Date(Date.now() + (parseInt(passwordResetTokenExpiresIn, 10) * 60 * 60 * 1000)),
        };
    },
};
