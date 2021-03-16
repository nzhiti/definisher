const db = require('#db/index');

module.exports = async (req, res) => {
    let commande;
    try {
        const commandes = await db.Commande.findFull([req.params.session_id], 'session');
        commande = commandes.length === 1 ? commandes[0] : null;
    } catch (error) {
        return res
            .status(500)
            .send({
                user_message: 'Une erreur est survenue lors de la lecture en base de données',
            });
    }

    if (commande === null) {
        return res
            .status(404)
            .send({
                user_message: 'La commande demandée n\'existe pas',
            })
    }

    const userId = parseInt(req.params.utilisateur_id);
    if (userId !== req.utilisateur.utilisateur_id || userId !== commande.fk_utilisateur) {
        return res
            .status(400)
            .send({
                user_message: 'Vous ne pouvez pas consulter la commande d\'un autre utilisateur',
            });
    }

    return res.status(200).send(db.Commande.serialize(commande));
};