module.exports = (req, res) => {
    if (req.utilisateur.utilisateur_id !== parseInt(req.params.utilisateur_id, 10)) {
        return res.status(400).send({
            user_message: 'Vous n\'avez pas le droit de consulter les données privées d\'un autre utilisateur',
        });
    }

    return res.status(200).send(req.utilisateur.serialize());
};