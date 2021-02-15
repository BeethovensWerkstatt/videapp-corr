import Vue from 'vue'
import Vuex from 'vuex'

import uuidv4 from '@/toolbox'
import { mutations, actions } from './names'

import storeOSD from './osd'
import storeWorks from './works'
import storeSources from './sources'

import complaintsSetup from '@/temp/complaintsSetup.json'

Vue.use(Vuex)

/**
 * @namespace store
 */

/**
 * @typedef {object} store.state
 * @memberof store
 * @property {Object} viewer - OpenSeadragon Viewer object
 * @property {Number} scale - current scale of OpenSeadragon.Viewer
 * @property {Object[]} sources - list of source objects
 * @property {String} activeSourceId - id of selected source
 * @property {Object[]} complaints - list of complaints
 * @property {String} activeComplaintId - id of selected complaint
 * @property {Object[]} annotations - list of annotations
 * @property {String} activeAnnotationId - ID of selected annotation
 */
export default new Vuex.Store({
  state: {
    ...storeOSD.state,
    ...storeWorks.state,
    ...storeSources.state,
    annotations: [],
    activeAnnotationId: null,
    complaints: [],
    activeComplaintId: null
  },
  /**
   * @namespace store.mutations
   * @memberof store
   */
  mutations: {
    ...storeOSD.mutations,
    ...storeWorks.mutations,
    ...storeSources.mutations,
    /**
     * set load source
     * @memberof store.mutations
     * @param {object} state
     * @param {object} source - (*TBD typedef source object*)
     */
    [mutations.LOAD_SOURCE] (state, source) {
      const sources = [...state.sources]
      sources.push(source)
      state.sources = sources
    },
    /**
     * load complaint
     * @memberof store.mutations
     * @param {Object} state
     * @param {Object} source
     */
    [mutations.LOAD_COMPLAINT] (state, complaint) {
      const complaints = [...state.complaints]
      complaints.push(complaint)
      state.complaints = complaints
    },
    /**
     * replace source
     * @memberof store.mutations
     * @param {object} state
     * @param {object} source - properties to modify with id
     */
    [mutations.MODIFY_SOURCE] (state, source) {
      state.sources = state.sources.map(src => {
        if (src.id === source.id) {
          return { ...src, ...source }
        } else {
          return src
        }
      })
    },
    /**
     * move source on the OSD space
     * @memberof store.mutations
     * @param {object} state
     * @param {object} src
     */
    [mutations.MOVE_SOURCE] (state, { id, x, y }) {
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
    [mutations.SET_PAGE] (state, { id, page }) {
      const msrc = { ...state.sources.find(src => src.id === id), pagenr: page }
      if (msrc.id) {
        state.sources = state.sources.map(src => src.id === msrc.id ? msrc : src)
      }
    },
    /**
     * replace source
     * @memberof store.mutations
     * @param {object} state
     * @param {object} source
     */
    [mutations.MODIFY_SOURCE] (state, source) {
      state.sources = state.sources.map(src => src.id === source.id ? source : src)
    },
    /**
     * move source on the OSD space
     * @memberof store.mutations
     * @param {object} state
     * @param {object} src
     */
    [mutations.MOVE_SOURCE] (state, { id, x, y }) {
      // console.log('move source ' + id + ': ' + x + ',' + y)
      const msrc = { ...state.sources.find(src => src.id === id), position: { x: x, y: y } }
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
    [mutations.ACTIVATE_SOURCE] (state, src) {
      state.activeSourceId = src
    },
    [mutations.ADD_ANNOTATION] (state, annotation) {
      const annots = [...state.annotations]
      let existingAnnot = annots.find(annot => annot.id === annotation.id)

      if (existingAnnot === undefined) {
        annots.push(annotation)
      } else {
        existingAnnot = annotation
      }
      state.annotations = annots
    },
    [mutations.ACTIVATE_ANNOTATION] (state, id) {
      state.activeAnnotationId = id
    },
    [mutations.MODIFY_ANNOTATION] (state, body) {
      const annots = [...state.annotations]
      if (state.activeAnnotationId !== null) {
        const annot = annots.find(annot => annot.id === state.activeAnnotationId)

        if (annot !== undefined) {
          annot.body.value = '<p>' + body + '</p>'
          annot.body.modified = new Date().toJSON().slice(0, 19) + 'Z'
          state.annotations = annots
        }
      }
    },
    [mutations.ACTIVATE_COMPLAINT] (state, id) {
      console.log(mutations.ACTIVATE_COMPLAINT, id)
      state.activeComplaintId = id
    }
  },
  /**
   * @namespace store.actions
   * @memberof store
   */
  actions: {
    ...storeOSD.actions,
    ...storeWorks.actions,
    ...storeSources.actions,
    /**
     * load complaints
     * @memberof store.actions
     */
    [actions.loadComplaints] ({ commit, state }) {
      // TODO dynamic source
      const json = complaintsSetup
      json.complaints.forEach(complaint => commit(mutations.LOAD_COMPLAINT, complaint))
    },
    /**
     * activate zone
     * @memberof store.actions
     * @param {Object} callback commit, getters
     * @param {Object} payload source: String, zone: String
     */
    [actions.activateZone] ({ commit, getters }, { source, zone }) {
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
    [actions.createAnnotation] ({ commit, state }, annot) {
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
    [actions.modifyAnnotation] ({ commit, state }, body) {
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
    ...storeOSD.getters,
    ...storeWorks.getters,
    ...storeSources.getters,
    complaints: (state) => {
      return state.complaints
    },
    activeComplaintId (state) {
      return state.activeComplaintId
    },
    activeComplaint (state, getters) {
      const complaintId = getters.activeComplaintId
      // console.log(complaintId)
      if (complaintId) {
        const complaint = state.complaints.find(c => c['@id'] === complaintId)
        return complaint
      }
      return null
    }
  }
})
