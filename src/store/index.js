import Vue from 'vue'
import Vuex from 'vuex'

import uuidv4 from '@/toolbox'

import pageSetup from '@/temp/pageSetup.json'

Vue.use(Vuex)

/**
 * @namespace store
 */

/**
 * @typedef {object} store.state
 * @memberof store
 * @property {object} viewer - OpenSeadragon Viewer object
 * @property {object} osd_component - OpenSeadragon Vue component
 * @property {object[]} annotations - list of annotations
 * @property {string} activeAnnotationId - ID of selected annotation
 * @property {object[]} sources - list of source objects
 * @property {string} activeSourceId - ID of selected source
 */
export default new Vuex.Store({
  state: {
    viewer: null,
    desktop: null,
    annotations: [],
    activeAnnotationId: null,
    sources: [],
    activeSourceId: null
  },
  /**
   * @namespace store.mutations
   * @memberof store
   */
  mutations: {
    /**
     * set OpenSeadragon Viewer
     * @memberof store.mutations
     * @param {object} state
     * @param {object} viewer
     */
    SET_VIEWER (state, viewer) {
      state.viewer = viewer
    },
    /**
     * set OpenSeadragon component
     * @memberof store.mutations
     * @param {object} state
     * @param {module:OpenSeadragonComponent} OSDComponent
     */
    SET_DESKTOP (state, OSDComponent) {
      state.OSDComponent = OSDComponent
    },
    /**
     * set load source
     * @param {object} state
     * @param {object} source - (*TBD typedef source object*)
     */
    LOAD_SOURCE (state, source) {
      const sources = [...state.sources]
      sources.push(source)
      state.sources = sources
    },
    /**
     * set active source component
     * @param {object} state
     * @param {String} src source id
     */
    ACTIVATE_SOURCE (state, src) {
      state.activeSourceId = src
    },
    ADD_ANNOTATION (state, annotation) {
      const annots = [...state.annotations]
      let existingAnnot = annots.find(annot => annot.id === annotation.id)

      if (existingAnnot === undefined) {
        annots.push(annotation)
      } else {
        existingAnnot = annotation
      }
      state.annotations = annots
    },
    ACTIVATE_ANNOTATION (state, id) {
      state.activeAnnotationId = id
    },
    MODIFY_ANNOTATION (state, body) {
      const annots = [...state.annotations]
      if (state.activeAnnotationId !== null) {
        const annot = annots.find(annot => annot.id === state.activeAnnotationId)

        if (annot !== undefined) {
          annot.body.value = '<p>' + body + '</p>'
          annot.body.modified = new Date().toJSON().slice(0, 19) + 'Z'
          state.annotations = annots
        }
      }
    }
  },
  /**
   * @namespace store.actions
   * @memberof store
   */
  actions: {
    /**
     * **TODO: load from REST API**
     * load sources
     * @memberof store.actions
     * @param {*} commit
     * @param {*} state
     */
    loadSources ({ commit, state }) {
      // this needs to be replaced with dynamic content
      const json = pageSetup
      json.sources.forEach((source, index) => {
        const existingSource = state.sources.find(elem => elem.id === source.id)

        if (existingSource === undefined) {
          const obj = {}
          obj.id = source.id
          obj.label = source.label
          obj.maxDimensions = {}
          // this needs to be updated
          obj.position = { x: (150 + index * 400), y: 400 }
          obj.rotation = (index - 1) * 20
          let maxRheight = 0
          let maxRwidth = 0
          let maxVheight = 0
          let maxVwidth = 0
          obj.pages = []
          const startsWithSingle = source.pages[0].pos === 'r'
          const singleLeaf = startsWithSingle && ((source.pages.length === 2 && source.pages[1].pos === 'v') || source.pages.length === 1)
          obj.singleLeaf = singleLeaf

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
                measures: page.measures,
                place: 'recto'
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
                measures: leftPage.measures,
                place: 'verso'
              }
              const r = (rightPage !== undefined) ? {
                uri: rightPage.uri,
                id: rightPage.id,
                label: rightPage.label,
                pixels: { width: rightPage.width, height: rightPage.height },
                dimensions: { width: rightPage.mmWidth, height: rightPage.mmHeight },
                measures: rightPage.measures,
                place: 'recto'
              } : null
              obj.pages.push({ v, r })
            }
          })
          obj.maxDimensions.width = (!singleLeaf) ? maxRwidth + maxVwidth : Math.max(maxRwidth, maxVwidth)
          obj.maxDimensions.height = Math.max(maxVheight, maxRheight)
          obj.activePage = 0

          commit('LOAD_SOURCE', obj)
        }
      })
    },
    createAnnotation ({ commit, state }, annot) {
      const annotation = {
        '@context': 'http://www.w3.org/ns/anno.jsonld#',
        id: uuidv4(),
        type: 'Annotation',
        body: {
          type: 'TextualBody',
          value: '<p></p>',
          format: 'text/html',
          language: 'en',
          creator: 'http://example.net/user2',
          created: new Date().toJSON().slice(0, 19) + 'Z'
        },
        target: annot.target
      }
      commit('ADD_ANNOTATION', annotation)
      commit('ACTIVATE_ANNOTATION', annotation.id)
    },
    modifyAnnotation ({ commit, state }, body) {
      commit('MODIFY_ANNOTATION', body)
    }
  },
  /**
   * @namespace store.getters
   * @memberof store
   * @property {object} viewer - OpenSeadragon Viewer object
   * @property {object} desktop - Desktop Component
   * @property {object[]} sources - list of source objects loaded
   * @property {string} activeSourceId - ID of selected source object
   * @property {string} activeZoneId - ID of selected source object
   */
  getters: {
    viewer: (state) => {
      return state.viewer
    },
    desktop: (state) => {
      return state.desktop
    },
    sources: (state) => {
      return state.sources
    },
    activeSourceId: (state) => {
      return state.activeSourceId
    },
    /**
     * @memberof store.getters
     * @returns {object} selected source object or null
     */
    activeSource: (state) => () => {
      const source = state.sources.find(source => { return source.id === state.activeSourceId })
      // console.log('active source: ' + source)
      return source
    },
    /**
     * @memberof store.getters
     * @param {string} id
     * @returns {object} source object of id or null
     */
    getSourceById: (state) => (id) => {
      // console.log('get source: ' + id)
      if (!id) {
        throw new Error('source id undefined!')
      }
      return state.sources.find(source => {
        // console.log(source.id)
        return source.id === id
      })
    },
    activeZoneId: (state) => {
      const source = state.sources.find(source => {
        return source.id === state.activeSourceId
      })
      if (source) {
        return source.component.activeZoneId
      }
      return null
    },
    /**
     * @memberof store.getters
     * @returns {object} selected zone object or null
     */
    activeZone: (state) => () => {
      if (state.activeSourceId) {
        const source = state.sources.find(source => {
          return source.id === state.activeSourceId
        })
        if (source) {
          return source.component.activeZone
        }
      }
      return null
    },
    /**
     * **not implemented yet!**
     * @memberof store.getters
     * @param {string} id
     * @returns {object} source zone of id or null
     */
    getZoneById: (state) => (id) => {
      state.sources.forEach((source) => {
        console.log(source)
      })
      return null
    }
  }
})
