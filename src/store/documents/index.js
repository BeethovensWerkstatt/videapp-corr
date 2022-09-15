import config from '@/config'
import axios from 'axios'

export const state = {
  documents: []
}
export const getters = {
  getDocument: state => (docid) => {
    console.log('getDocument', docid)
    return state.documents.find(doc => doc.id === docid)
  }
}
export const mutations = {}
export const actions = {
  async loadDocuments ({ dispatch }) {
    const url = await config.api.works.url()
    const { data } = axios.get(url)
    console.log(data)
  }
}

export const documentsModule = {
  state, getters, mutations, actions
}

export default documentsModule
