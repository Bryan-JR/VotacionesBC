import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

import VueAxios from 'vue-axios';
import axios from 'axios';
const instance = axios.create({ baseURL: 'http://localhost:4000'});

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

loadFonts();



const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(VueSweetalert2);
app.use(VueAxios, instance);
app.mount('#app');
