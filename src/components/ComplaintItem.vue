<template>
  <div
    :title="complaint.movement.id"
    class="complaint-item"
    :class="{ 'complaint-active': isActive }"
    @click.prevent="toggleActivate"
  >
    <div class="complaint-attribute"><sub>{{ index + 1 }}</sub></div>
    <div class="complaint-attribute">{{ measures }}</div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { actions } from '@/store/names'

/**
 * one item in the list of complaints
 *
 * @module components/ComplaintItem
 * @vue-prop {Object} complaint
 * @vue-prop {Number} index - number in list
 * @vue-computed {String} activeComplaintId - id of selected complaint
 * @vue-computed {String} complaintId - id of this complaint
 * @vue-computed {boolean} isActive - true if this complaint is selected
 */
export default {
  name: 'ComplaintItem',
  props: {
    complaint: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters(['activeComplaintId']),
    complaintId () {
      return this.complaint['@id']
    },
    isActive () {
      return this.$store.getters.activeComplaintId === this.complaintId
    },
    measures () {
      const m = {}
      for (const c of this.complaint.measures) {
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
      return m.min + '-' + m.max
    }
  },
  methods: {
    /**
     * toggle complaint selection
     */
    toggleActivate () {
      if (this.complaintId === this.activeComplaintId) {
        this.$store.dispatch(actions.activateComplaint, null)
      } else {
        this.$store.dispatch(actions.activateComplaint, this.complaintId)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.complaint-item {
  display: table-row;
}

.complaint-attribute {
  display: table-cell;
  text-align: left;
  padding: 0px 1pt;

  sub {
    color: grey;
  }
}

.complaint-active {
  background-color: yellow;
  outline: 1px solid red;
}

</style>
