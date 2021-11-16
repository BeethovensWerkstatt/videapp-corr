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
          <th>{{ toRoman(complaint.movement.n) + '.' }}&nbsp;</th>
          <th :title="complaint.movement.work">{{ complaint.movement.label }}</th>
          <th>Änderungsgegenstand</th>
          <th>Textoperation</th>
          <th>Klassifizierung</th>
          <th>Kontextzitat</th>
          <th>&nbsp;</th>
        </tr>
        <tr
          :class="{
            'complaint-active': isActive(complaint),
            'complaint-error': (measures(complaint) === 'N/A')
          }"
        >
          <td
            class="complaint-attribute"
            @click.prevent="toggleActivate(complaint)"
          >
            <sub>{{ ci + 1 }}</sub>
          </td>
          <td
            class="complaint-attribute"
            @click.prevent="toggleActivate(complaint)"
          >
            {{ measures(complaint) }}
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
            <btn @click.prevent="openComplaint(complaint)">Monitum öffnen</btn>
            <btn @click.prevent="openPages(complaint)">Seiten öffnen</btn>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { actions, mutations } from '@/store/names'
import toolbox from '@/toolbox'

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
    }
  },
  name: 'ComplaintsList',
  computed: {
    ...mapGetters(['workComplaints', 'activeComplaintId']),
    workId () {
      return this.$route.params.id
    },
    complaints () {
      const complaints = this.workComplaints(this.workId)
      // console.log(complaints)
      return complaints
    }
  },
  methods: {
    toRoman (num) {
      return toolbox.toRoman(num)
    },
    /**
     * check if new movement starts while looping through complaints
     * @param {String}
     */
    checkMvt (mvt) {
      const t = mvt !== this.mvt
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
      this.$store.dispatch(actions.activateComplaint, complaintId)
      this.$store.commit(mutations.DISPLAY_COMPLAINT, !!complaintId)
    },
    openPages (complaint, close = true) {
      this.$store.dispatch('loadComplaint', {
        complaint,
        callback: (complaint) => {
          console.log(complaint)
          for (const state of ['anteDocs', 'revisionDocs', 'postDocs']) {
            for (const c of complaint[state]) {
              const pageId = c.iiif[0]?.on.full
              const page = this.$store.getters.getPage(pageId)
              console.log(state, page)
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
        this.$store.commit('COMPLAINTS_LIST', false)
      }
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
  background-color: yellow;
  outline: 1px solid red;
}

.complaint-error {
  color: gray;
  text-decoration: line-through;
}
</style>
