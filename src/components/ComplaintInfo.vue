<template>
  <div>
    <div>
      <btn @click="openComplaints" size="sm">
        {{ $t('terms.openComplaintsList') }}
      </btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import n from '@/store/names'

export default {
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
