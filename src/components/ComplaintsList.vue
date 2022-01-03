<template>
  <div class="complaint-container">
    <table class="complaint-list">
      <tbody :key="complaint['@id']"
        v-for="(complaint, ci) in complaints"
      >
        <tr
          v-if="complaint.movement && checkMvt(complaint.movement.n)"
          class="mvt"
        >
          <!-- TODO work title column (optional) -->
          <th @click="sort(sortTag.movementMeasure)"><span v-if="sortedBy === sortTag.movementMeasure">{{ toRoman(complaint.movement.n) + '.' }}</span>&nbsp;</th>
          <th
            @click="sort(sortTag.movementMeasure)"
            :class="{ sortColumn: sortedBy === sortTag.movementMeasure }"
            :title="workTitle(complaint.movement.work)">
            <span v-if="sortedBy === sortTag.movementMeasure">{{ complaint.movement.label }}</span>
            <span v-else>{{ $t('terms.movement') }}, {{ $t('terms.measure') }}</span>
            <span :class="sortIconC(sortTag.movementMeasure)" />
          </th>
          <th @click="sort(sortTag.revisionObject)" :class="{ sortColumn: sortedBy === sortTag.revisionObject }">
            {{ $t('terms.complaint.revision-object') }}
            <span :class="sortIconC(sortTag.revisionObject)" />
          </th>
          <th @click="sort(sortTag.textOperation)" :class="{ sortColumn: sortedBy === sortTag.textOperation }">
            {{ $t('terms.complaint.text-operation') }}
            <span :class="sortIconC(sortTag.textOperation)" />
          </th>
          <th @click="sort(sortTag.classification)" :class="{ sortColumn: sortedBy === sortTag.classification }">
            {{ $t('terms.complaint.classification') }}
            <span :class="sortIconC(sortTag.classification)" />
          </th>
          <th @click="sort(sortTag.context)" :class="{ sortColumn: sortedBy === sortTag.context }">
            {{ $t('terms.complaint.context') }}
            <span :class="sortIconC(sortTag.context)" />
          </th>
          <th @click="sort(sortTag.implementation)" :class="{ sortColumn: sortedBy === sortTag.implementation }">
            {{ $t('terms.complaint.implementation') }}
            <span :class="sortIconC(sortTag.implementation)" />
          </th>
          <th @click="sort(sortTag.document)" :class="{ sortColumn: sortedBy === sortTag.document }">
            {{ $t('terms.document') }}
            <span :class="sortIconC(sortTag.document)" />
          </th>
          <th>&nbsp;</th>
        </tr>
        <tr
          :class="{
            'complaint-active': isActive(complaint),
            'complaint-error': (measures(complaint) === 'N/A')
          }"
        >
          <!-- TODO work title column (optional) -->
          <td
            class="complaint-attribute"
            @click.prevent="toggleActivate(complaint)"
          >
            <sub v-if="sortedBy === sortTag.movementMeasure">{{ ci + 1 }}</sub>
          </td>
          <td
            class="complaint-attribute"
            @click.prevent="toggleActivate(complaint)"
          >
            {{ toRoman(complaint.movement.n) }}, {{ measures(complaint) }}
          </td>
          <td
            class="complaint-attribute"
            @click.prevent="toggleActivate(complaint)"
          >
            <span v-if="complaint.tags['objects'].length === 0">&mdash;</span>
            <span v-for="(o,i) in complaint.tags['objects']" :key="o + '_' + i"><span v-if="i > 0">, </span>{{ $t('taxonomy.' + o) }}</span>
          </td>
          <td
            class="complaint-attribute"
            @click.prevent="toggleActivate(complaint)"
          >
            <span v-if="complaint.tags['operation'].length === 0">&mdash;</span>
            <span v-for="(o,i) in complaint.tags['operation']" :key="o + '_' + i"><span v-if="i > 0">, </span>{{ $t('taxonomy.' + o) }}</span>
          </td>
          <td
            class="complaint-attribute"
            @click.prevent="toggleActivate(complaint)"
          >
            <span v-if="complaint.tags['classes'].length === 0">&mdash;</span>
            <span v-for="(o,i) in complaint.tags['classes']" :key="o + '_' + i"><span v-if="i > 0">, </span>{{ $t('taxonomy.' + o) }}</span>
          </td>
          <td
            class="complaint-attribute"
            @click.prevent="toggleActivate(complaint)"
          >
            <span v-if="complaint.tags['context'].length === 0">&mdash;</span>
            <span v-for="(o,i) in complaint.tags['context']" :key="o + '_' + i"><span v-if="i > 0">, </span>{{ $t('taxonomy.' + o) }}</span>
          </td>
          <td class="complaint-attribute">
            <span v-if="complaint.tags['implementation'].length === 0">&mdash;</span>
            <span v-for="(o,i) in complaint.tags['implementation']" :key="o + '_' + i"><span v-if="i > 0">, </span>{{ $t('taxonomy.' + o) }}</span>
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
import { actions, mutations, getters } from '@/store/names'
import toolbox from '@/toolbox'

