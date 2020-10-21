import Vue from 'vue'
import Vuex from 'vuex'

import pageSetup from '@/temp/pageSetup.json'

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
    }],
    pageSetup
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    pages: (state) => {
      return state.pages
    },
    pageSetup: (state) => {
      return state.pageSetup
    },
    sources: (state) => {
      const sources = []
      state.pageSetup.sources.forEach(source => {
        const obj = {}
        obj.id = source.id
        obj.label = source.label
        let maxRheight = 0
        let maxRwidth = 0
        let maxVheight = 0
        let maxVwidth = 0
        obj.pages = []
        const startsWithSingle = source.pages[0].pos === 'r'
        const singleLeaf = startsWithSingle && ((source.pages.length === 2 && source.pages[1].pos === 'v') || source.pages.length === 1)

        source.pages.forEach((page, i) => {
          if (page.pos === 'r') {
            maxRheight = Math.max(maxRheight, page.mmHeight)
            maxRwidth = Math.max(maxRwidth, page.mmWidth)
          } else {
            maxVheight = Math.max(maxVheight, page.mmHeight)
            maxVwidth = Math.max(maxVwidth, page.mmWidth)
          }
          // when first page starts recto
          if (startsWithSingle && i === 0) {
            const v = null
            const r = {
              uri: page.uri,
              id: page.id,
              label: page.label,
              pixels: { width: page.width, height: page.height },
              dimensions: { width: page.mmWidth, height: page.mmHeight },
              measures: page.measures
            }
            obj.pages.push({ v, r })
          } else if ((startsWithSingle && i % 2 === 1) || (!startsWithSingle && i % 2 === 0)) {
            const leftPage = page
            const rightPage = source.pages[i + 1]
            const v = {
              uri: leftPage.uri,
              id: leftPage.id,
              label: leftPage.label,
              pixels: { width: leftPage.width, height: leftPage.height },
              dimensions: { width: leftPage.mmWidth, height: leftPage.mmHeight },
              measures: leftPage.measures
            }
            const r = (rightPage !== undefined) ? {
              uri: rightPage.uri,
              id: rightPage.id,
              label: rightPage.label,
              pixels: { width: rightPage.width, height: rightPage.height },
              dimensions: { width: rightPage.mmWidth, height: rightPage.mmHeight },
              measures: rightPage.measures
            } : null
            obj.pages.push({ v, r })
          }
        })
        obj.width = (!singleLeaf) ? maxRwidth + maxVwidth : Math.max(maxRwidth, maxVwidth)
        obj.centerfold = (!singleLeaf) ? maxVwidth : 0
        obj.height = Math.max(maxVheight, maxRheight)
        sources.push(obj)
      })
      return sources
    }
  }
})
