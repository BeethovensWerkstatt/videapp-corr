import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import n from './store/names'

import 'spectre.css/dist/spectre-exp.css'
import 'spectre.css/dist/spectre-icons.css'
import 'spectre.css/dist/spectre.css'
import { VectrePlugin } from '@vectrejs/vectre'

import '@/scss/variables.scss'
import i18n from './i18n'
import VueD3 from 'vue2-d3'

// add fabricjs- and html-overlay plugins
// import OpenSeadragon from 'openseadragon'
// import fabricosd from '@/openseadragon/openseadragon-fabricjs-overlay'
// import htmlosd from '@/openseadragon/openseadragon-html-overlay'
// should this be a vuejs plugin to be called in the Vue constructor??
// we need fabricjs ...
// require('@/openseadragon/fabric.adapted.js')
// add plugins to the Viewer prototype
// fabricosd(OpenSeadragon)
// htmlosd(OpenSeadragon)

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
