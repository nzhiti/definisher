const db = require('#db/index');

module.exports = async (req, res) => {
    try {
        return res.status(200).send(
            (await db.Produit.myFindAll()).map(produit => produit.serialize()),
        );
    } catch (error) {
        return res.status(500).send({
            user_message: 'Une erreur de lecture en base de données est survenue',
        });
    }
};
