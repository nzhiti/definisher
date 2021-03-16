require('module-alias/register');
const db = require('#db/index');
const { getAccountActivationLink } = require('#app/utils/auth');

(async () => {
    const utilisateur = await db.Utilisateur.findOne({
        where: {
            email: 'lesaucel@yahoo.fr',
        }
    });
    const { link } = getAccountActivationLink(utilisateur);

    console.log(link);
})();
