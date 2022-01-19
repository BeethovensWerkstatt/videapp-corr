<template>
  <div class="complaint-container">
    <complaints-filter-dialog :dialog="filterDialog" />
    <table class="complaint-list">
      <tbody v-if="complaints.length === 0">
        <tr class="mvt">
          <th v-if="!workId"><span>Werk</span></th>
          <th>
            <span>{{ $t('terms.movement') }}, {{ $t('terms.measure') }}</span>
            <complaints-filter-button :tag="sortTag.movementMeasure" />
          </th>
          <th
            v-for="(tag, i) in [sortTag.revisionObject, sortTag.textOperation, sortTag.classification, sortTag.context, sortTag.implementation, sortTag.document]"
            :key="i + '-label-' + tag"
            :class="{ sortColumn: sortedBy === tag }"
          >
            <span @click="sort(tag)">
              {{ $t(tagLabel[tag]) }}
              <div :class="sortIconC(tag)" />
            </span>
            <complaints-filter-button :tag="tag" />
          </th>
          <th>&nbsp;</th>
        </tr>
      </tbody>
      <tbody :key="complaint['@id']"
        v-for="(complaint, ci) in complaints"
      >
        <tr
          v-if="complaint.movement && (checkMvt(complaint.movement.n) || ci === 0)"
          class="mvt"
        >
          <!-- v-if="!workId": display work column if list is not constrained to work -->
          <th v-if="!workId" @click="sort(sortTag.movementMeasure)">
            <btn
              v-if="sortedBy === sortTag.movementMeasure"
              class="btn-link"
              @click="openWork(complaint)"
              :title="$t('messages.openDesktop')"
            >
              {{ workTitle(complaint.movement.work) }}
            </btn>
            <span v-else>Werk</span>
          </th>
          <th
            :class="{ sortColumn: sortedBy === sortTag.movementMeasure }"
            :title="workTitle(complaint.movement.work)">
            <span @click="sort(sortTag.movementMeasure)">
              <span v-if="sortedBy === sortTag.movementMeasure">{{ toRoman(complaint.movement.n) + '.' }} {{ complaint.movement.label }}</span>
              <span v-else>{{ $t('terms.movement') }}, {{ $t('terms.measure') }}</span>
              <span :class="sortIconC(sortTag.movementMeasure)" v-if="ci === 0" />
            </span>
            <complaints-filter-button :tag="sortTag.movementMeasure" v-if="ci === 0" />
          </th>
          <th
            v-for="(tag, i) in [sortTag.revisionObject, sortTag.textOperation, sortTag.classification, sortTag.context, sortTag.implementation, sortTag.document]"
            :key="i + '-label-' + tag"
            :class="{ sortColumn: sortedBy === tag }"
          >
            <span @click="sort(tag)">
              {{ $t(tagLabel[tag]) }}
              <div :class="sortIconC(tag)" v-if="ci === 0" />
            </span>
            <complaints-filter-button :tag="tag" v-if="ci === 0" />
          </th>
          <th>&nbsp;</th>
        </tr>
        <tr
        v-if="complaint.movement"
          :class="{
            'complaint-active': isActive(complaint),
            'complaint-error': (measures(complaint) === 'N/A')
          }"
          :id="'data-' + ci"
          :title="complaint.movement.work"
        >
          <!-- TODO work title column (optional) -->
          <td
            v-if="!workId"
            class="complaint-attribute"
            @click.prevent="toggleActivate(complaint)"
          >
            <span v-if="sortedBy === sortTag.movementMeasure" :title="workTitle(complaint.movement.work)">&nbsp;</span>
            <btn
              v-else
              class="btn-link"
              @click="openWork(complaint)"
              :title="$t('messages.openDesktop')"
            >
              {{ workTitle(complaint.movement.work) }}
            </btn>
          </td>
          <td
            class="complaint-attribute"
            @click.prevent="toggleActivate(complaint)"
          >
            <span v-if="sortedBy !== sortTag.movementMeasure && complaint.movement">
              {{ toRoman(complaint.movement.n) }},
            </span>
            {{ measures(complaint) }}
          </td>
          <td
            v-for="(tag, i) in [sortTag.revisionObject, sortTag.textOperation, sortTag.classification, sortTag.context, sortTag.implementation]"
            :key="i + '-value-' + tag"
            class="complaint-attribute"
            @click.prevent="toggleActivate(complaint)"
          >
            <span v-if="complaint.tags[tag].length === 0">&mdash;</span>
            <span v-for="(o,i) in complaint.tags[tag]" :key="o + '_' + i"><span v-if="i > 0">, </span>{{ $t('taxonomy.' + o) }}</span>
          </td>
          <td class="complaint-attribute">
            {{ complaintSigle(complaint) }}
          </td>
          <td class="complaint-attribute">
            <btn @click.prevent="openComplaint(complaint)">Monitum öffnen</btn>
            <!-- <btn @click.prevent="openPages(complaint)">Seiten öffnen</btn> -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import n from '@/store/names'
