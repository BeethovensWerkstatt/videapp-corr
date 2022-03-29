import n from '@/store/names'
import { compareWorks } from '@/store/works'
import tb, { filterAndCol } from '@/toolbox'
import { complaintFilterTags, sortTag } from './data'

/**
 * compare two complaints for sorting
 * @memberof store.complaints.getters
 * @function
 * @param {Object} c1 first complaint
 * @param {Object} c2 second complaint
 * @returns -1 if c1<c2, 1 if c1>c2, 0 if c1==c2
 */
export const compareComplaints = (c1, c2) => {
  const wc = compareWorks(c1.movement?.work, c2.movement?.work)
  if (wc !== 0) {
    return wc
  }
  if (c1.movement?.n !== c2.movement?.n) {
    return c1.movement?.n < c2.movement?.n ? -1 : 1
  }
  const m1 = parseInt(c1.affects[0].measures.label?.match(/\d+/))
  const m2 = parseInt(c2.affects[0].measures.label?.match(/\d+/))
  return m1 <= m2 ? -1 : 1
}

/**
 * @namespace store.complaints.getters
 * @property {Object[]} complaints array of complaints
 * @property {String} activeComplaintId id of displayed complaint
 * @property {Object} activeComplaint displayed complaint
 */
const getters = {
  [n.getters.showComplaintsList]: (state) => state.showComplaintsList,
  [n.getters.allComplaints]: (state, getters) => {
    const complaints = state.complaints.map(c => {
      const mdiv = c.affects[0]?.mdiv
      const movement = getters[n.getters.getMovementById](mdiv)
      // console.log(mdiv, movement)
      return { ...c, movement }
    }).sort(getters[n.getters.complaintSorter])
    return complaints
  },
  [n.getters.complaints]: (state, getters) => {
    // TODO keep filtered and sorted list in state !!
    const complaintFilter = state[n.state.complaintFilter]
    const filters = complaintFilter ? Object.values(complaintFilter).filter((f) => typeof f === 'function') : []
    // console.log(complaintFilter, filters)
    const complaints = filters.length > 0 ? state.complaints.filter((c) => {
      for (const f of filters) {
        // console.log(f)
        if (!f(c)) {
          return false
        }
      }
      return true
    }) : state.complaints
    const complaintlist = complaints.map(c => {
      const mdiv = c.affects[0]?.mdiv
      const movement = getters.getMovementById(mdiv)
      // console.log(mdiv, movement)
      return { ...c, movement }
    }).sort(getters[n.getters.complaintSorter])
    return state[n.state.sortReverse] ? complaintlist.reverse() : complaintlist
  },
  [n.getters.workComplaints]: (state, getters) => (workId, filtered = true) => {
    // TODO atId in loadComplaints?
    const workFilter = c => {
      // console.log(c.movement, tb.atId(c.movement?.work), workId)
      return tb.atId(c.movement?.work) === workId
    }
    // console.log(getters.allComplaints)
    if (filtered) {
      const complaintFilter = { ...state[n.state.complaintFilter] } || {}
      complaintFilter[sortTag.work] = workFilter
      const filters = Object.values(complaintFilter).filter((f) => typeof f === 'function')
      // console.log(complaintFilter, filters)
      const complaints = getters.allComplaints.filter(filterAndCol(filters))
      const complaintlist = complaints.map(c => {
        const mdiv = c.affects[0]?.mdiv
        const movement = getters.getMovementById(mdiv)
        // console.log(mdiv, movement)
        return { ...c, movement }
      }).sort(getters[n.getters.complaintSorter])
      return state[n.state.sortReverse] ? complaintlist.reverse() : complaintlist
    }
    return getters.allComplaints.filter(workFilter)
  },
  [n.getters.displayComplaint]: (state) => state.displayComplaint,
  [n.getters.activeComplaintId]: (state) => state.activeComplaintId,
  [n.getters.activeComplaint] (state, getters) {
    const complaintId = getters.activeComplaintId
    // console.log(complaintId)
    if (complaintId) {
      const complaint = state.complaints.find(c => c['@id'] === complaintId)
      // console.log(complaint)
      if (!complaint.movement) {
        const mdiv = complaint.affects[0]?.mdiv
        complaint.movement = getters.getMovementById(mdiv)
      }
      return complaint
    }
    return null
  },
  [n.getters.previousComplaintId] (state, getters) {
    const acid = state[n.state.activeComplaintId]
    if (acid) {
      const complaintIds = getters[n.getters.complaints].map((c) => c['@id'])
      const ncid = tb.findPrevious(complaintIds, (cid) => cid === acid)
      // console.log(acid, ncid, complaintIds)
      return ncid
    }
    return undefined
  },
  [n.getters.nextComplaintId] (state, getters) {
    const acid = state[n.state.activeComplaintId]
    const complaintIds = getters[n.getters.complaints].map((c) => c['@id'])
    // console.log(acid, complaintIds)
    if (acid) {
      const ncid = tb.findNext(complaintIds, (cid) => cid === acid)
      // console.log(acid, ncid, complaintIds)
      return ncid
    }
    return complaintIds.length > 0 ? complaintIds[0] : undefined
  },
  [n.getters.filterSelection]: (state) => (tag) => {
    const tagSel = state.filterSelect[tag]
    return tagSel || []
  },
  [n.getters.filterSelect]: (state, getters) => (tag, key) => {
    const tagSel = getters[n.getters.filterSelection](tag)
    // console.log(tagSel, key)
    return tagSel ? !!tagSel[key] : false
  },
  [n.getters.complaintFilterDialog]: (state) => state[n.state.complaintFilterDialog],
  [n.getters.complaintFilter]: (state) => state[n.state.complaintFilter],
  [n.getters.complaintFilterKeys]: (state, getters) => (filterTag, workId) => {
    switch (filterTag) {
      case sortTag.work:
        return getters[n.getters.complaintWorks]
      case sortTag.movementMeasure:
        return getters[n.getters.complaintMovements](workId)
      case sortTag.document:
        return getters[n.getters.complaintDocuments](workId)
    }
    if (filterTag) {
      return ['', ...complaintFilterTags[filterTag]]
    }
    return []
  },
  /**
   * create filter function for complaint table column of filterTag
   * @memberof store.complaints.getters
   * @param {String} filterTag complaint table column to filter
   * @param {String[]} keySet allowed keys in this column
   * @returns {Function} filter function
   */
  [n.getters.createComplaintFilter]: (state, getters) => (filterTag, filterSet) => {
    // console.log('set filter ...', filterSet)
    if (filterSet.length > 0) {
      // TODO movements / documents!!
      switch (filterTag) {
        // filter by work
        case sortTag.work:
          return (c) => {
            const mvt = getters[n.getters.getMovementById](c.affects[0].mdiv)
            for (const work of filterSet) {
              if (mvt?.work === work) {
                return true
              }
            }
          }
        // filter by movements
        case sortTag.movementMeasure:
          return (c) => {
            for (const mvt of filterSet) {
              if (c.affects[0].mdiv === mvt) {
                return true
              }
            }
            return false
          }
        // filter by revision document
        case sortTag.document:
          return (c) => {
            for (const doc of filterSet) {
              if (c.revisionDoc === doc) {
                return true
              }
            }
            return false
          }
      }
      // filter by tag list
      const filter = (c) => {
        const tags = c.tags[filterTag]
        for (const t of filterSet) {
          if (t === '') {
            if (tags.length === 0) {
              return true
            }
          } else if (tags.indexOf(t) >= 0) {
            return true
          }
        }
        return false
      }
      filter.filterTag = filterTag
      filter.filterSet = filterSet
      return filter
    }
  },
  /**
   * column of complaint table to sort by
   * @memberof store.complaints.getters
   */
  [n.getters.sortedBy]: (state) => state[n.state.sortedBy],
  /**
   * sort in reverse direction
   * @memberof store.complaints.getters
   */
  [n.getters.sortReverse]: (state) => state[n.state.sortReverse],
  /**
   * current sorter for complaints
   * @memberof store.complaints.getters
   */
  [n.getters.complaintSorter] (state) {
    const complaintSorter = state[n.state.complaintSorter]
    const customSort = complaintSorter ? (c1, c2) => {
      const s = complaintSorter(c1, c2)
      return s || compareComplaints(c1, c2)
    } : compareComplaints
    return customSort
  },

  [n.getters.complaintWorks] (state, getters) {
    const complaints = getters[n.getters.allComplaints]
    const works = [...new Set(complaints.map(c => c.movement.work))]
    return works
  },
  [n.getters.complaintMovements]: (state, getters) => (workId) => {
    // console.log('complaintMovements', workId)
    const complaints = workId ? getters[n.getters.workComplaints](workId, false) : getters[n.getters.allComplaints]
    const movements = [...new Set(complaints.map(c => c.affects[0].mdiv))]
    // console.log(workId, complaints, movements)
    return movements.sort((mdiv1, mdiv2) => {
      const m1 = getters[n.getters.getMovementById](mdiv1)
      const m2 = getters[n.getters.getMovementById](mdiv2)
      if (m1.work !== m2.work) {
        const mc = compareWorks(m1.work, m2.work)
        if (mc !== 0) {
          return mc
        }
      }
      if (m1.n < m2.n) return -1
      if (m1.n > m2.n) return 1
      return 0
    })
  },
  [n.getters.complaintDocuments]: (state, getters) => (workId) => {
    const complaints = workId ? getters[n.getters.workComplaints](workId, false) : getters[n.getters.allComplaints]
    const documents = [...new Set(complaints.map(c => c.revisionDoc))]
    // console.log('complaintDocuments', workId, complaints, documents)
    return documents
  }
}

export default getters
