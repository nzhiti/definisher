import axios from 'axios';
import routes from '#app/api';
import utilisateurModule from './utilisateur';

export default {
    namespaced: true,

    state: {
        settings: null,
    },

    mutations: {
        setSettings(state, settings) {
            state.settings = settings;
        },
    },

    actions: {
        async load({ commit, dispatch }) {
            const {
                data: {
                    utilisateur,
                    ...realSettings
                }
            } = await axios.get(routes.settings.load);

            commit('setSettings', realSettings);
            commit('utilisateur/setUtilisateur', utilisateur);

            if (utilisateur !== null) {
                dispatch('utilisateur/refreshToken');
            }
        },
    },

    getters: {
        pays(state) {
            return state.settings.pays;
        },

        challenges(state) {
            return state.settings.challenges;
        },

        visibleChallenges(state) {
            return state.settings.challenges.filter(({ visible }) => visible === true);
        }
    },

    modules: {
        utilisateur: utilisateurModule,
    },
};