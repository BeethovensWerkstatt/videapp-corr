<template>
  <div class="complaint-details">
    <hr />
    <h3>{{ activeComplaint.affects[0].measures.label }}<div class="close" @click="closeDetails">x</div></h3>
    <btn @click="displayComplaint">
      {{ $t('terms.open') }}
    </btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import n from '@/store/names'

export default {
  name: 'ComplaintDetails',
  computed: {
    ...mapGetters([n.getters.activeComplaintId, n.getters.activeComplaint])
  },
  methods: {
    displayComplaint () {
      this.$store.commit(n.mutations.DISPLAY_COMPLAINT, true)
    },
    closeDetails () {
      this.$store.commit(n.mutations.ACTIVATE_COMPLAINT, null)
    }
  }
}
</script>

<style lang="scss" scoped>
.complaint-details {
  position: relative;
  h3 {
    div.close {
      display: inline-block;
      font-size: 8pt;
      position: absolute;
      right: 3pt;
      cursor: pointer;

      &:hover {
        background-color: bisque;
      }
    }
  }
}
</style>
