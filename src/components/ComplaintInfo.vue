<template>
  <div>
    <div id="monitaBtn" @click="openComplaints">
      <i class="icon icon-menu"></i>
        {{ $t('terms.openComplaintsList') }}

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
   #monitaBtn {
      text-align: left;
      cursor: pointer;
      i {
         position: relative;
         top: -2px;
         margin-right: .2rem;
      }
   }
</style>
