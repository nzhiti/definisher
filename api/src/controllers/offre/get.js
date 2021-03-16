const db = require('#db/index');

module.exports = async (req, res) => {
    const challengeId = req.query.challenge;

    let offre;
    try {
        offre = await db.Offre.findValidOne(req.params.code, challengeId);
    } catch (error) {
        return res.status(500).send({
            user_message: 'Une erreur de lecture en base de données est survenue',
        });
    }

    if (offre === null) {
        return res.status(404).send({
            user_message: 'Code invalide ou expiré',
        });
    }

    return res.status(200).send({
        code: offre.code,
        nom: offre.nom,
        pourcentage: offre.pourcentage,
    });
};
