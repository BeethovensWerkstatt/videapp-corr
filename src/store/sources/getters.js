// import { Url } from '@/toolbox/net'
import n from '@/store/names'

/**
 * @namespace store.sources.getters
 * @property {Object} movements
 * @property {Object[]} sources
 * @property {String} activeSourceId id of selected source
 * @property {Object} activeSource selected source
 * @property {String} activeZoneId id of selected measure zone
 * @property {Object} activeZone selected measure zone
 */
const getters = {
  // TODO: get source/movement title image, get image from HTML/SVG (canvas.toDataURL)
  [n.getters.movements]: (state) => {
    return state.movements
  },
  /**
   * get movement by id
   * @memberof store.sources.getters
   * @param {String} mvtId
   * @returns {Object} movement of id `mvtId`
   */
  [n.getters.getMovementById]: (state) => (mvtId) => {
    const movements = state.movements
    if (movements) {
      return movements[mvtId]
    }
    return undefined
  },
  [n.getters.sources]: (state) => {
    // console.log(state.sources)
    return state.sources
  },
  /**
   * get sources for work
   * @memberof store.sources.getters
   * @param {String} workId return sources of work
   * @returns {Object[]} sources
   */
  [n.getters.workSources]: (state) => (workId) => {
    // TODO sources should be stored per work
    const sources = state.sources.filter(src => src.workId === workId)
    /*
    if (workId === 'xf3f76067-b8a1-48ce-878f-41b9a0ef0c8d') {
      console.log(workId, sources.map(s => (new Url(s.id)).path.elements.pop()))
    }
    */
    return sources
  },
  [n.getters.activeSourceId]: (state) => {
    return state.activeSourceId
  },
  [n.getters.activeSource]: (state, getters) => {
    if (state.activeSourceId) {
      const source = getters.getSourceById(state.activeSourceId)
      // console.log('active source: ' + source)
      return source
    }
    return null
  },
  /**
   * find source object by id
   * @memberof store.sources.getters
   * @param {String} id - id of source object
   * @returns {Object} source of id or undefined
   */
  [n.getters.getSourceById]: (state) => (id) => {
    // console.log('get source: ' + id)
    if (!id) {
      throw new Error('source id undefined!')
    }
    return state.sources.find(source => source.id === id)
  },
  [n.getters.activeZoneId]: (state, getters) => {
    const source = getters.activeSource
    // console.log(source)
    if (source) {
      // console.log(source.activeZoneId)
      return source.activeZoneId
    }
    return null
  },
  [n.getters.activeZone]: (state, getters) => {
    const source = getters.activeSource
    const zoneId = getters.activeZoneId
    if (source && zoneId) {
      const pagenr = source.pagenr ? source.pagenr : 0
      const rzones = source.pages[pagenr].r ? source.pages[pagenr].r.measures : []
      const vzones = source.pages[pagenr].v ? source.pages[pagenr].v.measures : []
      const zone = [...rzones, ...vzones].find(zone => zone.zone === zoneId)
      return zone
    }
    return null
  },
  /**
   * find zone by id. If `sourceId` is null, all sources are searched,
   * until a zone with a matching id is found.
   *
   * @memberof store.sources.getters
   * @param {String} sourceId - id of containing source object or null
   * @param {String} zoneId - id of zone object
   */
  [n.getters.getZoneById]: (state, getters) => (sourceId, zoneId) => {
    const findZone = function (source, zoneId) {
      for (var p = 0; p < source.pages.length; p++) {
        const pp = source.pages[p]
        if (pp.r) {
          const zone = pp.r.measures.find(zone => zone.zone === zoneId)
          if (zone) {
            return zone
          }
        }
        if (pp.v) {
          const zone = pp.v.measures.find(zone => zone.zone === zoneId)
          if (zone) {
            return zone
          }
        }
      }
      return null
    }
    const source = sourceId ? getters.getSourceById(sourceId) : null
    if (source) {
      return findZone(source, zoneId)
    }
    if (!sourceId) {
      state.sources.forEach((source) => {
        const zone = findZone(source, zoneId)
        if (zone) {
          return zone
        }
      })
    }
    return null
  },

  [n.getters.getPageMarkers]: (state, getters) => (sourceId) => {
    const markers = []

    const source = getters.getSourceById(sourceId)
    const structures = {}
    for (const s in source.structures) {
      const struct = source.structures[s]
      structures[struct['@id']] = struct
    }
    const toc = source.structures.find(s => s.viewingHint === 'top')
    if (toc?.ranges) {
      for (const r in toc.ranges) {
        const part = structures[toc.ranges[r]]
        if (part?.ranges) {
          const movs = part.ranges.map(mid => structures[mid])
          // console.log(movs[0])
          const pages = movs[0].canvases
          if (pages) {
            const page = getters.getPage(pages[0])
            markers.push({
              name: {
                recto: part.label[0],
                verso: part.label[0]
              },
              page: page.pagenumber,
              place: page.place
            })
          }
        } else if (part?.canvases) {
          const page = getters.getPage(part.canvases[0])
          // console.log(part.label, page.pagenumber)
          markers.push({
            name: {
              recto: part.label,
              verso: part.label
            },
            page: page.pagenumber,
            place: page.place
          })
        } else {
          console.warn(part)
        }
      }
    }
    // dummy markers every 5th dbl page
    /*
    const dpagecount = source.pages.length
    for (var i = 0; i < dpagecount; i += 5) {
      markers.push({
        name: {
          recto: '' + (i * 2 + 1),
          verso: '' + (i * 2 + 2)
        },
        page: i
      })
    }
     */
    return markers
  }
}

export default getters
