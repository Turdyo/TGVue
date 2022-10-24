import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import  router  from './routeur/index.js'

createApp(App).use(router).use(autoAnimatePlugin).mount('#app')
