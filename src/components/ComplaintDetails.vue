<template>
  <div class="complaint-details">
    <div class="divider"></div>
    Monitum in T.{{ activeComplaint.affects[0].measures.label }}
    <btn size="sm" @click="closeDetails">{{ $t('terms.close')}}</btn>
    <btn class="distanced" @click="displayComplaint">Vergleichsansicht öffnen</btn>
    <div v-if="hasCurrentItem">
      <strong>{{currentItem[0].desc}}</strong>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import n from '@/store/names'

export default {
  name: 'ComplaintDetails',
  computed: {
    ...mapGetters([n.getters.activeComplaintId, n.getters.activeComplaint, n.getters.currentItem, n.getters.hasCurrentItem])
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

  .divider {
    height: 1.5px;
    background-color: #999999;
    margin: .5rem 1rem;
  }

  .distanced {
    margin: 1rem;
  }

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
