import Vue from 'vue/dist/vue.common.js';
import VueRouter from 'vue-router';
import store from './store/';

Vue.use(VueRouter);

// components
import P404 from './pages/404.vue';
import Achat from './pages/achat.vue';
import AchatFinalisation from './pages/achatFinalisation.vue';
import ActivateUser from './pages/activateUser.vue';
import Aide from './pages/aide.vue';
import Authentication from './pages/authentication.vue';
import Challenge from './pages/challenge.vue';
import Landing from './pages/landing.vue';
import Loading from './pages/loading.vue';
import Me from './pages/me.vue';
import MentionsLegales from './pages/mentionsLegales.vue';
import MyChallenge from './pages/myChallenge.vue';
import RequestNewPassword from './pages/requestNewPassword.vue';
import ResetPassword from './pages/resetPassword.vue';
import StravaResponse from './pages/stravaResponse.vue';

import AdminDefinishers from './pages/administration/definishers.vue';
import AdminStatistiques from './pages/administration/statistiques.vue';

/**
 * Entrypoint
 */
let entrypoint = null;

/**
 * List of available conditions
 * 
 * @type {Object.<String,Function>}
 */
const conditionFns = {
    // settings are loaded
    loaded: () => {
        if (store.state.settings.settings === null) {
            return {
                target: '/echauffement-en-cours',
            };
        }

        return null;
    },
    // settings are not loaded
    notLoaded: () => {
        if (store.state.settings.settings !== null) {
            return {
                target: '/',
            };
        }

        return null;
    },
    // user is signed in
    signedIn: () => {
        if (store.state.settings.utilisateur.utilisateur === null) {
            return {
                target: '/authentification#connexion',
            };
        }

        return null;
    },
    // user is NOT signed in
    notSignedIn() {
        if (store.state.settings.utilisateur.utilisateur !== null) {
            return {
                saveEntrypoint: false,
                target: '/',
            };
        }

        return null;
    },
    // user is an admin
    isAdmin() {
        const { utilisateur } = store.state.settings.utilisateur;
        if (utilisateur === null) {
            return {
                target: '/authentification#connexion',
            };
        }

        if (utilisateur.est_administrateur !== true) {
            return {
                saveEntrypoint: false,
                target: '/',
            };
        }

        return null;
    },
};

/**
 * Checks the given conditions before performing a routing
 * 
 * @param {Array.<String>} conditions
 * 
 * @returns {Function}
 */
function ensure(...conditions) {
    return (to, from, next) => {
        // ensure every condition is met
        for (let i = 0; i < conditions.length; i += 1) {
            const response = conditionFns[conditions[i]]();

            // we found a condition that is not met: reroute
            if (response !== null) {
                // save entrypoint, if required (defaults to true)
                if (response.saveEntrypoint !== false) {
                    entrypoint = to;
                }

                // reroute
                next(response.target);
                return;
            }
        }

        // all conditions are met: perform the routing
        next();
    };
}

/**
 * Returns the path to the entrypoint
 */
function getEntrypoint() {
    if (entrypoint !== null) {
        const tmp = entrypoint;
        entrypoint = null;
        return tmp;
    }

    if (store.state.settings.utilisateur.utilisateur !== null) {
        return '/espace-membre';
    }

    return '/';
}

export default new VueRouter({
    mode: 'history',

    routes: [
        {
            path: '/',
            component: Landing,
            beforeEnter: ensure('loaded'),
        },
        {
            path: '/achat',
            component: Achat,
            beforeEnter: ensure('loaded', 'signedIn'),
        },
        {
            path: '/aide',
            component: Aide,
        },
        {
            path: '/finalisation-achat',
            component: AchatFinalisation,
            beforeEnter: ensure('loaded', 'signedIn'),
        },

        {
            path: '/connexion-gps-perdue',
            component: P404,
        },

        {
            path: '/activer-mon-compte/:id/:token',
            component: ActivateUser,
            beforeEnter: ensure('loaded', 'notSignedIn'),
        },

        {
            path: '/authentification',
            component: Authentication,
            beforeEnter: ensure('loaded', 'notSignedIn'),
        },

        {
            path: '/defi/:id',
            component: Challenge,
            beforeEnter: ensure('loaded'),
        },

        {
            path: '/deconnexion',
            beforeEnter(to, from, next) {
                store.commit('settings/utilisateur/logout');
                entrypoint = null;
                next('/');
            },
        },

        {
            path: '/echauffement-en-cours',
            component: Loading,
            beforeEnter: ensure('notLoaded'),
        },

        {
            path: '/entrypoint',
            redirect: getEntrypoint,
        },

        {
            path: '/espace-membre',
            component: Me,
            beforeEnter: ensure('loaded', 'signedIn'),
        },

        {
            path: '/mentions-legales',
            component: MentionsLegales,
        },

        {
            path: '/mot-de-passe-perdu',
            component: RequestNewPassword,
            beforeEnter: ensure('loaded', 'notSignedIn'),
        },

        {
            path: '/nouveau-mot-de-passe/:id/:token',
            component: ResetPassword,
            beforeEnter: ensure('loaded', 'notSignedIn'),
        },

        {
            path: '/liaison-a-strava',
            component: StravaResponse,
            beforeEnter: ensure('loaded', 'signedIn'),
        },

        {
            path: '/mon-defi/:id',
            component: MyChallenge,
            beforeEnter: ensure('loaded', 'signedIn'),
        },

        {
            path: '/administration/definishers',
            component: AdminDefinishers,
            beforeEnter: ensure('loaded', 'isAdmin'),
        },

        {
            path: '/administration/statistiques',
            component: AdminStatistiques,
            beforeEnter: ensure('loaded', 'isAdmin'),
        },

        {
            path: '*',
            redirect: '/connexion-gps-perdue',
        },
    ],

    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }

        if (to.hash) {
            return { selector: to.hash };
        }

        return { x: 0, y: 0 };
    },
});
