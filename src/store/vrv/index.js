import verovio from 'verovio'
import { verovioNames } from './names'

/**
 * @namespace store.verovio
 */
const verovioModule = {
  /**
   * @namespace store.verovio.state
   * @property {Boolean} vrvInitFinished true if verovio is eventually initialized
   */
  state: {
    [verovioNames.state.vrvInitFinished]: false
  },
  mutations: {
  },
  /**
   * @namespace store.verovio.actions
   */
  actions: {
    /**
     * init Verovio toolkit
     * @memberof store.verovio.actions
     * @param {Object} context
     */
    async [verovioNames.actions.initVerovio] ({ state }) {
      verovio.module.onRuntimeInitialized = () => {
        state.vrvInitFinished = true
      }
    }
  },
  /**
   * @namespace store.verovio.getters
   */
  getters: {
    /**
     * Verovio toolkit factory method
     * @memberof store.verovio.getters
     * @param {Object} state
     */
    [verovioNames.getters.vrvToolkit]: (state) => () => {
      if (state.vrvInitFinished) {
        // eslint-disable-next-line new-cap
        const vrvToolkit = new verovio.toolkit()
        return vrvToolkit
      }
      return null
    }
  }
}

export default verovioModule
