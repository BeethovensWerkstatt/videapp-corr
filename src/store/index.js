import Vue from 'vue'
import Vuex from 'vuex'

import uuidv4 from '@/toolbox'

import OpenSeadragon from 'openseadragon'

import pageSetup from '@/temp/pageSetup.json'

Vue.use(Vuex)

/**
 * @namespace store
 */

/**
 * @typedef {object} store.state
 * @memberof store
 * @property {Object} viewer - OpenSeadragon Viewer object
 * @property {Number} scale - current scale of OpenSeadragon.Viewer
 * @property {Object[]} annotations - list of annotations
 * @property {String} activeAnnotationId - ID of selected annotation
 * @property {Object[]} sources - list of source objects
 * @property {String} activeSourceId - ID of selected source
 */
export default new Vuex.Store({
  state: {
    viewer: null,
    scale: 1,
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
     * update scale variable
     * @memberof store.mutations
     * @param {Object} state
     */
    UPDATE_SCALE (state) {
      // console.log(state.viewer)
      if (state.viewer) {
        // state.scale = state.viewer.viewport.viewportToImageZoom(state.viewer.viewport.getZoom(true))
        var p0 = new OpenSeadragon.Point(0, 0)
        var p1 = new OpenSeadragon.Point(1, 1)
        p0 = state.viewer.viewport.viewerElementToViewportCoordinates(p0)
        p1 = state.viewer.viewport.viewerElementToViewportCoordinates(p1)
        // avoid large scale value for p0 and p1 approx 0
        // state.scale = 1 / Math.max(p1.x - p0.x, 0.05)
        state.scale = 1 / (p1.x - p0.x)
        // console.log('update scale ' + state.scale)
      } else {
        state.scale = 1
      }
    },
    /**
     * set load source
     * @memberof store.mutations
     * @param {object} state
     * @param {object} source - (*TBD typedef source object*)
     */
    LOAD_SOURCE (state, source) {
      const sources = [...state.sources]
      sources.push(source)
      state.sources = sources
    },
    /**
     * replace source
     * @memberof store.mutations
     * @param {object} state
     * @param {object} source
     */
    MODIFY_SOURCE (state, source) {
      state.sources = state.sources.map(src => src.id === source.id ? source : src)
    },
    /**
     * move source on the OSD space
     * @memberof store.mutations
     * @param {object} state
     * @param {object} src
     */
    MOVE_SOURCE (state, { id, x, y }) {
      // console.log('move source ' + id + ': ' + x + ',' + y)
      const msrc = { ...state.sources.find(src => src.id === id), position: { x: x, y: y } }
      if (msrc.id) {
        state.sources = state.sources.map(src => src.id === msrc.id ? msrc : src)
      }
    },
    /**
     * open page pair (recto/verso)
     * @memberof store.mutations
     * @param {Object} state
     * @param {Object} payload id: String, page: Number
     */
    SET_PAGE (state, { id, page }) {
      const msrc = { ...state.sources.find(src => src.id === id), pagenr: page }
      if (msrc.id) {
        state.sources = state.sources.map(src => src.id === msrc.id ? msrc : src)
      }
    },
    /**
     * set active source component
     * @memberof store.mutations
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
     * create OpenSeadragon canvas
     * @memberof store.actions
     */
    createOpenSeaDragon ({ commit, state }, { config, TIback, handler }) {
      // console.log(payload)
      // console.log(state)

      const viewer = OpenSeadragon(config)

      viewer.addTiledImage(TIback)

      if (state.viewer) {
        console.warn('viewer set twice!')
      }
      state.viewer = viewer

      for (const k in handler) {
        // console.log('handler :' + k)
        viewer.addHandler(k, handler[k])
      }
    },
    /**
     * destroy OpenSeadragon canvas
     * @memberof store.actions
     */
    destroyOpenSeaDragon ({ commit, state }) {
      if (state.viewer) {
        state.viewer.destroy()
        state.viewer = null
      }
    },
    /**
     * activate zone
     * @memberof store.actions
     * @param {Object} callback commit, getters
     * @param {Object} payload source: String, zone: String
     */
    activateZone ({ commit, getters }, { source, zone }) {
      if (source) {
        const src = getters.getSourceById(source)
        if (src) {
          // console.log(source, zone)
          commit('MODIFY_SOURCE', { ...src, activeZoneId: zone })
          commit('ACTIVATE_SOURCE', source)
        }
      } else {
        commit('ACTIVATE_SOURCE', null)
      }
    },
    /**
     * **TODO: load from REST API**
     *
     * load sources
     * @memberof store.actions
     * @param {function} commit
     * @param {object} state
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
   * @property {Object} viewer - OpenSeadragon Viewer object
   * @property {Object[]} sources - list of source objects loaded
   * @property {Number} scale - current scale of OpenSeqdragon Viewer
   * @property {String} activeSourceId - id of selected source object
   * @property {Object} activeSource - selected source object
   * @property {String} activeZoneId - id of selected zone object
   * @property {Object} activeZone - selected zone object
   */
  getters: {
    viewer: (state) => {
      return state.viewer
    },
    sources: (state) => {
      return state.sources
    },
    scale: (state) => {
      return state.scale
    },
    activeSourceId: (state) => {
      return state.activeSourceId
    },
    activeSource: (state, getters) => {
      if (state.activeSourceId) {
        const source = getters.getSourceById(state.activeSourceId)
        // console.log('active source: ' + source)
        return source
      }
      return null
    },
    /**
     * find source object by id
     * @memberof store.getters
     * @param {String} id - id of source object
     */
    getSourceById: (state) => (id) => {
      // console.log('get source: ' + id)
      if (!id) {
        throw new Error('source id undefined!')
      }
      return state.sources.find(source => source.id === id)
    },
    activeZoneId: (state, getters) => {
      const source = getters.activeSource
      // console.log(source)
      if (source) {
        // console.log(source.activeZoneId)
        return source.activeZoneId
      }
      return null
    },
    activeZone: (state, getters) => {
      const source = getters.activeSource
      const zoneId = getters.activeZoneId
      if (source && zoneId) {
        const pagenr = source.pagenr ? source.pagenr : 0
        const rzones = source.pages[pagenr].r ? source.pages[pagenr].r.measures : []
        const vzones = source.pages[pagenr].v ? source.pages[pagenr].v.measures : []
        const zone = [...rzones, ...vzones].find(zone => zone.zone === zoneId)
        return zone
      }
      return null
    },
    /**
     * find zone by id. If `sourceId` is null, all sources are searched,
     * until a zone with a matching id is found.
     *
     * @memberof store.getters
     * @param {String} sourceId - id of containing source object or null
     * @param {String} zoneId - id of zone object
     */
    getZoneById: (state, getters) => (sourceId, zoneId) => {
      const findZone = function (source, zoneId) {
        for (const p in source.pages) {
          if (p.r) {
            for (const zone in p.r.measures) {
              if (zone.zone === zoneId) {
                return zone
              }
            }
          }
          if (p.v) {
            for (const zone in p.v.measures) {
              if (zone.zone === zoneId) {
                return zone
              }
            }
          }
        }
      }
      const source = sourceId ? getters.getSourceById(sourceId) : null
      if (source) {
        return findZone(source, zoneId)
      }
      if (!sourceId) {
        state.sources.forEach((source) => {
          const zone = findZone(source, zoneId)
          if (zone) {
            return zone
          }
        })
      }
      return null
    }
  }
})
