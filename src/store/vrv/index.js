import verovio from 'verovio'

import { registerMutations, registerActions } from '../names'

const toStore = {
  state: {
    // eslint-disable-next-line new-cap
    vrvToolkit: new verovio.toolkit()
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    vrvToolkit (state) {
      return state.vrvToolkit
    },
    vrvRender (state, mei) {
      var svg = state.vrvToolkit.renderData(mei)
      return svg
    }
  }
}

registerMutations(toStore.mutations)
registerActions(toStore.actions)

export default toStore
