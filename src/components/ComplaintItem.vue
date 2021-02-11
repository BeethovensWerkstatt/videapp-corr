<template>
  <div
    :title="complaint.movement.id"
    class="complaint-item"
    :class="{ 'complaint-active': isActive }"
    @click.prevent="toggleActivate"
  >
    <div class="complaint-attribute">{{ index + 1 }}</div>
    <div class="complaint-attribute">{{ complaint.movement.n }}</div>
    <div class="complaint-attribute">{{ complaint.movement.label }}</div>
    <div class="complaint-attribute">
      <span v-for="(m, i) in complaint.measures" :key="m.id"><span v-if="i > 0">, </span>{{ m.label }}</span>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { mutations } from '@/store/names'

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
    }
  },
  methods: {
    toggleActivate () {
      if (this.complaintId === this.activeComplaintId) {
        this.$store.commit(mutations.ACTIVATE_COMPLAINT, null)
      } else {
        this.$store.commit(mutations.ACTIVATE_COMPLAINT, this.complaintId)
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
}

.complaint-active {
  background-color: yellow;
  outline: 1px solid red;
}

</style>
