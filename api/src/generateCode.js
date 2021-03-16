require('module-alias/register');
const db = require('#db/index');
const sequelize = require('#db/sequelize');
const { getAccountActivationLink } = require('#app/utils/auth');

(async () => {
    function randCode() {
        return (Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)).toUpperCase();
    }

    const rows = [];
    for (let i = 0; i < 200; i += 1) {
        rows.push({
            slug: `access-terre-lune-cagip${i + 1}`,
            nom: `Code d\'accès Terre-Lune CAGIP #${i + 1}`,
            code: `TL_${randCode()}`,
            pourcentage: 100,
            quantite: 1,
            fk_challenge: 10,
        });
    }

    try {
        await sequelize.queryInterface.bulkInsert('offres', rows);
    } catch (error) {
        console.log(error);
    }

    console.log('Sucesss!');
})();
