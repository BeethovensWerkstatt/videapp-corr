import axios from 'axios'
import { mutations as mut, actions as act } from '../names'

import { finishProc, startProc } from '..'
import { Url } from '@/toolbox/net'

// otherContent label for measure positions URL
const TAG_MEASURE_POSITIONS = 'measure positions'
// otherContent label for measure positions URL
const TAG_SVG_SHAPES = 'svg shapes'
// regex to extract position data from `xywh`
const rexywh = new RegExp('xywh=(\\d+),(\\d+),(\\d+),(\\d+)')

const relabel = new RegExp('([a-zA-Z0-9-_]+) (\\d+)')

/**
 * @namespace store.sources.actions
 */
const actions = {
  /**
   * load sources and complaints
   * @memberof store.sources.actions
   * @param {function} commit
   * @param {object} state
   */
  async loadSources ({ commit, dispatch, state, getters }, workId) {
    if (workId) {
      // console.log(state.works, workId)
      const work = getters.works.find(w => {
        if (w.id === workId) {
          // console.log(workId, w)
        }
        return w.id === workId
      })
      if (work && work['@id'] && !work.sources) {
        // TODO select language
        console.log(work.title[0].title)
        work.sources = []
        const url = work['@id']
        startProc()
        const { data } = await axios.get(url)

        // default placement of sources
        const hgap = getters.sourceHorizontalGap + (2 * getters.sourceMarginWidth)
        const vgap = getters.sourceVerticalGap + getters.sourceHeaderHeight
        var px = hgap / 2
        var py = 0
        var ph = 0

        dispatch(act.loadMovements, data)

        // load complaints for this work
        dispatch(act.loadComplaints, data)

        // console.log(data.manifestations)

        data.manifestations.forEach(async (murl, index) => {
          const resp = await axios.get(murl)
          const m = resp.data
          // console.log(m)

          const source = {
            id: m['@id'],
            workId,
            label: m.label,
            // these values are updated later
            maxDimensions: { width: 0, height: 0 },
            position: { x: (150 + index * 400), y: 400 },
            pages: [],
            pageref: {},
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
                const structures = iiif.structures
                // console.log(structures)

                // TODO workaround!
                const exuuid = (atid) => {
                  const path = new Url(atid).path
                  return path.elements.pop()
                }
                // end TODO

                // helper to prepare page object
                const ctop = (canvas, place) => {
                  if (!canvas) {
                    return null
                  }
                  // console.log(canvas, place)
                  // default page height is 300mm if physicalScale is not defined
                  const physScale = (canvas.service && canvas.service.physicalScale)
                    ? canvas.service.physicalScale
                    : (300 / canvas.height)
                  const page = {
                    work: workId,
                    source: source.id,
                    id: canvas['@id'],
                    uuid: exuuid(canvas['@id']),
                    label: canvas.label,
                    place,
                    dimensions: { width: canvas.width * physScale, height: canvas.height * physScale },
                    pixels: { width: canvas.width, height: canvas.height },
                    uri: canvas.images[0].resource.service['@id'],
                    measures: [] // load measures?
                  }
                  commit(mut.LOAD_PAGE, page)

                  // get measure zones uri
                  const otherContent = canvas.otherContent
                  // console.log(otherContent)
                  if (otherContent) {
                    const mpos = otherContent.find(oc => oc.within?.label === TAG_MEASURE_POSITIONS)
                    if (mpos) {
                      // console.log(mpos)
                      // zones are loaded when page is opened first time
                      page.measures_uri = mpos['@id']
                    }
                    const psvg = otherContent.find(oc => oc.within?.label === TAG_SVG_SHAPES)
                    if (psvg) {
                      page.svg_shapes = psvg['@id']
                    }
                  }

                  return page
                }

                // iterate over pagepairs. First page is assumed verso.
                for (var ci = 0; ci <= canvases.length; ci += 2) {
                  const recto = ci > 0 ? ctop(canvases[ci - 1], 'recto') : null
                  const verso = ci < canvases.length ? ctop(canvases[ci], 'verso') : null
                  // corresponding index in pagepair list
                  const pagenumber = source.pages.length

                  // TODO database/webSQL for fast retrievement of source+page for measure and/or complaint
                  if (recto) {
                    source.pageref[recto.uuid] = {
                      work: workId,
                      source: source.id,
                      n: pagenumber,
                      page: recto
                    }
                    recto.pagenumber = pagenumber
                    recto.place = 'verso'
                  }
                  if (verso) {
                    source.pageref[verso.uuid] = {
                      work: workId,
                      source: source.id,
                      n: pagenumber,
                      page: verso
                    }
                    verso.pagenumber = pagenumber
                    verso.place = 'recto'
                  }
                  // END TODO

                  const pagepair = { r: recto, v: verso }
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
                // console.log(source)

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

                // TODO unfold
                source.structures = structures

                commit(mut.LOAD_SOURCE, source)
              } else {
                console.warn('no sequence for "' + m.label + '"', iiif)
              }
            })
          }
        })
        finishProc()
        work.sourcesLoadFinished = true
      }
    }
  },
  /**
   * load movements
   * @memberof store.sources.actions
   * @param {Object} payload object containing property `movements`
   */
  async loadMovements ({ commit }, { movements }) {
    if (movements) {
      for (const m of movements) {
        // console.log(m)
        const resp = await axios.get(m)
        if (resp.data) {
          commit(mut.LOAD_MOVEMENT, resp.data)
        } else {
          console.error(resp)
        }
      }
    }
  },
  /**
   * load measure zones for a specific page
   * @memberof store.sources.actions
   * @param {Object} context
   * @param {Object} payload - sourceId, pagenr, place, uri
   */
  loadZones (context, page) {
    if (!page) {
      return
    }
    // only load once
    const uri = page.measures_uri
    page.measures_uri = null
    if (uri && (!page.measures || page.measures.length === 0)) {
      axios.get(uri).then(resp => {
        const zonedata = resp.data
        const measures = zonedata.resources.map(r => {
          const m = rexywh.exec(r.on.selector.value)
          const chrs = r.resource?.chars
          const attr = chrs ? chrs.split(',') : []
          const staff = []
          const measure = []

          for (const a of attr) {
            const m = relabel.exec(a)
            if (m) {
              const n = parseInt(m[2])
              switch (m[1]) {
                case 'measure':
                  measure.push(n)
                  break
                case 'staff':
                  staff.push(n)
                  break
              }
            }
          }
          // console.log(staff, measure)

          if (m) {
            return {
              x: parseInt(m[1]),
              y: parseInt(m[2]),
              width: parseInt(m[3]),
              height: parseInt(m[4]),
              measure: measure,
              staff: staff,
              label: '',
              title: r.resource.chars,
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
   * @memberof store.sources.actions
   * @param {Object} callback commit, getters
   * @param {Object} payload source: String, zone: String
   */
  activateZone ({ commit, getters }, { source, zone }) {
    if (source) {
      const src = getters.getSourceById(source)
      if (src) {
        // console.log(source, zone)
        commit(mut.MODIFY_SOURCE, { ...src, activeZoneId: zone })
        commit(mut.ACTIVATE_SOURCE, source)
      }
    } else {
      commit(mut.ACTIVATE_SOURCE, null)
    }
  }
}

export default actions
