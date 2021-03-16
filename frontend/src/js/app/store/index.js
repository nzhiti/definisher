import Vue from 'vue/dist/vue.common.js';
import Vuex from 'vuex';

Vue.use(Vuex);

// modules
import commandes from './modules/commandes';
import panier from './modules/panier';
import settings from './modules/settings';
import statistiques from './modules/statistiques';

export default new Vuex.Store({
    modules: {
        commandes,
        panier,
        settings,
        statistiques,
    },
});