import n from '@/store/names'

const state = {
  [n.state.directory_works]: [],
  [n.state.directory_modules]: []
}
const mutations = {}
const actions = {
  [n.actions.directory_load_db] ({ state, getters }) {
    const db = require('./db.json')
    state[n.state.directory_works] = db.works
    for (const w in db.works) {
      const work = db.works[w]
      for (const m in work.modules) {
        const mod = work.modules[m]
        if (db.modules[mod]) {
          db.modules[mod].works = db.modules[mod].works
            ? [...new Set([...db.modules[mod].works, w])]
            : [w]
        } else {
          console.warn('module not found', m, '(' + w + ')')
        }
      }
    }
    state[n.state.directory_modules] = db.modules
    console.log(getters[n.getters.directory_modules])
  }
}
const getters = {
  [n.getters.directory_works]: (state) => ({ ...state[n.state.directory_works] }),
  [n.getters.directory_get_work]: (state) => (key) => state[n.state.directory_works][key],
  [n.getters.directory_modules]: (state) => ({ ...state[n.state.directory_modules] }),
  [n.getters.directory_get_module]: (state) => (key) => state[n.state.directory_modules][key]
}

const directoryModule = {
  state, mutations, actions, getters
}

export const workSorter = (w1, w2) => {
  if (w1.opus && w2.opus) {
    if (w1.opus < w2.opus) return -1
    if (w1.opus > w2.opus) return 1
    if (w1.opus === w2.opus) return 0
  }
  if (w1.woo && w2.woo) {
    if (w1.woo < w2.woo) return -1
    if (w1.woo > w2.woo) return 1
    if (w1.woo === w2.woo) return 0
  }
  if (w1.opus && w2.woo) return -1
  if (w1.woo && w2.opus) return 1
}

export default directoryModule
