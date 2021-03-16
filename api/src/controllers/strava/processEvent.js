const strava = require('strava-v3');
const db = require('#db');
const logger = require('#app/utils/logger');
const stravaUtils = require('#app/utils/strava');
const { send: sendMail } = require('#app/utils/mail');

module.exports = async (req, res) => {
    logger.info({
        event: 'WEBHOOK_EVENT',
        data: req.body,
    });

    const { object_type, object_id, aspect_type, owner_id, updates } = req.body;

    // récupération de l'utilisateur sur la base de l'owner_id
    let utilisateur;
    try {
        utilisateur = await db.Utilisateur.findOneFull(null, owner_id);
    } catch (error) {
        logger.error({
            event: 'WEBHOOK_FAILURE',
            data: req.body,
            message: 'Une erreur est survenue lors de la lecture en base de données',
            error,
        });
        return res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });
    }

    if (utilisateur === null) {
        logger.error({
            event: 'WEBHOOK_FAILURE',
            data: req.body,
            message: 'Cet événement est lié à un athlète inconnu dans notre base de données',
        });
        return res.status(404).send({
            user_message: 'Cet événement est lié à un athlète inconnu dans notre base de données',
        });
    }

    // cas d'un événement de désautorisation de l'app
    if (updates && updates.authorized === 'false') {
        try {
            await db.Utilisateur.update(
                {
                    strava_id: null,
                    strava_access_token: null,
                    strava_refresh_token: null,
                    strava_expires_at: null,
                },
                {
                    where: {
                        utilisateur_id: utilisateur.utilisateur_id,
                    },
                },
            );
        } catch (error) {
            logger.error({
                event: 'WEBHOOK_FAILURE',
                data: req.body,
                message: 'Une erreur est survenue lors de l\'écriture en base de données',
                error,
            });
            return res.status(500).send({
                user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
            });
        }

        logger.info({
            event: 'WEBHOOK_SUCCESS',
            data: req.body,
            message: 'Application désynchronisée',
        });
        return res.status(200).send({});
    }

    // cas où l'utilisateur n'a pas de challenge en cours
    if (utilisateur.challengeActifs.length === 0) {
        logger.info({
            event: 'WEBHOOK_SUCCESS',
            data: req.body,
            message: 'Pas de challenges en cours pour cet athlète',
        });
        return res.status(200).send({});
    } else {
        logger.info({
            event: 'WEBHOOK_INFO',
            data: req.body,
            message: 'Challenges en cours détectés : ' + utilisateur.challengeActifs.map(({ challenge_id }) => challenge_id).join(', '),
        })
    }

    // événement qui ne concerne pas une activité : on ignore
    if (object_type !== 'activity') {
        logger.info({
            event: 'WEBHOOK_SUCCESS',
            data: req.body,
            message: 'Événement qui ne concerne pas une activité',
        });
        return res.status(200).send({});
    }

    // refresh le token
    let accessToken;
    try {
        accessToken = await stravaUtils.refreshToken(utilisateur);
    } catch (error) {
        logger.error({
            event: 'WEBHOOK_FAILURE',
            data: req.body,
            message: 'Une erreur est survenue lors du rafraîchissement du token d\'accès',
            error,
        });
        return res.status(500).send({
            user_message: 'Une erreur est survenue lors du rafraîchissement du token d\'accès',
        });
    }

    // gestion des différents événements possibles
    switch (aspect_type) {
        case 'create':
            // récupérer l'activité depuis strava
            let activite;
            try {
                activite = await strava.activities.get({
                    id: object_id,
                    include_all_efforts: false,
                    access_token: accessToken,
                });
            } catch (error) {
                logger.error({
                    event: 'WEBHOOK_FAILURE',
                    data: req.body,
                    message: 'Impossible d\'obtenir les détails de l\'activité',
                    error,
                });
                return res.status(500).send({
                    user_message: 'Impossible d\'obtenir les détails de l\'activité',
                });
            }

            // ignorer les activités non autorisés
            const challengesActifs = utilisateur.challengeActifs;

            try {
                const response = await stravaUtils.register(utilisateur, activite);
                if (typeof response === 'string' || response.length === 0) {
                    logger.info({
                        event: 'WEBHOOK_SUCCESS',
                        data: req.body,
                        message: response,
                    });
                    return res.status(200).send({});
                }
            } catch (error) {
                logger.error({
                    event: 'WEBHOOK_FAILURE',
                    data: req.body,
                    message: 'Une erreur est survenue lors de l\'écriture en base de données',
                    error,
                });
                return res.status(500).send({
                    user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
                });
            }

            // check if a challenge is over
            const refreshedUser = await db.Utilisateur.findOneFull(null, owner_id);
            const stillActiveChallenges = refreshedUser.challengeActifs.map(({ challenge_id }) => challenge_id);

            const finishedChallenges = challengesActifs
                .filter(({ challenge_id }) => stillActiveChallenges.indexOf(challenge_id) === -1);

            if (finishedChallenges.length > 0) {
                await Promise.all(
                    finishedChallenges
                        .map((challenge) => {
                            return sendMail(utilisateur, {
                                'Subject': 'Tu es un Définisher !',

                                'TextPart': `Bonjour ${utilisateur.cleanPrenom},\n\nMais surtout : bravo ! Vous venez de terminer le défi "${challenge.nom}" et vous pouvez être fier(e) de vous !\n\nUne telle performance mérite récompense et votre médaille est d'ores et déjà en cours de préparation.\n\nMais ne relâchez pas votre effort, de nombreux autres défis vous attendent sur definisher.fr ! N'hésitez pas non plus à partager votre exploit auprès de vos amis #definisher et suivez nous sur Instagram, Discord, et Facebook.\n\nEncore félicitations et à bientôt pour de nouveaux défis,\n\nL'équipe Definisher`,

                                'HTMLPart': `Bonjour ${utilisateur.cleanPrenom},<br/><br/>Mais surtout : bravo ! Vous venez de terminer le défi "${challenge.nom}" et vous pouvez être fier(e) de vous !<br/><br/>Une telle performance mérite récompense et votre médaille est d'ores et déjà en cours de préparation.<br/><br/>Mais ne relâchez pas votre effort, de nombreux autres défis vous attendent sur <a href="https://definisher.fr">definisher.fr</a> ! N'hésitez pas non plus à partager votre exploit auprès de vos amis #definisher et suivez nous sur <a href="https://www.instagram.com/defi_nisher/">Instagram</a>, <a href="https://discord.gg/FckpTeV">Discord</a>, et <a href="https://www.facebook.com/defi_nisher-104590254643442">Facebook</a>.<br/><br/>Encore félicitations et à bientôt pour de nouveaux défis,<br/><br/>L'équipe Definisher`,
                            });
                        }),
                );
            }
            break;

        case 'update':
            // @todo ?
            break;

        case 'delete':
            // @todo ?
            break;
    }

    logger.info({
        event: 'WEBHOOK_SUCCESS',
        data: req.body,
        message: 'Activité bien enregistrée pour tous les challenges en cours',
    });
    return res.status(200).send({});
};