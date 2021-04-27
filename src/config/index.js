import osdDefault from './osd.default'
import store from '@/store'

// TODO import from (e.g) public/config.json ?

const config = {
  api: {
    works: {
      url: 'https://api.beethovens-werkstatt.de/module3/works.json'
    }
  },
  osd: osdDefault
}

fetch('./version.json').then(async resp => {
  if (resp.ok) {
    const v = await resp.json()
    config.version = v
    store.commit('SET_VERSION', config.version)
  }
})

export default config
