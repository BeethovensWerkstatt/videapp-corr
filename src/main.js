import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import n from './store/names'
import config from '@/config'

import 'spectre.css/dist/spectre-exp.css'
import 'spectre.css/dist/spectre-icons.css'
import 'spectre.css/dist/spectre.css'
import { VectrePlugin } from '@vectrejs/vectre'

import '@/scss/variables.scss'
import i18n from './i18n'
import VueD3 from 'vue2-d3'

Vue.use(VectrePlugin)
Vue.use(VueD3)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

store.dispatch(n.actions.initVerovio)
store.dispatch(n.actions.loadWorks)
store.dispatch(n.actions.directory_load_db)
store.dispatch('loadDocuments')

console.log(config)
