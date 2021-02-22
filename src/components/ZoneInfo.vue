<template>
  <div class="zone-info">
    <strong>Measure Information</strong>
    <div>
      <label for="toggleDisplayMeasures">Takte anzeigen </label>
      <input
        id="toggleDisplayMeasures"
        type="checkbox"
        v-model="displayMeasures"
      />
    </div>
    <div v-if="activeZone">
      <div class="smaller" :title="activeZone.zone">{{ activeZone.measure }}</div>
      <input v-model="activeZone.label" />
      <btn-group>
        <btn @click.prevent="clearInfo">close</btn>
      </btn-group>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mutations, actions } from '@/store/names'

/**
 * Zone information widget
 *
 * @module components/ZoneInfo
 */
export default {
  name: 'ZoneInfo',
  computed: {
    ...mapGetters(['activeZone']),
    displayMeasures: {
      get () {
        const displayMeasures = this.$store.getters.displayMeasures
        // console.log('display: ' + displayMeasures)
        return displayMeasures
      },
      set (val) {
        this.$store.commit(mutations.SET_DISPLAY_MEASURES, val)
      }
    }
  },
  methods: {
    /**
     * clears information widget
     */
    clearInfo () {
      this.$store.dispatch(actions.activateZone, { source: this.$store.getters.activeSourceId, zone: null })
    }
  }
}
</script>

<style scoped>
.zone-info {
  padding: 0p;
  text-align: left;
}
.smaller {
  font-size: 80%;
}
</style>
