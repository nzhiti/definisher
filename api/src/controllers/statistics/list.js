const db = require('#db/index');

module.exports = async (req, res) => {
    let totauxParCode, totauxParChallenge;
    try {
        ([totauxParCode, totauxParChallenge] = await Promise.all([
            db.sequelize.query(
                `SELECT
                    COUNT(*)::integer,
                    of.code,
                    of.pourcentage,
                    of.quantite::integer,
                    oq.quantite_restante::integer
                FROM
                    commandes co
                LEFT JOIN
                    lignes_reduction lr ON lr.fk_commande = co.commande_id
                LEFT JOIN
                    offres OF ON lr.fk_offre = of.offre_id
                LEFT JOIN
                    offres_quantite oq ON oq.code = of.code
                WHERE
                    co.payee = TRUE
                GROUP BY of.code, of.pourcentage, of.quantite, oq.quantite_restante`,
                {
                    type: db.sequelize.QueryTypes.SELECT,
                },
            ),
            db.sequelize.query(
                `SELECT
                    COUNT(*)::integer,
                    ca.slug,
                    ca.nom
                FROM
                    commandes co
                LEFT JOIN
                    lignes_achat la ON la.fk_commande = co.commande_id
                LEFT JOIN
                    challenges ca ON la.fk_challenge = ca.challenge_id
                WHERE
                    co.payee = TRUE
                GROUP BY ca.slug, ca.nom`,
                {
                    type: db.sequelize.QueryTypes.SELECT,
                },
            ),
        ]));
    } catch (error) {
        return res
            .status(500)
            .send({
                user_message: 'Une erreur est survenue lors de la lecture en base de données',
            });
    }

    return res
        .status(200)
        .send({
            codes: totauxParCode.reduce((acc, row) => {
                if (row.code === null) {
                    return acc;
                }

                acc.push({
                    code: row.code,
                    quantite_initiale: row.quantite,
                    quantite_restante: row.quantite_restante,
                });
                return acc;
            }, []),
            commandes: {
                total: totauxParCode.reduce((sum, row) => sum + row.count, 0),
                total_payantes: totauxParCode.reduce((sum, row) => row.pourcentage !== 100 ? sum + row.count : sum, 0),
                par_challenge: totauxParChallenge,
            },
        });
};
