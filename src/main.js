import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import  router  from './routeur/index.js'
import vuecookies from 'vue-cookies'

createApp(App).use(router).use(vuecookies).use(autoAnimatePlugin).mount('#app')
