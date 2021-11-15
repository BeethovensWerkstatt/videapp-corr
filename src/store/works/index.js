// import axios from 'axios'
import config from '@/config'
import { startProc, finishProc } from '..'
import { mutations, actions, registerMutations, registerActions } from '../names'
import tb from '@/toolbox'

/**
 * @namespace store.works
 */
const worksModule = {
  /**
   * @namespace store.works.state
   * @property {Object[]} works available works
   */
  state: {
    works: []
  },
  /**
   * @namespace store.works.mutations
   */
  mutations: {
    /**
     * load work
     * @memberof store.works.mutations
     * @param {object} work
     */
    LOAD_WORK (state, work) {
      const works = [...state.works]
      if (!work.id) {
        work.id = tb.atId(work['@id'])
      }
      if (work.id) {
        works.push(work)
        state.works = works
      } else {
        console.error('no id', work)
      }
    }
  },
  /**
   * @namespace store.works.actions
   */
  actions: {
    /**
     * load works
     * @memberof store.works.actions
     */
    async loadWorks ({ commit, dispatch }) {
      startProc()
      try {
        const url = config.api.works.url
        // console.log(axios, url)
        // const { data } = await axios.get(url)
        const callback = ({ data }) => {
          for (const work of data) {
            // console.log(work)
            commit(mutations.LOAD_WORK, work)
            dispatch(actions.loadSources, work.id)
          }
        }
        dispatch(actions.getData, { url, callback })
      } finally {
        finishProc()
      }
    }
  },
  /**
   * @namespace store.works.getters
   * @property {Object[]} works array of available works
   */
  getters: {
    works: (state) => {
      return state.works
    }
  }
}

registerMutations(worksModule.mutations)
registerActions(worksModule.actions)

export default worksModule
