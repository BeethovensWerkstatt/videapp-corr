import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'spectre.css/dist/spectre-exp.css'
import 'spectre.css/dist/spectre-icons.css'
import 'spectre.css/dist/spectre.css'
import { VectrePlugin } from '@vectrejs/vectre'

import '@/scss/variables.scss'

Vue.use(VectrePlugin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

store.dispatch('loadSources')
