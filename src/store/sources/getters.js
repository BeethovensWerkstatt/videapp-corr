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
  movements: (state) => {
    return state.movements
  },
  /**
   * get movement by id
   * @memberof store.sources.getters
   * @param {String} mvtId
   * @returns {Object} movement of id `mvtId`
   */
  getMovementById: (state) => (mvtId) => {
    const movements = state.movements
    if (movements) {
      return movements[mvtId]
    }
    return undefined
  },
  sources: (state) => {
    // console.log(state.sources)
    return state.sources
  },
  /**
   * get sources for work
   * @memberof store.sources.getters
   * @param {String} workId return sources of work
   * @returns {Object[]} sources
   */
  workSources: (state) => (workId) => {
    // TODO sources should be stored per work
    const sources = state.sources.filter(src => src.workId === workId)
    // console.log(workId, sources)
    return sources
  },
  activeSourceId: (state) => {
    return state.activeSourceId
  },
  activeSource: (state, getters) => {
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
  getSourceById: (state) => (id) => {
    // console.log('get source: ' + id)
    if (!id) {
      throw new Error('source id undefined!')
    }
    return state.sources.find(source => source.id === id)
  },
  activeZoneId: (state, getters) => {
    const source = getters.activeSource
    // console.log(source)
    if (source) {
      // console.log(source.activeZoneId)
      return source.activeZoneId
    }
    return null
  },
  activeZone: (state, getters) => {
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
  getZoneById: (state, getters) => (sourceId, zoneId) => {
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
  }
}

export default getters
