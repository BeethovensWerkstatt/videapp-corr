import osdDefault from './osd.default'
import store from '@/store'
import n from '@/store/names'
import { Url, Path } from '@/toolbox/net'
import axios from 'axios'

// TODO import from (e.g) public/config.json ?

const config = {
  api: {
    works: {
      async url () { return await getAPIURL('/module3/works.json') }
    },
    documents: {
      async url () { return await getAPIURL('/module4/documents.json') }
    }
  },
  osd: osdDefault,
  /* couchdb: {
    defaultName: 'axios-data'
  }, */
  mainbranch: 'main',
  version: new Promise((resolve, reject) => {
    axios.get(process.env.BASE_URL + 'version.json').then(({ status, data }) => {
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

const API_URL = {
  'jpv/dev': 'http://localhost:8080/exist/apps/api/'
}
const API_HOST = {
  main: 'api.beethovens-werkstatt.de',
  dev: 'dev-api.beethovens-werkstatt.de'
}

export const getAPIURL = async function (path) {
  const version = await config.version
  const urlstr = API_URL[version.branch]
  const url = new Url(urlstr || 'https://dev-api.beethovens-werkstatt.de/')
  if (API_HOST[version.branch]) {
    url.host = API_HOST[version.branch]
  }
  if (url.path.length === 0) {
    url.path = path
  } else {
    const ppath = new Path(path)
    url.path.directory = false
    ppath.absolute = false
    url.path = url.path + '/' + ppath
  }
  console.log(version.branch, 'API: ' + url)
  return url.toString()
}

export default config
