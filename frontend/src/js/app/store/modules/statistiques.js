import axios from 'axios';
import routes from '#app/api';

export default {
    namespaced: true,

    state: {
        codes: [],
        commandes: {},
    },

    mutations: {
        setCodes(state, codes) {
            state.codes = codes;
        },
        setCommandes(state, commandes) {
            state.commandes = commandes;
        },
    },

    actions: {
        async fetch({ commit }) {
            // get statistics
            const { data } = await axios.get(routes.statistics.list);

            // store
            commit('setCodes', data.codes);
            commit('setCommandes', data.commandes);
        },
    },
};