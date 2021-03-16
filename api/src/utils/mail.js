const { mailjet: mailConfig } = require('#app/config');
const mailjet = require('node-mailjet')
    .connect(mailConfig.publicKey, mailConfig.privateKey);

module.exports = {
    send(utilisateur, mailContent) {
        return mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    Object.assign({
                        From: {
                            Email: 'support@definisher.fr',
                            Name: 'L\'équipe Definisher',
                        },
                        To: [
                            {
                                Email: utilisateur.email,
                                Name: utilisateur.nom,
                            },
                        ],
                    }, mailContent),
                ],
            });
    },
};
