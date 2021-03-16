import axios from 'axios';
import routes from '#app/api';

export default {
    namespaced: true,

    state: {
        utilisateur: null,
    },

    mutations: {
        setUtilisateur(state, utilisateur) {
            state.utilisateur = utilisateur;

            if (utilisateur === null) {
                // localStorage.removeItem('me_at');
            }
        },

        updateUtilisateur(state, data) {
            if (state.utilisateur === null) {
                throw new Error('No utilisateur to update');
            }

            state.utilisateur = Object.assign({}, state.utilisateur, data);
        },

        addCommande(state, commande) {
            state.utilisateur.commandes.push(commande);
        },

        logout(state) {
            state.utilisateur = null;
            localStorage.removeItem('me_at');
        }
    },

    actions: {
        async signin({ commit }, payload) {
            // get tokens
            const { data: { token, id } } = await axios.get(routes.utilisateur.signin, {
                params: payload,
            });
            localStorage.setItem('me_at', token);

            // get user with that new token
            const { data: utilisateur } = await axios.get(routes.utilisateur.me(id));
            commit('setUtilisateur', utilisateur);
        },

        async signup({ commit }, payload) {
            await axios.post(routes.utilisateur.signup, payload);
        },

        async requestNewPassword({ commit }, payload) {
            await axios.post(routes.utilisateur.requestNewPassword(payload.email));
        },

        async resetPassword({ commit }, payload) {
            await axios.put(
                routes.utilisateur.resetPassword(payload.utilisateur_id),
                payload,
            );
        },

        async refreshToken({ state }) {
            if (state.utilisateur === null) {
                throw new Error('There is no logged in user waiting for a token refresh');
            }

            const { data: { token } } = await axios.get(routes.utilisateur.refresh);
            localStorage.setItem('me_at', token);
        },

        async sendCommande({ commit, state }, payload) {
            const { data: commande } = await axios.post(routes.utilisateur.commande(state.utilisateur.id), payload);
            commit('addCommande', commande);
            return commande;
        },

        async setStravaAccess({ commit, state }, payload) {
            const { data } = await axios.put(
                routes.utilisateur.setStravaAccess(state.utilisateur.id),
                payload,
            );
            commit('updateUtilisateur', data);
        },
    },
};