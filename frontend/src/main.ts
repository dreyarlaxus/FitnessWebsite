import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';

import './assets/index.css';
import router from './routes';

const pinia = createPinia();
createApp(App).use(pinia).use(router).mount('#app');
