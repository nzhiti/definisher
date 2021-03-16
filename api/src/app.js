const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// middlewares
const authMiddleware = require('#app/middlewares/auth');

// controllers
const tokenController = require('#app/controllers/token');
const offreController = require('#app/controllers/offre');
const commandeController = require('#app/controllers/commande');
const produitController = require('#app/controllers/produit');
const settingController = require('#app/controllers/setting');
const statisticsController = require('#app/controllers/statistics');
const stravaController = require('#app/controllers/strava');
const utilisateurController = require('#app/controllers/utilisateur');
const stripeController = require('#app/controllers/stripe');

// app
const app = express();
app.use(cors());
app.use('/stripe/webhooks', bodyParser.text({ type: '*/*' }));
app.use(bodyParser.json());

// routes
app.use('/assets', express.static(path.resolve(__dirname, '../assets')));

//-- /stats
app.get('/statistics', authMiddleware.authenticateAdmin, statisticsController.list);
app.get('/statistics/terre-lune', statisticsController.getTerreLune);
app.get('/statistics/terre-lune-prive', statisticsController.getTerreLunePrive);

//-- /challenges
app.get('/challenges', produitController.list);

//-- /commandes
app.get('/commandes', authMiddleware.authenticateAdmin, commandeController.list);
app.patch('/commandes', authMiddleware.authenticateAdmin, commandeController.process);

//-- /offres
app.get('/offres/:code', authMiddleware.authenticate, offreController.get);

//-- /settings
app.get('/settings', settingController.get);

//-- /utilisateurs
app.get('/tokens', tokenController.get);
app.get('/tokens/refresh', authMiddleware.authenticate, tokenController.refresh);

app.post('/utilisateurs', utilisateurController.create);
app.post('/utilisateurs/:utilisateur_id/activation', utilisateurController.activate);
app.get('/utilisateurs/:utilisateur_id', authMiddleware.authenticate, utilisateurController.me);
app.put('/utilisateurs/:utilisateur_id/mot_de_passe', utilisateurController.resetPassword);
app.post('/utilisateurs/:email/nouveau_mot_de_passe', utilisateurController.requestNewPassword);
app.post('/utilisateurs/:utilisateur_id/commandes', authMiddleware.authenticate, utilisateurController.createCommande);
app.get('/utilisateurs/:utilisateur_id/commandes/:session_id', authMiddleware.authenticate, utilisateurController.getCommande);

app.put('/utilisateurs/:utilisateur_id/strava', authMiddleware.authenticate, utilisateurController.setStravaAccess);

app.get('/utilisateurs/:utilisateur_id/challenges/:challenge_id/gpx', authMiddleware.authenticate, utilisateurController.getGpx);

//-- /strava
app.post('/strava/subscription', stravaController.registerSubscription);
app.get('/strava/activities', stravaController.validateSubscription);
app.post('/strava/activities', stravaController.processEvent);
app.post('/strava/sync', stravaController.syncActivities);

//-- /stripe
app.post('/stripe/webhooks', stripeController.processWebhook);

module.exports = app;