// TODO export in store/complaints
const sortTag = {
  movementMeasure: 'movementMeasure',
  revisionObject: 'objects',
  textOperation: 'operation',
  classification: 'classes',
  context: 'context',
  implementation: 'implementation',
  document: 'document'
}

/**
 * component to display list of complaints
 *
 * @module components/ComplaintsList
 * @vue-computed {Object[]} complaints
 * @vue-computed {String} activeComplaintId
 */
export default {
  data () {
    return {
      sortTag
    }
  },
  name: 'ComplaintsList',
  mounted () {
    this.sort(this.sortedBy)
  },
  computed: {
    ...mapGetters([getters.workComplaints, getters.activeComplaintId, getters.complaintSorter, getters.getWork, getters.sortReverse, getters.sortedBy]),
    workId () {
      return this.$route.params.id
    },
    complaints () {
      // filter workComplaints optionally
      const complaints = this.workComplaints(this.workId)
      // console.log(complaints)
      return complaints
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
        this.$store.dispatch(actions.activateComplaint, null)
      } else if (this.measures(complaint) !== 'N/A') { // TODO availability should be marked by another property
        this.$store.dispatch(actions.activateComplaint, complaintId)
      }
    },
    openComplaint (complaint) {
      const complaintId = complaint ? complaint['@id'] : null
      // this.$store.dispatch(actions.loadComplaint, { complaint })
      this.$store.dispatch(actions.openComplaintComparison, complaintId)
      // this.$store.commit(mutations.DISPLAY_COMPLAINT, !!complaintId)
    },
    openPages (complaint, close = true) {
      this.$store.dispatch(actions.loadComplaint, {
        complaint,
        callback: (complaint) => {
          // console.log(complaint)
          for (const state of ['anteDocs', 'revisionDocs', 'postDocs']) {
            for (const c of complaint[state]) {
              const pageId = c.iiif[0]?.on.full
              const page = this.$store.getters.getPage(pageId)
              // console.log(state, page)
              this.$store.commit(
                mutations.SET_PAGE,
                {
                  id: page.source,
                  page: page.pagenumber
                })
            }
          }
        }
      })
      if (close) {
        this.$store.commit(mutations.COMPLAINTS_LIST, false)
      }
    },
    sort (tag) {
      // console.log('sort', tag)
      this.mvt = null

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
          this.$store.commit(mutations.SET_SORTER, { sortedBy: tag, sorter: tagSorter(tag) })
          break
        case sortTag.document:
          this.$store.commit(mutations.SET_SORTER, { sortedBy: tag, sorter: docSorter })
          break
        case sortTag.movementMeasure: // use stdSort by work, movement and measure
        default:
          this.$store.commit(mutations.SET_SORTER, { sortedBy: sortTag.movementMeasure, sorter: null })
      }
    },
    sortIconC (tag) {
      const sorted = (this.sortedBy === tag)
      const classes = {
        sorted,
        icon: true,
        'icon-arrow-up': sorted && this[getters.sortReverse] < 0,
        'icon-arrow-down': !sorted || this[getters.sortReverse] > 0
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
