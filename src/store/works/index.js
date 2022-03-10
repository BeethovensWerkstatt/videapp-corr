// import axios from 'axios'
import config from '@/config'
import store, { startProc, finishProc } from '..'
import n from '@/store/names'
import tb from '@/toolbox'

/**
 * compare two works by opus number for sorting
 * @function
 * @param {String} wid1 id of first work
 * @param {String} wid2 id of second work
 */
export const compareWorks = (wid1, wid2) => {
  // console.log(wid1, wid2)
  if (wid1 === wid2) {
    return 0
  }
  // TODO why do I need to separate them?
  // TODO erase workaround if opus number is part of work structure!
  const matchOpus1 = /Op.\s*(\d+)/gm
  const matchOpus2 = /Op.\s*(\d+)/gm

  const work1 = store.getters[n.getters.getWork](wid1)
  const work2 = store.getters[n.getters.getWork](wid2)
  if (work1?.title[0].title !== work2?.title[0].title) {
    const t1 = work1?.title[0].title
    const t2 = work2?.title[0].title
    if (!!t1 && !!t2) {
      const m1 = matchOpus1.exec(t1)
      const o1 = m1 ? parseInt(m1[1]) : 0
      const m2 = matchOpus2.exec(t2)
      const o2 = m2 ? parseInt(m2[1]) : 0
      if (o1 < o2) {
        return -1
      } else if (o1 > o2) {
        return 1
      }
    }
    return t2?.localeCompare(t1) > 0 ? -1 : 1
  }
  return 0
}

/**
 * @namespace store.works
 */
const worksModule = {
  /**
   * @namespace store.works.state
   * @property {Object[]} works available works
   */
  state: {
    [n.state.works]: []
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
    [n.mutations.LOAD_WORK] (state, work) {
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
    async [n.actions.loadWorks] ({ commit, dispatch }) {
      startProc()
      try {
        const url = await config.api.works.url()
        // console.log(axios, url)
        // const { data } = await axios.get(url)
        const callback = ({ data }) => {
          for (const work of data) {
            // console.log(work)
            commit(n.mutations.LOAD_WORK, work)
            dispatch(n.actions.loadSources, work.id)
          }
        }
        dispatch(n.actions.getData, { url, callback })
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
    [n.getters.works]: (state) => {
      return state.works
    },
    [n.getters.getWork]: (state) => (id) => state.works.find((w) => w['@id'] === id || w.id === id)
  }
}

export default worksModule
