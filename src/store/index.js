import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pages: [{
      uri: 'https://api.digitale-sammlungen.de/iiif/image/v2/bsb11151936_00001',
      pixels: {
        width: 2884,
        height: 3839
      },
      dimensions: {
        width: 288.4,
        height: 383.9
      },
      position: {
        x: 0,
        y: 0
      },
      zones: [{ id: 'measure123', label: '1', x: 50, y: 50, width: 40, height: 20 }, { id: 'measure234', label: '2', x: 100, y: 50, width: 40, height: 20 }, { id: 'measure345', label: '3', x: 150, y: 50, width: 40, height: 20 }]
    }, {
      uri: 'https://api.digitale-sammlungen.de/iiif/image/v2/bsb11151936_00002',
      pixels: {
        width: 3001,
        height: 3802
      },
      dimensions: {
        x: 300.1,
        y: 380.2
      },
      position: {
        x: 289,
        y: 0
      },
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
