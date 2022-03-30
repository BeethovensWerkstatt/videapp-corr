<template>
  <div class="complaint-list-container">
    <complaints-filter-dialog :dialog="filterDialog" />
    <table class="complaint-list unselectable">
      <tbody v-if="complaints.length === 0">
        <tr class="mvt">
          <th v-if="!workId">
            <span>
              {{ $tc('terms.work', 1) }}
            </span>
            <complaints-filter-button :tag="sortTag.work" />
          </th>
          <th :class="{ sortColumn: sortedBy === sortTag.movementMeasure }">
            <span @click="sort(sortTag.movementMeasure)">
              <span>{{ $t('terms.location') }}</span>
            </span>
            <div class="nobreak">
              <span :class="sortIconC(sortTag.movementMeasure)" @click="sort(sortTag.movementMeasures)" />
              <complaints-filter-button :tag="sortTag.movementMeasure" />
            </div>
          </th>
          <th
            v-for="(tag, i) in [/*sortTag.revisionObject, */sortTag.textOperation, sortTag.classification, sortTag.context, sortTag.implementation, sortTag.document]"
            :key="i + '-label-' + tag"
            :class="{ sortColumn: sortedBy === tag }"
          >
            <span @click="sort(tag)">
              {{ $t(tagLabel[tag]) }}
            </span>
            <div class="nobreak">
              <div :class="sortIconC(tag)" @click="sort(tag)" />
              <complaints-filter-button :tag="tag" />
            </div>
          </th>
          <th>&nbsp;</th>
          <th>&nbsp;</th>
          <th>&nbsp;</th>
        </tr>
      </tbody>
      <tbody :key="complaint['@id']"
        v-for="(complaint, ci) in complaints"
      >
        <tr
          v-if="complaint.movement && (checkMvt(complaint.movement) > 0 || ci === 0)"
          class="mvt"
        >
          <template v-if="mvtsep === 2 || ci === 0">
            <!-- v-if="!workId": display work column if list is not constrained to work -->
            <th v-if="!workId">
              <span>
                {{ $tc('terms.work', 1) }}
              </span>
              <complaints-filter-button :tag="sortTag.work" v-if="ci === 0" />
            </th>
            <th :class="{ sortColumn: sortedBy === sortTag.movementMeasure }">
              <div @click="sort(sortTag.movementMeasure)" class="nobreak">
                <span>{{ $t('terms.location') }}</span>
              </div>
              <div class="nobreak">
                <span :class="sortIconC(sortTag.movementMeasure)" v-if="ci === 0" @click="sort(sortTag.movementMeasure)" />
                <complaints-filter-button :tag="sortTag.movementMeasure" v-if="ci === 0" />
              </div>
            </th>
            <th
              v-for="(tag, i) in [/*sortTag.revisionObject, */sortTag.textOperation, sortTag.classification, sortTag.context, sortTag.implementation, sortTag.document]"
              :key="i + '-label-' + tag"
              :class="{ sortColumn: sortedBy === tag }"
            >
              <span @click="sort(tag)">
                {{ $t(tagLabel[tag]) }}
              </span>
              <div class="nobreak">
                <div :class="sortIconC(tag)" v-if="ci === 0" @click="sort(tag)" />
                <complaints-filter-button :tag="tag" v-if="ci === 0" />
              </div>
            </th>
            <th>&nbsp;</th>
            <th>&nbsp;</th>
          </template>
          <template v-else>
            <th v-if="!workId"></th>
            <th></th>
            <!-- <th></th> -->
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </template>
        </tr>
        <tr
        v-if="complaint.movement"
          :class="{
            'complaint-active': isActive(complaint),
            'complaint-error': (measures(complaint) === 'N/A')
          }"
          :id="'data-' + ci"
        >
          <!-- if workId is set, we are in work related desktop view and column is not needed -->
          <td
            v-if="!workId"
            class="complaint-attribute"
            @click.prevent="toggleActivate(complaint)"
            :title="workLongTitle(complaint.movement.work)"
          >
            {{ workTitle(complaint.movement.work) }}
          </td>
          <td
            class="complaint-attribute"
            @click.prevent="toggleActivate(complaint)"
          >
            <template v-if="complaint.movement && complaint.movement.label">
              {{ complaint.movement.label }},
            </template>
            {{ 'T. ' + measures(complaint) }}
          </td>
          <td
            v-for="(tag, i) in [/*sortTag.revisionObject, */sortTag.textOperation, sortTag.classification, sortTag.context, sortTag.implementation]"
            :key="i + '-value-' + tag"
            class="complaint-attribute"
            @click.prevent="toggleActivate(complaint)"
          >
            <template v-if="complaint.tags[tag].length === 0">&mdash;</template>
            <template v-for="(o,i) in complaint.tags[tag]"><template v-if="i > 0">, </template>{{ $t('taxonomy.' + o) }}</template>
          </td>
          <td class="complaint-attribute">
            {{ complaintSigle(complaint) }}
          </td>
          <td class="complaint-attribute">
            <btn v-if="complaint.staticExample">statische Ansicht</btn>
            <btn v-else @click.prevent="openComplaint(complaint)">Monitum öffnen</btn>
          </td>
          <td class="complaint-attribute">
            <btn @click="openWork(complaint)" v-if="!complaint.staticExample">
              {{ $t('messages.openDesktop') }}
            </btn>
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
    this.sort(this.sortedBy, false)
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
      return work?.label[0].title ? work?.label[0].title : work?.title[0].title
    },
    workLongTitle (workId) {
      const work = this.getWork(workId)
      return work?.title[0].title
    },
    /**
     * check if new movement.work starts while looping through complaints
     * @param {String} mvt
     * @returns 1 if movement changes, 2 if work changes
     */
    checkMvt (mvt) {
      // if mvtsep is part of data an infinite loop is triggered so this is a hidden property of this vue component
      // !!! this is not recommended practice !!!
      this.mvtsep = 0
      if (mvt !== this.mvt && (!this.mvt || (this.sortedBy === sortTag.movementMeasure))) {
        if (this.mvt?.work !== mvt?.work) {
          this.mvtsep = 2
        } else if (this.mvt?.n !== mvt?.n) {
          this.mvtsep = 1
        }
      }
      this.mvt = mvt
      // console.log(this.mvt, mvt, this.mvtsep)
      return this.mvtsep
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
    sort (tag, volatil = true) {
      console.log('sort', tag)
      this.mvt = null
      const toggle = volatil && !!tag && tag === this.sortedBy
      // console.log(this[n.getters.sortReverse], toggle)

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
.complaint-list-container {
  width: 100%;
  max-height: 100%;
  overflow: scroll;
  padding-bottom: 1rem;
}
.complaint-list {
  width: 100%;
  min-width: 1200px;
  table {
    width: 100%;
  }
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

.nobreak {
  display: inline-block;
  white-space: nowrap;
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

</style>
