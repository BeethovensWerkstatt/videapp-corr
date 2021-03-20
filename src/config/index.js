import osdDefault from './osd.default'

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
    config.version = v.version
    console.log(config.version)
  }
})

export default config
