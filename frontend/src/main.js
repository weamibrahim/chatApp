import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';



// BootstrapVue 3
import BootstrapVue3 from 'bootstrap-vue-3';

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Add FontAwesome icons to library
library.add(fas);

// Create Vue app
const app = createApp(App);


// Register components globally
app.component('font-awesome-icon', FontAwesomeIcon);

// Use plugins
app.use(BootstrapVue3);
app.use(router);
app.use(store);
app.use(Toast);
// Mount app
app.mount('#app');
