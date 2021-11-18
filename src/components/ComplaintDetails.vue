<template>
  <div class="complaint-details">
    <div v-if="hasCurrentItem">
      <strong>{{currentItemDesc}}</strong>
    </div>
    <div class="divider"></div>
    Monitum in T.{{ activeComplaint.affects[0].measures.label }}
    <btn size="sm" @click="closeDetails">{{ $t('terms.close')}}</btn>
    <btn class="distanced" @click="displayComplaint">Vergleichsansicht öffnen</btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import n from '@/store/names'

export default {
  name: 'ComplaintDetails',
  computed: {
    ...mapGetters([n.getters.activeComplaintId, n.getters.activeComplaint, n.getters.hasCurrentItem]),
    currentItem () {
      const currentItems = this.$store.getters[n.getters.currentItem]
      return currentItems[0]
    },
    currentItemDesc () {
      const currentItems = this.$store.getters[n.getters.currentItem]
      if (currentItems.length > 0 && currentItems[0].desc) {
        return currentItems[0].desc
      } else {
        return '–'
      }
    }
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
