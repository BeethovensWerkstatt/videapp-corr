import osdDefault from './osd.default'
import store from '@/store'
import n from '@/store/names'
import { Url } from '@/toolbox/net'
import axios from 'axios'

// TODO import from (e.g) public/config.json ?

const config = {
  api: {
    works: {
      async url () { return await getAPIURL('/module3/works.json') }
    }
  },
  osd: osdDefault,
  couchdb: {
    defaultName: 'axios-data'
  },
  mainbranch: 'main',
  version: new Promise((resolve, reject) => {
    axios.get('./version.json').then(({ status, data }) => {
      if (status === 200) {
        store.commit(n.mutations.SET_VERSION, data)
        resolve(data)
      } else {
        console.error('failed to load version.json!', status)
        reject(status)
      }
    })
  })
}

const API_HOST = {
  main: 'api.beethovens-werkstatt.de',
  dev: 'dev-api.beethovens-werkstatt.de',
  'jpv/dev': 'dev-api.beethovens-werkstatt.de'
}

export const getAPIURL = async function (path) {
  const version = await config.version
  const url = new Url('https://dev-api.beethovens-werkstatt.de/')
  if (API_HOST[version.branch]) {
    url.host = API_HOST[version.branch]
  }
  url.path = path
  console.log(version.branch, 'API: ' + url)
  return url.toString()
}

export default config