import toolbox from '@/toolbox'
import ComplaintsFilterButton from './ComplaintsFilterButton.vue'
import { sortTag, tagLabel } from '@/store/complaints/data'
import ComplaintsFilterDialog from './ComplaintsFilterDialog.vue'

/**
 * component to display list of complaints
 *
 * @module components/ComplaintsList
 * @vue-computed {Object[]} complaints
 * @vue-computed {String} activeComplaintId
 */
export default {
  components: { ComplaintsFilterButton, ComplaintsFilterDialog },
  data () {
    return {
      sortTag,
      tagLabel,
      displayFilter: false,
      filterTag: ''
    }
  },
  name: 'ComplaintsList',
  mounted () {
    this.sort(this.sortedBy)
  },
  computed: {
    ...mapGetters([
      n.getters.viewer,
      n.getters.workComplaints,
      n.getters.activeComplaintId,
      n.getters.complaintSorter,
      n.getters.getWork,
      n.getters.sortReverse,
      n.getters.sortedBy,
      n.getters.complaintFilterDialog]),
    workId () {
      return this.$route.params.id
    },
    complaints () {
      // filter workComplaints optionally
      const complaints = (this.workId) ? this.workComplaints(this.workId) : this.$store.getters[n.getters.complaints]
      // console.log(complaints)
      return complaints
    },
    filterDialog () {
      return this[n.getters.complaintFilterDialog]
    }
  },
  methods: {
    toRoman: toolbox.toRoman,
    workTitle (workId) {
      const work = this.getWork(workId)
      return work?.title[0].title
    },
    /**
     * check if new movement starts while looping through complaints
     * @param {String} mvt
     */
    checkMvt (mvt) {
      const t = mvt !== this.mvt && (this.sortedBy === sortTag.movementMeasure || !this.mvt)
      this.mvt = mvt
      return t
    },
    /**
     * check if complaint is active
     * @param {Object} complaint
     */
    isActive (complaint) {
      const complaintId = complaint ? complaint['@id'] : null
      return this.$store.getters.activeComplaintId === complaintId
    },
    /**
     * retrieve measures affected by complaint
     * @param {Object} complaint
     */
    measures (complaint) {
      if (complaint.affects?.length > 0) {
        return complaint.affects[0].measures.label
      }
      console.warn(complaint)
      return 'N/A'
    },
    complaintSigle (complaint) {
      const revDoc = complaint.revisionDoc
      // console.log(complaint)
      return revDoc || '?'
    },
    /**
     * toggle complaint selection
     */
    toggleActivate (complaint) {
      const complaintId = complaint ? complaint['@id'] : null
      if (complaintId === this.activeComplaintId) {
        this.$store.dispatch(n.actions.activateComplaint, null)
      } else if (this.measures(complaint) !== 'N/A') { // TODO availability should be marked by another property
        this.$store.dispatch(n.actions.activateComplaint, complaintId)
      }
    },
    openComplaint (complaint) {
      const complaintId = complaint ? complaint['@id'] : null
      // this.$store.dispatch(actions.loadComplaint, { complaint })
      this.$store.dispatch(n.actions.openComplaintComparison, complaintId)
      // this.$store.commit(mutations.DISPLAY_COMPLAINT, !!complaintId)
    },
    openPages (complaint, close = true) {
      this.$store.dispatch(n.actions.loadComplaint, {
        complaint,
        callback: (complaint) => {
          // console.log(complaint)
          for (const state of ['anteDocs', 'revisionDocs', 'postDocs']) {
            for (const c of complaint[state]) {
              const pageId = c.iiif[0]?.on.full
              const page = this.$store.getters.getPage(pageId)
              // console.log(state, page)
              this.$store.commit(
                n.mutations.SET_PAGE,
                {
                  id: page.source,
                  page: page.pagenumber
                })
            }
          }
        }
      })
      if (close) {
        this.$store.commit(n.mutations.COMPLAINTS_LIST, false)
      }
    },
    openWork (complaint) {
      const work = this.getWork(complaint.movement.work)
      if (work) {
        this.openPages(complaint, false)
        this.$router.push({ name: 'Schreibtisch', params: { id: work.id } }).then(() => {
          this.$store.dispatch(n.actions.activateComplaint, complaint['@id'])
          this.$store.commit(n.mutations.COMPLAINTS_LIST, true)
          this.viewer.navigator.element.style.display = 'none'
        })
      }
    },
    sort (tag) {
      // console.log('sort', tag)
      this.mvt = null
      const toggle = tag === this.sortedBy
      console.log(this[n.getters.sortReverse], toggle)

      const tagSorter = (tag) => (c1, c2) => {
        const o1 = c1.tags[tag]?.join('-')
        const o2 = c2.tags[tag]?.join('-')
        // TODO i18n?
        // console.log(ro1, ro2)
        if (typeof o1 === 'undefined') {
          console.warn('undefined tag!', c1.tags, c2.tags)
          return -1
        }
        return o1.localeCompare(o2)
      }
      const docSorter = (c1, c2) => {
        const d1 = c1.revisionDoc
        const d2 = c2.revisionDoc
        console.log(d1, d2)
        if (typeof d1 === 'undefined') {
          return -1
        }
        return d1.localeCompare(d2)
      }

      switch (tag) {
        case sortTag.revisionObject:
        case sortTag.textOperation:
        case sortTag.classification:
        case sortTag.context:
        case sortTag.implementation:
          this.$store.commit(n.mutations.SET_SORTER, { sortedBy: tag, sorter: tagSorter(tag), toggle })
          break
        case sortTag.document:
          this.$store.commit(n.mutations.SET_SORTER, { sortedBy: tag, sorter: docSorter, toggle })
          break
        case sortTag.movementMeasure: // use stdSort by work, movement and measure
        default:
          this.$store.commit(n.mutations.SET_SORTER, { sortedBy: sortTag.movementMeasure, sorter: null, toggle })
      }
    },
    sortIconC (tag) {
      const sorted = (this.sortedBy === tag)
      const classes = {
        sorted,
        icon: true,
        'icon-arrow-up': sorted && this[n.getters.sortReverse],
        'icon-arrow-down': !sorted || !this[n.getters.sortReverse]
      }
      return classes
    }
  }
}
</script>

<style lang="scss" scoped>
.complaint-container {
  width: 100%;
  max-height: 100%;
  overflow: scroll;
}
.complaint-list {
  width: 100%;
}

tr.mvt {
  th {
    position: relative;
    background-color: #eee;
    text-align: left;
    border-radius: 3pt;
    padding: 2pt 3pt 0pt 4pt;
    cursor: pointer;
  }
}

.complaint-attribute {
  padding: 0px 2pt;
  text-align: left;
  sub {
    display: inline-block;
    width: 100%;
    color: gray;
    text-align: right;
  }
}

.complaint-active {
  background-color: rgb(241, 241, 190);
  outline: 1px solid rgb(230, 116, 116);
}

.complaint-error {
  color: gray;
  text-decoration: line-through;
}

.sortColumn {
  color: blue;
}
th .icon {
  margin-left: 5px;
  color: lightgray;
}
th .icon.sorted {
  color: blue !important;
}
</style>
