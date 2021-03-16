const db = require('#db/index');
const { stripe: { webhookSecret } } = require('#app/config');
const stripe = require('#app/utils/stripe');
const { send: sendMail } = require('#app/utils/mail');
const {
    frontend_url: frontUrl,
} = require('#app/config');

module.exports = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        return res
            .status(400)
            .send({
                user_message: `Webhook Error: ${err.message}`,
            });
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Fulfill the purchase
        let commande;
        try {
            [commande] = await db.Commande.findFull([session.client_reference_id]);
        } catch (error) {
            return res
                .status(500)
                .send({
                    user_message: 'Failed retrieving the matching command',
                });
        }

        if (commande === undefined) {
            return res
                .status(404)
                .send({
                    user_message: 'This session does not match a command',
                });
        }

        let utilisateur;
        try {
            utilisateur = await db.Utilisateur.findOneFull(commande.fk_utilisateur);
        } catch (error) {
            return res
                .status(500)
                .send({
                    user_message: 'Failed retrieving the user',
                });
        }

        if (utilisateur === null) {
            return res
                .status(404)
                .send({
                    user_message: 'This user does not exist',
                });
        }

        try {
            await db.sequelize.query(
                `UPDATE commandes SET payee = TRUE WHERE commande_id = :id`,
                {
                    replacements: {
                        id: session.client_reference_id,
                    },
                },
            );
        } catch (error) {
            return res
                .status(500)
                .send({
                    user_message: 'Failed tagging the commande as paid',
                });
        }

        try {
            await sendMail(utilisateur, {
                'Subject': 'Définisher - Votre défi commence !',

                'TextPart': `Bonjour ${utilisateur.cleanPrenom},\n\nEt félicitations car vous êtes désormais inscrit(e) au défi "${commande.lignes_achat.map(({ libelle }) => libelle).join(', ')}" !\n\nSi ce n\'est pas encore fait, rendez-vous sur votre espace membre (${frontUrl}/espace-membre) pour synchroniser votre compte Définisher et votre compte Strava pour commencer à compléter le défi.\n\nBonne chance !\n\nL'équipe Definisher`,

                'HTMLPart': `Bonjour ${utilisateur.cleanPrenom},<br/><br/>Et félicitations car vous êtes désormais inscrit(e) au défi "${commande.lignes_achat.map(({ libelle }) => libelle).join(', ')}" !<br/><br/>Si ce n\'est pas encore fait, rendez-vous sur votre <a href="${frontUrl}/espace-membre">espace membre</a> pour synchroniser votre compte Définisher et votre compte Strava pour commencer à compléter le défi.<br/><br/>Bonne chance !<br/><br/>L'équipe Definisher`,
            });
        } catch (error) {
            // @todo
        }
    }

    // Return a response to acknowledge receipt of the event
    return res.status(200).send({
        received: true,
    });
};