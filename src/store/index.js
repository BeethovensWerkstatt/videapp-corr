import Vue from 'vue'
import Vuex from 'vuex'

import storeOSD from './osd'
import storeWorks from './works'
import storeSources from './sources'
import storeComplaints from './complaints'
import storeVerovio from './vrv'

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
 */
export default new Vuex.Store({
  state: {
    ...storeOSD.state,
    ...storeWorks.state,
    ...storeSources.state,
    ...storeComplaints.state,
    ...storeVerovio.state
  },
  /**
   * @namespace store.mutations
   * @memberof store
   */
  mutations: {
    ...storeOSD.mutations,
    ...storeWorks.mutations,
    ...storeSources.mutations,
    ...storeComplaints.mutations,
    ...storeVerovio.mutations
  },
  /**
   * @namespace store.actions
   * @memberof store
   */
  actions: {
    ...storeOSD.actions,
    ...storeWorks.actions,
    ...storeSources.actions,
    ...storeComplaints.actions,
    ...storeVerovio.actions
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
   * @property {Object[]} complaints - list of complaints loaded
   * @property {String} activeComplaintId - id of selected complaint object
   * @property {Object} activeComplaint - selected complaint object
   */
  getters: {
    ...storeOSD.getters,
    ...storeWorks.getters,
    ...storeSources.getters,
    ...storeComplaints.getters,
    ...storeVerovio.getters
  }
})
