<template>
  <div class="complaint-container">
    <complaint-dialog />
    <table class="complaint-list">
      <thead>
        <th colspan="2">{{ $t('terms.complaints') }}</th>
      </thead>
      <tbody :key="complaint['@id']"
        v-for="(complaint, ci) in complaints"
      >
        <tr
          v-if="complaint.movement && checkMvt(complaint.movement.n)"
          class="mvt"
        >
          <th>{{ toRoman(complaint.movement.n) + '.' }}&nbsp;</th>
          <th class="mvt" :title="complaint.movement.work">{{ complaint.movement.label }}</th>
        </tr>
        <tr
          :class="{
            'complaint-active': isActive(complaint),
            'complaint-error': (measures(complaint) === 'N/A')
          }"
          @click.prevent="toggleActivate(complaint)"
        >
          <td class="complaint-attribute"><sub>{{ ci + 1 }}</sub></td>
          <td class="complaint-attribute">{{ measures(complaint) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import ComplaintDialog from '@/components/ComplaintDialog.vue'
import { actions } from '@/store/names'
import toolbox from '@/toolbox'

/**
 * component to display list of complaints
 *
 * @module components/ComplaintsList
 * @vue-computed {Object[]} complaints
 * @vue-computed {String} activeComplaintId
 */
export default {
  components: { ComplaintDialog },
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
      return this.workComplaints(this.workId)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.complaint-container {
  width: 100%;
  max-height: 450px;
  overflow: scroll;
}
.complaint-list {
  width: 100%;
}

tr.mvt {
  th.mvt {
    background-color: #eee;
    width: 100%;
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
