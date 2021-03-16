import axios from 'axios';
import routes from '#app/api';

export default {
    namespaced: true,

    state: {
        commandes: [],
    },

    mutations: {
        setCommandes(state, commandes) {
            state.commandes = commandes;
        },
    },

    actions: {
        async fetch({ commit }) {
            // get commandes
            const { data: commandes } = await axios.get(routes.commandes.list);

            // store
            commit('setCommandes', commandes);
        },

        async process({ commit }, commandeIds) {
            // process commandes
            const { data: commandes } = await axios.patch(routes.commandes.process, {
                ids: commandeIds,
            });

            // store
            commit('setCommandes', commandes);
        },
    },
};