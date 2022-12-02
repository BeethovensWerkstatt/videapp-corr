import { Url } from '@/toolbox/net'
import { pagesNames } from './names'
import canvases from './canvases.json'

/**
 * @namespace store.processing
 */
const pagesModule = {
  state: {
    [pagesNames.state.pages]: {},
    canvases: [canvases]
  },
  mutations: {
    [pagesNames.mutations.LOAD_PAGE] (state, page) {
      const pages = { ...state.pages }
      pages[page.uuid] = page
      state.pages = pages
    }
  },
  actions: {},
  getters: {
    [pagesNames.getters.getPage]: (state) => (id) => {
      /*
      for (const page in state.pages) {
        console.log(page, id)
      }
      */
      // workaround
      const atid = new Url(id)
      const uuid = atid.path.elements.pop()
      // console.log(uuid, state.pages)
      return state.pages[uuid]
    },
    getCanvasLabels: (state, getters) => (id) => {
      for (const src of state.canvases) {
        // console.log('page', id, src)
        const matchID = (c) => {
          const id1 = c.canvas
          const id2 = id
          if (id1 === id2) return true
          const p1 = new Url(id1).path.elements.pop()
          const p2 = new Url(id2).path.elements.pop()
          // console.log('"' + p1 + '" --- "' + p2 + '"')
          if (p1 === p2) return true
          return false
        }
        const l = src.provenances.find(matchID)
        if (l) {
          // console.log(l)
          return l
        }
      }
      return undefined
    }
  }
}

export default pagesModule
