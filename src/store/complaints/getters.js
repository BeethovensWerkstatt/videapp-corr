import n from '@/store/names'
import tb from '@/toolbox'
import { compareWorks } from '@/store/works'

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
    })
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
    const f = c => tb.atId(c.movement?.work) === workId
    // console.log(getters.allComplaints)
    if (filtered) {
      return getters.complaints.filter(f)
    }
    return getters.allComplaints.filter(f)
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
      console.log(acid, ncid, complaintIds)
      return ncid
    }
    return undefined
  },
  [n.getters.nextComplaintId] (state, getters) {
    const acid = state[n.state.activeComplaintId]
    const complaintIds = getters[n.getters.complaints].map((c) => c['@id'])
    console.log(acid, complaintIds)
    if (acid) {
      const ncid = tb.findPrevious(complaintIds, (cid) => cid === acid)
      console.log(acid, ncid, complaintIds)
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
  [n.getters.sortedBy]: (state) => state[n.state.sortedBy],
  [n.getters.sortReverse]: (state) => state[n.state.sortReverse],
  [n.getters.complaintSorter] (state, getters) {
    const complaintSorter = state[n.state.complaintSorter]
    const stdSort = (c1, c2) => {
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
    const customSort = complaintSorter ? (c1, c2) => {
      const s = complaintSorter(c1, c2)
      return s || stdSort(c1, c2)
    } : stdSort
    return customSort
  }
}

export default getters
