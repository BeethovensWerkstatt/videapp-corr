/**
 * @module store
 */

import Vue from 'vue'
import Vuex from 'vuex'

import Processing from './processing'
import OSD from './osd'
import userDisplayOptions from './userDisplayOptions'
import Works from './works'
import Sources from './sources'
import Pages from './pages'
import Complaints from './complaints'
import Verovio from './vrv'

import { mutations } from './names'

Vue.use(Vuex)

const store = new Vuex.Store({
  /**
   * @namespace store.state
   * @memberof store
   * @property {String} version - version string containing date and git hash
   */
  state: {
    version: 'N/A'
  },
  /**
   * @namespace store.mutations
   * @memberof store
   */
  mutations: {
    SET_VERSION (state, version) {
      console.log('Version:\n' + version?.version)
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
    version (state) {
      return state.version
    }
  },
  modules: {
    Processing,
    OSD,
    userDisplayOptions,
    Works,
    Sources,
    Pages,
    Complaints,
    Verovio
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
