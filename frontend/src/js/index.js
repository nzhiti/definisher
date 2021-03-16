import Vue from 'vue/dist/vue.common.js';
import VueFormulate from '@braid/vue-formulate';
import VueGtag from 'vue-gtag';
import VueGoodTablePlugin from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css';
import { fr } from '@braid/vue-formulate-i18n'
import Toasted from 'vue-toasted';

import store from '#app/store/';
import router from '#app/router';
import '/css/index.scss';
import 'leaflet/dist/leaflet.css';
import 'typeface-poppins';
import './icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import MyPassword from '#app/components/password.vue';

Vue.component('MyPassword', MyPassword);
Vue.use(VueGtag, {
    config: { id: "UA-170084782-1" },
}, router);
Vue.use(VueFormulate, {
    plugins: [fr],
    locale: 'fr',
    library: {
        myPassword: {
            classification: 'text',
            component: 'MyPassword',
        },
    },
});
Vue.use(Toasted, {
    iconPack: 'fontawesome',
});
Vue.use(VueGoodTablePlugin);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.createElement = obj => new Vue(obj);
Vue.createElement({
    el: '#app',
    router,
    store,
});
