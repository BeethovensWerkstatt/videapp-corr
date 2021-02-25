import verovio from 'verovio'

import { registerMutations, registerActions } from '../names'

const toStore = {
  state: {
    vrvInitFinished: false
  },
  mutations: {
  },
  actions: {
    /**
     * init Verovio toolkit
     * @memberof store.actions
     * @param {Object} context
     */
    async initVerovio ({ state }) {
      verovio.module.onRuntimeInitialized = () => {
        state.vrvInitFinished = true
      }
    }
  },
  getters: {
    /**
     * Verovio toolkit factory method
     * @param {Object} state
     */
    vrvToolkit: (state) => () => {
      if (state.vrvInitFinished) {
        // eslint-disable-next-line new-cap
        const vrvToolkit = new verovio.toolkit()
        return vrvToolkit
      }
      return null
    }
  }
}

registerMutations(toStore.mutations)
registerActions(toStore.actions)

export default toStore
