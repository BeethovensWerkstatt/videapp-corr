<template>
  <div class="complaint-container">
    <complaint-dialog />
    <table class="complaint-list">
      <thead>
        <th colspan="2">Monita</th>
      </thead>
      <tbody :key="complaint['@id']"
        v-for="(complaint, ci) in complaints"
      >
        <tr
          v-if="checkMvt(complaint.movement.n)"
          class="mvt"
        >
          <th>{{ toRoman(complaint.movement.n) + '.' }}&nbsp;</th>
          <th class="mvt">{{ complaint.movement.label }}</th>
        </tr>
        <tr
          :class="{ 'complaint-active': isActive(complaint) }"
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
 */
export default {
  components: { ComplaintDialog },
  data () {
    return {
    }
  },
  name: 'ComplaintsList',
  computed: {
    ...mapGetters(['complaints', 'activeComplaintId'])
  },
  methods: {
    checkMvt (mvt) {
      const t = mvt !== this.mvt
      this.mvt = mvt
      return t
    },
    isActive (complaint) {
      const complaintId = complaint ? complaint['@id'] : null
      return this.$store.getters.activeComplaintId === complaintId
    },
    measures (complaint) {
      const m = {}
      for (const c of complaint.measures) {
        const mi = +c.label
        if (!m.min || mi < m.min) {
          m.min = mi
        }
        if (!m.max || mi > m.max) {
          m.max = mi
        }
      }
      if (m.min === m.max) {
        return '' + m.min
      }
      if (m.max - m.min === 1) {
        return m.min + ', ' + m.max
      }
      return m.min + ' – ' + m.max
    },
    /**
     * toggle complaint selection
     */
    toggleActivate (complaint) {
      const complaintId = complaint ? complaint['@id'] : null
      if (complaintId === this.activeComplaintId) {
        this.$store.dispatch(actions.activateComplaint, null)
      } else {
        this.$store.dispatch(actions.activateComplaint, complaintId)
      }
    },
    toRoman (num) {
      return toolbox.toRoman(num)
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
  th {
  outline: 1px solid lightgray;
  }
  th.mvt {
    font-weight: bold;
    width: 100%;
    text-align: left;
    border-radius: 3pt;
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
</style>
