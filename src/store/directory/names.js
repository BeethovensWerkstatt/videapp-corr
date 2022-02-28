
const state = {
  directory_works: 'directory_works',
  directory_modules: 'directory_modules'
}
const mutations = {}
const actions = {
  directory_load_db: 'directory_load_db'
}
const getters = {
  directory_works: 'directory_works',
  directory_get_work: 'directory_get_work',
  directory_modules: 'directory_modules',
  directory_get_module: 'directory_get_module'
}

export const directoryNames = {
  state, mutations, actions, getters
}

export default directoryNames
