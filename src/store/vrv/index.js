import verovio from 'verovio'

import { mutations, registerMutations, registerActions } from '../names'

const toStore = {
  state: {
    vrvToolkit: null
  },
  mutations: {
    INIT_VEROVIO (state, vrvToolkit) {
      state.vrvToolkit = vrvToolkit
    }
  },
  actions: {
    initVerovio ({ commit }) {
      verovio.module.onRuntimeInitialized = () => {
        // eslint-disable-next-line new-cap
        const vrvToolkit = new verovio.toolkit()
        commit(mutations.INIT_VEROVIO, vrvToolkit)
      }
    }
  },
  getters: {
    vrvToolkit (state) {
      return state.vrvToolkit
    },
    vrvRender (state, mei) {
      if (state.vrvToolkit) {
        var svg = state.vrvToolkit.renderData(mei)
        return svg
      }
      return null
    }
  }
}

registerMutations(toStore.mutations)
registerActions(toStore.actions)

export default toStore
