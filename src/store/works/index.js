// import axios from 'axios'
import config from '@/config'
import { startProc, finishProc } from '..'
import { worksNames } from './names'
import { mutations, actions } from '../names'
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
    [worksNames.state.works]: []
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
    [worksNames.mutations.LOAD_WORK] (state, work) {
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
    async [worksNames.actions.loadWorks] ({ commit, dispatch }) {
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
    [worksNames.getters.works]: (state) => {
      return state.works
    }
  }
}

export default worksModule
