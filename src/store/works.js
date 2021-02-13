import axios from 'axios'
import config from '@/config'
import { mutations, registerMutations, registerActions } from './names'

const AtReId = new RegExp('^.*\\/([^\\/\\.]*)\\.json')

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
        const atid = work['@id']
        const m = AtReId.exec(atid)
        if (m && m[1]) {
          work.id = m[1]
        }
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
    async loadWorks ({ commit, state }) {
      // https://api.beethovens-werkstatt.de/module3/works.json
      const url = config.api.works.url
      // console.log(axios, url)
      const { data } = await axios.get(url)
      for (const work of data) {
        // console.log(work)
        commit(mutations.LOAD_WORK, work)
      }
    }
  }
}

registerMutations(toStore.mutations)
registerActions(toStore.actions)

export default toStore
