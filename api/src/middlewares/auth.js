const { authenticate } = require('#app/utils/auth');

module.exports = {
    /**
     * Authenticates a user based on the provided access-token (if any)
     * 
     * @param {HttpReq}  req
     * @param {HttpRes}  res
     * @param {Function} next
     * 
     * @returns {undefined}
     */
    async authenticate(req, res, next) {
        try {
            const utilisateur = await authenticate(req);
            req.utilisateur = utilisateur;
        } catch (error) {
            res.status(400).send({
                error: error.details,
            });
            return;
        }

        next();
    },

    /**
     * Authenticates a user based on the provided access-token (if any) and ensures she's an admin
     * 
     * @param {HttpReq}  req
     * @param {HttpRes}  res
     * @param {Function} next
     * 
     * @returns {undefined}
     */
    async authenticateAdmin(req, res, next) {
        try {
            const utilisateur = await authenticate(req);
            req.utilisateur = utilisateur;
        } catch (error) {
            res.status(400).send({
                error: error.details,
            });
            return;
        }

        if (req.utilisateur.est_administrateur !== true) {
            res.status(400).send({
                error: 'Vous devez être administrateur pour accéder à cette ressource',
            });
            return;
        }

        next();
    }
};
