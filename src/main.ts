import './assets/main.css'

import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './App.vue';
import router from './router'

const app = createApp(App);
const pinia = createPinia();
const icons = {
    defaultSet: 'mdi',
    aliases,
    sets: {
        mdi,
    }
}

watch(pinia.state, (state) => {
    localStorage.setItem('room', JSON.stringify(state.room));
    localStorage.setItem('user', JSON.stringify(state.user));
}, { deep: true });

const vuetify = createVuetify({
    icons,
    components,
    directives,
});

app.use(vuetify);
app.use(pinia);
app.use(router);

app.mount('#app');