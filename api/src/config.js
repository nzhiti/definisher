const path = require('path');

const config = {
    port: process.env.PORT,
    host: {
        name: process.env.HOSTNAME,
        port: process.env.PORT,
    },
    frontend_url: process.env.FRONT_URL,
    authentication: {
        secret: process.env.AUTH_SECRET,
        expiresIn: `${24 * 7}h`,
    },
    mailjet: {
        publicKey: process.env.MAIL_PUBLIC_KEY,
        privateKey: process.env.MAIL_PRIVATE_KEY,
    },
    stripe: {
        apiKey: process.env.STRIPE_API_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
    activationTokenExpiresIn: '72h',
    passwordResetTokenExpiresIn: '12h',
    assetsPath: path.resolve(__dirname, '../assets'),
    strava: {
        token: process.env.STRAVA_TOKEN,
    },
    errorPath: path.resolve(__dirname, '../data'),
};

config.host.path = `${config.host.name}${config.host.port !== '80' ? `:${config.host.port}` : ''}`;

module.exports = config;
