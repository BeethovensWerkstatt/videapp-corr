import config from '@/config'
import axios from 'axios'
import { atId } from '@/toolbox'

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
  async loadDocuments ({ commit }) {
    const url = await config.api.documents.url()
    const { data } = await axios.get(url)
    for (const i in data) {
      const doc = data[i]
      doc.id = atId(doc['@id'])
      console.log(i, doc.id, doc)
      commit('LOAD_DOCUMENT', doc)
    }
  }
}

export const documentsModule = {
  state, getters, mutations, actions
}

export default documentsModule
