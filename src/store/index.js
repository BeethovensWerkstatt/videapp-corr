import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pages: [{
      uri: 'https://api.digitale-sammlungen.de/iiif/image/v2/bsb11151936_00001',
      width: 2884,
      height: 3839,
      x: 0,
      y: 0,
      zones: [{ id: 'measure123', label: '1', x: 500, y: 500, width: 400, height: 200 }, { id: 'measure234', label: '2', x: 1000, y: 500, width: 400, height: 200 }, { id: 'measure345', label: '3', x: 1500, y: 500, width: 400, height: 200 }]
    }, {
      uri: 'https://api.digitale-sammlungen.de/iiif/image/v2/bsb11151936_00002',
      width: 3001,
      height: 3802,
      x: 2885,
      y: 0,
      zones: []
    }]
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    pages: (state) => {
      return state.pages
    }
  }
})
