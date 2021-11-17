<template>
  <div>
    <div>
      <btn @click="openComplaints" size="sm">
        {{ $t('terms.complaints') }}
      </btn>
    </div>
    <complaint-details v-if="activeComplaint" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import n from '@/store/names'
import ComplaintDetails from './ComplaintDetails.vue'

export default {
  components: { ComplaintDetails },
  name: 'ComplaintInfo',
  computed: {
    ...mapGetters([n.getters.activeComplaintId, n.getters.activeComplaint])
  },
  methods: {
    openComplaints () {
      this.$store.commit(n.mutations.COMPLAINTS_LIST, true)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
