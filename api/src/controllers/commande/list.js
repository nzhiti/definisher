const db = require('#db/index');

module.exports = async (req, res) => {
    try {
        const commandes = await db.Commande.find();
        return res
            .status(200)
            .send(commandes);
    } catch (error) {
        return res
            .status(500)
            .send({
                user_message: 'Une erreur est survenue lors de la lecture en base de données',
            });
    }
};
