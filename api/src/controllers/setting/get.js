const db = require('#db/index');
const { authenticate } = require('#app/utils/auth');

module.exports = async (req, res) => {
    let utilisateur;
    try {
        utilisateur = await authenticate(req);
    } catch (error) {
        utilisateur = null;
    }

    return res.status(200).send({
        pays: await db.Pays.findAll({
            order: [['nom', 'ASC']],
        }).map(({ code, nom }) => ({ code, nom })),
        utilisateur: utilisateur !== null ? utilisateur.serialize() : null,
        challenges: (await db.Produit.myFindAll()).map(produit => produit.serialize()),
    });
};
