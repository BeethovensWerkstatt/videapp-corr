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
export default directoryModule
