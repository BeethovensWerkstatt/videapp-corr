import axios from 'axios'
import config from '@/config'
import { mutations, actions, registerMutations, registerActions } from './names'
import { atId } from '@/toolbox'

const toStore = {
  state: {
    works: []
  },
  mutations: {
    /**
     * load work
     * @memberof store.mutations
     * @param {object} state
     * @param {object} work
     */
    LOAD_WORK (state, work) {
      const works = [...state.works]
      if (!work.id) {
        work.id = atId(work['@id'])
      }
      if (work.id) {
        works.push(work)
        state.works = works
      } else {
        console.error('no id', work)
      }
    }
  },
  actions: {
    /**
     * load works
     * @memberof store.actions
     * @param {function} commit
     * @param {Object} state
     */
    async loadWorks ({ commit, dispatch }) {
      // https://api.beethovens-werkstatt.de/module3/works.json
      const url = config.api.works.url
      // console.log(axios, url)
      const { data } = await axios.get(url)
      for (const work of data) {
        // console.log(work)
        commit(mutations.LOAD_WORK, work)
        dispatch(actions.loadSources, work.id)
      }
    }
  },
  getters: {
    works: (state) => {
      return state.works
    }
  }
}

registerMutations(toStore.mutations)
registerActions(toStore.actions)

export default toStore
