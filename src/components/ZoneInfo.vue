<template>
  <div class="zone-info">
    <strong>Measure Information</strong>
    <div v-if="activeZone">
      <div class="smaller">{{ activeZone.zone }}</div>
      <input v-model="activeZone.label" />
      <btn-group>
        <btn @click.prevent="clearInfo">close</btn>
      </btn-group>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

/**
 * Zone information widget
 *
 * @module components/ZoneInfo
 */
export default {
  name: 'ZoneInfo',
  computed: {
    ...mapGetters(['activeZone'])
  },
  methods: {
    /**
     * clears information widget
     */
    clearInfo () {
      this.$store.dispatch('activateZone', {})
    },
    // TODO test
    destroyZone () {
      if (this.ovl_zone) {
        this.ovl_zone.destroyZone()
      }
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
