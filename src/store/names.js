import { runtimeNames } from './runtime'
import { optionNames } from './userDisplayOptions'
import { DAnames } from './dataAccess/names'
import { OSDnames } from './osd'
import { verovioNames } from './vrv'
import { worksNames } from './works/names'
import { sourcesNames } from './sources'
import { pagesNames } from './pages'
import { infoboxnames } from './infobox'
import { complaintsNames } from './complaints/names'

/**
 * register action and mutation names
 *
 * @module store.names
 */

export const state = {
  version: 'version',
  ...runtimeNames.state,
  ...optionNames.state,
  ...DAnames.state,
  ...OSDnames.state,
  ...verovioNames.state,
  ...worksNames.state,
  ...sourcesNames.state,
  ...pagesNames.state,
  ...infoboxnames.state,
  ...complaintsNames.state
}
export const getters = {
  version: 'version',
  ...runtimeNames.getters,
  ...optionNames.getters,
  ...DAnames.getters,
  ...OSDnames.getters,
  ...verovioNames.getters,
  ...worksNames.getters,
  ...sourcesNames.getters,
  ...pagesNames.getters,
  ...infoboxnames.getters,
  ...complaintsNames.getters
}

export const mutations = {
  SET_VERSION: 'SET_VERSION',
  ...runtimeNames.mutations,
  ...optionNames.mutations,
  ...DAnames.mutations,
  ...OSDnames.mutations,
  ...verovioNames.mutations,
  ...worksNames.mutations,
  ...sourcesNames.mutations,
  ...pagesNames.mutations,
  ...infoboxnames.mutations,
  ...complaintsNames.mutations
}

export const actions = {
  ...runtimeNames.actions,
  ...optionNames.actions,
  ...DAnames.actions,
  ...OSDnames.actions,
  ...verovioNames.actions,
  ...worksNames.actions,
  ...sourcesNames.actions,
  ...pagesNames.actions,
  ...infoboxnames.actions,
  ...complaintsNames.actions
}

export default { actions, mutations, getters, state }
