import config from '@/config'
import axios from 'axios'
// import { atId } from '@/toolbox'

export const state = {
  documents: []
}

export const getters = {
  documents: state => state.documents,
  getDocument: state => (docid) => {
    console.log('getDocument', docid)
    return state.documents.find(doc => doc.id === docid)
  }
}

export const mutations = {
  LOAD_DOCUMENT (state, doc) {
    const docs = state.documents.filter(d => d.id !== doc.id)
    docs.push(doc)
    state.documents = docs
  }
}

export const actions = {
  async loadDocuments ({ commit, dispatch }) {
    const url = await config.api.documents.url()
    const { data } = await axios.get(url)
    for (const doc of data) {
      dispatch('initSource', { murl: doc['@id'], callback: (doc_) => commit('LOAD_DOCUMENT', { ...doc, ...doc_ }) })
    }
  }
}

export const documentsModule = {
  state, getters, mutations, actions
}

export default documentsModule
