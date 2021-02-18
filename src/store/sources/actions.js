import axios from 'axios'
import { mutations } from '../names'

import pageSetup from '@/temp/pageSetup.json'

const demoId = 'op73'
const TAG_MEASURE_POSITIONS = 'measure positions'

const actions = {
  /**
   * **TODO: load from REST API**
   *
   * load sources
   * @memberof store.actions
   * @param {function} commit
   * @param {object} state
   */
  async loadSources ({ commit, state, getters }, workId) {
    if (workId && workId !== demoId) {
      console.log(state.works, workId)
      const work = state.works.find(w => w.id === workId)
      if (work && work['@id'] && !work.sources) {
        // TODO select language
        console.log(work.title[0].title)
        work.sources = []
        const url = work['@id']
        const { data } = await axios.get(url)

        // default placement of sources
        const hgap = 10
        const vgap = 50
        var px = hgap
        var py = 0
        var ph = 0

        data.manifestations.forEach((m, index) => {
          console.log(m.label)

          const source = {
            id: m['@id'],
            workId,
            label: m.label,
            maxDimensions: { width: 0, height: 0 },
            // this still needs to be updated
            position: { x: (150 + index * 400), y: 400 },
            pages: [],
            rotation: 0,
            singleLeaf: false
          }

          const existingSource = state.sources.find(source => source.id === m.id)
          if (existingSource === undefined) {
            // get manifestation json
            axios.get(m.iiif.manifest).then(res => {
              const iiif = res.data
              // console.log(iiif)
              if (iiif.sequences && iiif.sequences.length > 0) {
                const canvases = iiif.sequences[0].canvases

                // helper to prepare page object
                const ctop = (canvas, place) => {
                  if (!canvas) {
                    return null
                  }
                  // default page height is 300mm if physicalScale is not defined
                  const physScale = (canvas.service && canvas.service.physicalScale)
                    ? canvas.service.physicalScale
                    : (300 / canvas.height)
                  const page = {
                    id: canvas['@id'],
                    label: canvas.label,
                    place,
                    dimensions: { width: canvas.width * physScale, height: canvas.height * physScale },
                    pixels: { width: canvas.width, height: canvas.height },
                    uri: canvas.images[0].resource.service['@id'],
                    measures: []
                  }

                  // load measure zones
                  const otherContent = canvas.otherContent
                  if (otherContent) {
                    const mpos = otherContent.find(oc => oc.label === TAG_MEASURE_POSITIONS)
                    if (mpos) {
                      page.measures_uri = mpos['@id']
                    }
                  }

                  return page
                }

                // iterate over pagepairs. First page is assumed verso.
                for (var ci = 0; ci <= canvases.length; ci += 2) {
                  const pagepair = {
                    r: ci > 0 ? ctop(canvases[ci - 1], 'recto') : null,
                    v: ci < canvases.length ? ctop(canvases[ci], 'verso') : null
                  }
                  source.pages.push(pagepair)
                  source.maxDimensions.width =
                    Math.max(source.maxDimensions.width,
                      ((pagepair.r ? pagepair.r.dimensions.width : 0) +
                       (pagepair.v ? pagepair.v.dimensions.width : 0)))
                  source.maxDimensions.height =
                    Math.max(source.maxDimensions.height,
                      (pagepair.r ? pagepair.r.dimensions.height : 0),
                      (pagepair.v ? pagepair.v.dimensions.height : 0))
                }
                console.log(source)

                // calc position
                if (px > hgap && (px + hgap + source.maxDimensions.width) > getters.deskDimensions.width) {
                  // start new line
                  px = 0
                  py += ph + vgap
                  ph = source.maxDimensions.height
                  source.position.x = px + hgap + (source.maxDimensions.width / 2)
                  source.position.y = py + vgap + (source.maxDimensions.height / 2)
                } else {
                  // next horizontal position
                  source.position.x = px + hgap + (source.maxDimensions.width / 2)
                  source.position.y = py + vgap + (source.maxDimensions.height / 2)
                  px += source.maxDimensions.width + hgap
                  ph = Math.max(ph, source.maxDimensions.height)
                }

                commit(mutations.LOAD_SOURCE, source)
              } else {
                console.warn('no sequence for "' + m.label + '"', iiif)
              }
            })
          }
        })
        work.sourcesLoadFinished = true
      }
    } else { // ---------------- op73 DEMO ---------------------------
      // this needs to be replaced with dynamic content
      const json = pageSetup

      // default placement of sources
      const hgap = 10
      const vgap = 50
      px = hgap
      py = 0
      ph = 0

      json.sources.forEach((source, index) => {
        const existingSource = state.sources.find(elem => elem.id === source.id)

        if (existingSource === undefined) {
          const obj = {}
          obj.id = source.id
          obj.workId = demoId
          obj.label = source.label
          obj.maxDimensions = {}
          // this needs to be updated
          obj.position = { x: (150 + index * 400), y: 400 }
          obj.rotation = (index - 1) * 20
          let maxRheight = 0
          let maxRwidth = 0
          let maxVheight = 0
          let maxVwidth = 0
          obj.pages = []
          const startsWithSingle = source.pages[0].pos === 'r'
          const singleLeaf = startsWithSingle && ((source.pages.length === 2 && source.pages[1].pos === 'v') || source.pages.length === 1)
          obj.singleLeaf = singleLeaf

          source.pages.forEach((page, i) => {
            if (page.pos === 'r') {
              maxRheight = Math.max(maxRheight, page.mmHeight)
              maxRwidth = Math.max(maxRwidth, page.mmWidth)
            } else {
              maxVheight = Math.max(maxVheight, page.mmHeight)
              maxVwidth = Math.max(maxVwidth, page.mmWidth)
            }
            // when first page starts recto
            if (startsWithSingle && i === 0) {
              const v = null
              const r = {
                uri: page.uri,
                id: page.id,
                label: page.label,
                pixels: { width: page.width, height: page.height },
                dimensions: { width: page.mmWidth, height: page.mmHeight },
                measures: page.measures,
                place: 'recto'
              }
              obj.pages.push({ v, r })
            } else if ((startsWithSingle && i % 2 === 1) || (!startsWithSingle && i % 2 === 0)) {
              const leftPage = page
              const rightPage = source.pages[i + 1]
              const v = {
                uri: leftPage.uri,
                id: leftPage.id,
                label: leftPage.label,
                pixels: { width: leftPage.width, height: leftPage.height },
                dimensions: { width: leftPage.mmWidth, height: leftPage.mmHeight },
                measures: leftPage.measures,
                place: 'verso'
              }
              const r = (rightPage !== undefined) ? {
                uri: rightPage.uri,
                id: rightPage.id,
                label: rightPage.label,
                pixels: { width: rightPage.width, height: rightPage.height },
                dimensions: { width: rightPage.mmWidth, height: rightPage.mmHeight },
                measures: rightPage.measures,
                place: 'recto'
              } : null
              obj.pages.push({ v, r })
            }
          })
          obj.maxDimensions.width = (!singleLeaf) ? maxRwidth + maxVwidth : Math.max(maxRwidth, maxVwidth)
          obj.maxDimensions.height = Math.max(maxVheight, maxRheight)
          obj.activePage = 0

          // calc position
          if (px > hgap && (px + hgap + obj.maxDimensions.width) > getters.deskDimensions.width) {
            // start new line
            px = 0
            py += ph + vgap
            ph = obj.maxDimensions.height
            obj.position.x = px + hgap + (obj.maxDimensions.width / 2)
            obj.position.y = py + vgap + (obj.maxDimensions.height / 2)
          } else {
            // next horizontal position
            obj.position.x = px + hgap + (obj.maxDimensions.width / 2)
            obj.position.y = py + vgap + (obj.maxDimensions.height / 2)
            px += obj.maxDimensions.width + hgap
            ph = Math.max(ph, obj.maxDimensions.height)
          }

          commit('LOAD_SOURCE', obj)
        }
      })
    } // ---------------- op73 DEMO END ------------------------
  },
  /**
   * load measure zones for a specific page
   * @memberof store.actions
   * @param {Object} context
   * @param {Object} payload - sourceId, pagenr, place, uri
   */
  loadZones (context, page) {
    if (!page) {
      return
    }
    const rexywh = new RegExp('xywh=(\\d+),(\\d+),(\\d+),(\\d+)')
    const uri = page.measures_uri
    page.measures_uri = null
    if (uri && (!page.measures || page.measures.length === 0)) {
      axios.get(uri).then(resp => {
        const zonedata = resp.data
        const measures = zonedata.resources.map(r => {
          const m = rexywh.exec(r.on.selector.value)
          if (m) {
            return {
              x: parseInt(m[1]),
              y: parseInt(m[2]),
              width: parseInt(m[3]),
              height: parseInt(m[4]),
              label: r.resource.chars,
              zone: r['@id'],
              id: r['@id']
            }
          }
          console.warn('no zone data', r)
          return { }
        })
        // console.log(measures)
        page.measures = measures
      })
    }
  },
  /**
   * activate zone
   * @memberof store.actions
   * @param {Object} callback commit, getters
   * @param {Object} payload source: String, zone: String
   */
  activateZone ({ commit, getters }, { source, zone }) {
    if (source) {
      const src = getters.getSourceById(source)
      if (src) {
        // console.log(source, zone)
        commit('MODIFY_SOURCE', { ...src, activeZoneId: zone })
        commit('ACTIVATE_SOURCE', source)
      }
    } else {
      commit('ACTIVATE_SOURCE', null)
    }
  }
}

export default actions
