import axios from 'axios'
import { mutations as mut, actions as act } from '../names'
import { Positioner } from '.'
import { finishProc, startProc } from '..'
import { Url } from '@/toolbox/net'
import positions from './positions.json'

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
  async [act.loadSources] ({ commit, dispatch, state, getters }, workId) {
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
        work.label = work.title
        work.title = data.title

        /*
        const positioner = new Positioner({
          width: getters.deskDimensions.width,
          hgap: getters.sourceHorizontalGap + (2 * getters.sourceMarginWidth),
          vgap: getters.sourceVerticalGap + getters.sourceHeaderHeight
        })
        */

        dispatch(act.loadMovements, { work: work['@id'], ...data })

        // load complaints for this work
        dispatch(act.loadComplaints, { work: work['@id'], ...data })

        // console.log(data.manifestations)
        /*
        const initSource = async (murl, index = 0) => {
          const resp = await axios.get(murl)
          const m = resp.data
          // console.log(m)

          const existingSource = state.sources.find(source => source.id === m.id)
          if (existingSource === undefined) {
            // get manifestation json
            axios.get(m.iiif.manifest).then(res => {
              const iiif = res.data

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

              // console.log(iiif)
              if (iiif.sequences?.length > 0) {
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

                  const physScale = (canvas.images[0] && canvas.images[0].resource && canvas.images[0].resource.service && canvas.images[0].resource.service.service && canvas.images[0].resource.service.service.physicalScale)
                    ? canvas.images[0].resource.service.service.physicalScale
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

                // iterate over pagepairs. First page is assumed recto.
                for (var ci = 0; ci <= canvases.length; ci += 2) {
                  const recto = ci < canvases.length ? ctop(canvases[ci], 'recto') : null
                  const verso = ci > 0 ? ctop(canvases[ci - 1], 'verso') : null
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
                    recto.place = 'recto'
                  }
                  if (verso) {
                    source.pageref[verso.uuid] = {
                      work: workId,
                      source: source.id,
                      n: pagenumber,
                      page: verso
                    }
                    verso.pagenumber = pagenumber
                    verso.place = 'verso'
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
                positioner.addSource(source)
                // console.log(source.position)

                // hack !!!
                const sid = (new Url(source.id)).path.elements.pop()
                if (positions[sid]) source.position = positions[sid]

                // TODO unfold
                source.structures = structures

                commit(mut.LOAD_SOURCE, source)
              } else {
                console.warn('no sequence for "' + m.label + '"', iiif)
              }
            })
          }
        }
        */
        const initSource = (murl, index) => dispatch('initSource', { murl, index, workId })
        data.manifestations.forEach(initSource)
        finishProc()
        work.sourcesLoadFinished = true
      }
    }
  },

  /**
   * init source
   * @memberof store.sources.actions
   * @param {Function} commit
   * @param {Object} state
   * @param {String} murl url of source
   * @param {Number} [index=0] number in list of source
   * @param {Positioner} [positioner=new Positioner(...)] helper to layout sources on the desktop
   * @param {String} [workId=""] id of work
   */
  async initSource ({ commit, state, getters }, {
    murl,
    index = 0,
    positioner = new Positioner({
      width: getters.deskDimensions.width,
      hgap: getters.sourceHorizontalGap + (2 * getters.sourceMarginWidth),
      vgap: getters.sourceVerticalGap + getters.sourceHeaderHeight
    }),
    workId = ''
  }) {
    const resp = await axios.get(murl)
    const m = resp.data
    // console.log(m)

    const existingSource = state.sources.find(source => source.id === m.id)
    if (existingSource === undefined) {
      // get manifestation json
      axios.get(m.iiif.manifest).then(res => {
        const iiif = res.data

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

        // console.log(iiif)
        if (iiif.sequences?.length > 0) {
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

            const physScale = (canvas.images[0] && canvas.images[0].resource && canvas.images[0].resource.service && canvas.images[0].resource.service.service && canvas.images[0].resource.service.service.physicalScale)
              ? canvas.images[0].resource.service.service.physicalScale
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

          // iterate over pagepairs. First page is assumed recto.
          for (var ci = 0; ci <= canvases.length; ci += 2) {
            const recto = ci < canvases.length ? ctop(canvases[ci], 'recto') : null
            const verso = ci > 0 ? ctop(canvases[ci - 1], 'verso') : null
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
              recto.place = 'recto'
            }
            if (verso) {
              source.pageref[verso.uuid] = {
                work: workId,
                source: source.id,
                n: pagenumber,
                page: verso
              }
              verso.pagenumber = pagenumber
              verso.place = 'verso'
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
          positioner.addSource(source)
          // console.log(source.position)

          // hack !!!
          const sid = (new Url(source.id)).path.elements.pop()
          if (positions[sid]) source.position = positions[sid]

          // TODO unfold
          source.structures = structures

          commit(mut.LOAD_SOURCE, source)
        } else {
          console.warn('no sequence for "' + m.label + '"', iiif)
        }
      })
    }
  },

  /**
   * load movements
   * @memberof store.sources.actions
   * @param {Object} payload object containing property `movements`
   */
  async [act.loadMovements] ({ commit }, { movements, work }) {
    if (movements) {
      for (const m of movements) {
        // console.log(m)
        axios.get(m).then(({ data }) => {
          const movement = {
            '@id': m,
            work,
            ...data
          }
          commit(mut.LOAD_MOVEMENT, movement)
        }).catch(error => {
          console.error(error)
        })
      }
    }
  },
  /**
   * load measure zones for a specific page
   * @memberof store.sources.actions
   * @param {Object} context
   * @param {Object} payload - sourceId, pagenr, place, uri
   */
  [act.loadZones] ({ dispatch }, page) {
    if (!page) {
      return
    }
    // only load once
    const uri = page.measures_uri
    page.measures_uri = null
    if (uri && (!page.measures || page.measures.length === 0)) {
      const callback = resp => {
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
      }
      dispatch(act.getData, { url: uri, callback, error: reason => console.warn(reason) })
      // axios.get(uri).then(callback).catch(reason => console.warn(reason))
    }
  },
  /**
   * activate zone
   * @memberof store.sources.actions
   * @param {Object} callback commit, getters
   * @param {Object} payload source: String, zone: String
   */
  [act.activateZone] ({ commit, getters }, { source, zone }) {
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
