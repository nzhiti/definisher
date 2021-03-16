import axios from 'axios';

/********************************
 * AUTHENTICATION
 ********************************/
axios.interceptors.request.use(function (config) {
    const accessToken = localStorage.getItem('me_at');
    if (accessToken !== null) {
        config.headers['x-access-token'] = accessToken;
    }

    return config;
});


/********************************
 * ROUTES
 ********************************/
const routes = {
    utilisateur: {
        activate: (id) => `${Definisher.API_URL}/utilisateurs/${id}/activation`,
        me: (id) => `${Definisher.API_URL}/utilisateurs/${id}`,
        refresh: `${Definisher.API_URL}/tokens/refresh`,
        requestNewPassword: (email) => `${Definisher.API_URL}/utilisateurs/${email}/nouveau_mot_de_passe`,
        resetPassword: (id) => `${Definisher.API_URL}/utilisateurs/${id}/mot_de_passe`,
        signin: `${Definisher.API_URL}/tokens`,
        signup: `${Definisher.API_URL}/utilisateurs`,
        commande: (id) => `${Definisher.API_URL}/utilisateurs/${id}/commandes`,
        getCommande: (userId, sessionId) => `${Definisher.API_URL}/utilisateurs/${userId}/commandes/${sessionId}`,
        setStravaAccess: (id) => `${Definisher.API_URL}/utilisateurs/${id}/strava`,
        gpx: (id, challenge) => {
            const accessToken = localStorage.getItem('me_at');
            return `${Definisher.API_URL}/utilisateurs/${id}/challenges/${challenge}/gpx?accessToken=${accessToken}`;
        },
    },
    commandes: {
        list: `${Definisher.API_URL}/commandes`,
        process: `${Definisher.API_URL}/commandes`,
    },
    settings: {
        load: `${Definisher.API_URL}/settings`,
    },
    offres: {
        get: (code) => `${Definisher.API_URL}/offres/${code}`,
    },
    statistics: {
        list: `${Definisher.API_URL}/statistics`,
    },
};

// inject api's root url to the routes
export default routes;
