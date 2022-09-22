/**
 * @module store
 */

import Vue from 'vue'
import Vuex from 'vuex'

import runtime from './runtime'
import OSD from './osd'
import userDisplayOptions from './userDisplayOptions'
import dataAccess from './dataAccess'
import Works from './works'
import Documents from './documents'
import Sources from './sources'
import Pages from './pages'
import Complaints from './complaints'
import Verovio from './vrv'
import Infobox from './infobox'
import Directory from './directory'

import n from './names'

Vue.use(Vuex)

const store = new Vuex.Store({
  /**
   * @namespace store.state
   * @memberof store
   * @property {String} version - version string containing date and git hash
   */
  state: {
    [n.state.version]: 'N/A'
  },
  /**
   * @namespace store.mutations
   * @memberof store
   */
  mutations: {
    [n.mutations.SET_VERSION] (state, version) {
      console.log('Version:\n' + version?.version + version?.branch)
      state.version = version
    }
  },
  /**
   * @namespace store.actions
   * @memberof store
   */
  actions: {
  },
  /**
   * @namespace store.getters
   * @memberof store
   * @property {String} version - git commt info
   */
  getters: {
    [n.getters.version]: (state) => state.version
  },
  modules: {
    runtime,
    Directory,
    OSD,
    userDisplayOptions,
    dataAccess,
    Works,
    Documents,
    Sources,
    Pages,
    Complaints,
    Verovio,
    Infobox
  }
})

/**
 * start proc indicator
 * @function
 */
export const startProc = function () {
  store.commit(n.mutations.SET_WORKING, true)
}

/**
 * stop proc indicator
 * @function
 */
export const finishProc = function () {
  store.commit(n.mutations.SET_WORKING, false)
}

export default store
