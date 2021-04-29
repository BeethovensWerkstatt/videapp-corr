/**
 * @module store
 */

import Vue from 'vue'
import Vuex from 'vuex'

import storeProcessing from './processing'
import storeOSD from './osd'
import storeWorks from './works'
import storeSources from './sources'
import storeComplaints from './complaints'
import storeVerovio from './vrv'

import { mutations } from './names'

Vue.use(Vuex)

/**
 * @namespace store
 */
const store = new Vuex.Store({
  /**
   * @namespace store.state
   * @memberof store
   * @property {String} version - version string containing date and git hash
   * @property {Number} working - number of working threads for display of activity
   * @property {Object} viewer - OpenSeadragon Viewer object
   * @property {Object} vrvToolkit - Verovio toolkit
   * @property {Number} scale - current scale of OpenSeadragon.Viewer
   * @property {Object} movements - movements of displayed work
   * @property {Object[]} sources - list of source objects
   * @property {String} activeSourceId - id of selected source
   * @property {Object[]} complaints - list of complaints
   * @property {String} activeComplaintId - id of selected complaint
   */
  state: {
    version: 'N/A',
    ...storeProcessing.state,
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
    SET_VERSION (state, version) {
      console.log('Version:\n' + version)
      state.version = version
    },
    ...storeProcessing.mutations,
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
    ...storeProcessing.actions,
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
   * @property {Object} vrvToolkit - Verovio toolkit
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
    version (state) {
      return state.version
    },
    ...storeProcessing.getters,
    ...storeOSD.getters,
    ...storeWorks.getters,
    ...storeSources.getters,
    ...storeComplaints.getters,
    ...storeVerovio.getters
  }
})

/**
 * start proc indicator
 * @function
 */
export const startProc = function () {
  store.commit(mutations.SET_WORKING, true)
}

/**
 * stop proc indicator
 * @function
 */
export const finishProc = function () {
  store.commit(mutations.SET_WORKING, false)
}

export default store
