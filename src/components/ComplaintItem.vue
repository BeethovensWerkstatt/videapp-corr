<template>
  <div
    :title="complaint.movement.id"
    class="complaint-item"
    :class="{ 'complaint-active': isActive }"
    @click.prevent="activate"
  >
    <div class="complaint-attribute">{{ complaint.movement.n }}</div>
    <div class="complaint-attribute">{{ complaint.movement.label }}</div>
  </div>
</template>

<script>

import { mutations } from '@/store/names'

export default {
  name: 'ComplaintItem',
  props: {
    complaint: {
      type: Object,
      required: true
    }
  },
  computed: {
    complaintId () {
      return this.complaint['@id']
    },
    isActive () {
      return this.$store.getters.activeComplaintId === this.complaintId
    }
  },
  methods: {
    activate () {
      this.$store.commit(mutations.ACTIVATE_COMPLAINT, this.complaintId)
    }
  }
}
</script>

<style scoped>

.complaint-item {
  display: table-row;
}

.complaint-attribute {
  display: table-cell;
  text-align: left;
  padding: 0px 1pt;
}

.complaint-active {
  background-color: rosybrown;
  border: 1px solid red;
}

</style>
