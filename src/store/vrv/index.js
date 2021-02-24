import verovio from 'verovio'

import { mutations, registerMutations, registerActions } from '../names'

const toStore = {
  state: {
    vrvToolkit: null
  },
  mutations: {
    /**
     * set vrvToolkit variable
     * @memberof store.mutations
     * @param {Object} vrvToolkit - the toolkit
     */
    INIT_VEROVIO (state, vrvToolkit) {
      state.vrvToolkit = vrvToolkit
    }
  },
  actions: {
    /**
     * init Verovio toolkit
     * @memberof store.actions
     * @param {Object} context
     */
    initVerovio ({ commit }) {
      verovio.module.onRuntimeInitialized = () => {
        // eslint-disable-next-line new-cap
        const vrvToolkit = new verovio.toolkit()
        commit(mutations.INIT_VEROVIO, vrvToolkit)
      }
    }
  },
  getters: {
    vrvToolkit: (state) => {
      return state.vrvToolkit
    },
    /**
     * render MEI
     * @memberof store.getters
     * @param {String} mei - MEI string
     * @param {Object} options - Verovio options
     */
    vrvRender: (state) => (mei, options) => {
      if (state.vrvToolkit) {
        var svg = state.vrvToolkit.renderData(mei, options)
        return svg
      }
      return null
    }
  }
}

registerMutations(toStore.mutations)
registerActions(toStore.actions)

export default toStore
