import osdDefault from './osd.default'
import store from '@/store'
import { Url } from '@/toolbox/net'

// TODO import from (e.g) public/config.json ?

const config = {
  api: {
    works: {
      // url: 'https://api.beethovens-werkstatt.de/module3/works.json'
      // url: 'http://localhost:8080/exist/apps/api/module3/works.json'
      url () { return getAPIURL('/module3/works.json') }
    }
  },
  osd: osdDefault,
  couchdb: {
    defaultName: 'axios-data'
  }
}

config.version = require('../../public/version.json')

fetch('./version.json').then(async resp => {
  if (resp.ok) {
    const v = await resp.json()
    config.version = v
    store.commit('SET_VERSION', config.version)
  }
})

const API_HOST = {
  main: 'api.beethovens-werkstatt.de',
  dev: 'dev-api.beethovens-werkstatt.de',
  'jpv/dev': 'dev-api.beethovens-werkstatt.de'
}

export const getAPIURL = function (path) {
  const url = new Url('https://api.beethovens-werkstatt.de/')
  if (API_HOST[config.version.branch]) {
    url.host = API_HOST[config.version.branch]
  }
  url.path = path
  console.log(config, 'API: ' + url)
  return url.toString()
}

export default config
