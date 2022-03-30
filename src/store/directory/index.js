import n from '@/store/names'
import config from '@/config'

const state = {
  [n.state.directory_works]: [],
  [n.state.directory_modules]: []
}
const mutations = {}
const actions = {
  async [n.actions.directory_load_db] ({ state, getters }) {
    const db = require('./db.json')
    state[n.state.directory_works] = db.works
    for (const w in db.works) {
      const work = db.works[w]
      // TODO main!
      const version = await config.version
      if (work.dev && version.branch === 'main') {
        delete work.app
        delete work.route
        delete work.apptitle
        console.log('hide dev', work)
      }
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
    // console.log(getters[n.getters.directory_modules])
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
    // console.log('opus', w1.opus, w2.opus)
    if (w1.opus < w2.opus) return -1
    if (w1.opus > w2.opus) return 1
    if (w1.opus === w2.opus) return w1.title?.localeCompare(w2.title)
  }
  if (w1.woo && w2.woo) {
    // console.log('woo', w1.woo, w2.woo)
    if (w1.woo < w2.woo) return -1
    if (w1.woo > w2.woo) return 1
    if (w1.woo === w2.woo) return w1.title?.localeCompare(w2.title)
  }
  if (w1.opus && w2.woo) return -1
  if (w1.woo && w2.opus) return 1
  console.warn('opus?/woo?', w1, w2)
  return w1.title?.localeCompare(w2.title) || 0
}

export default directoryModule
