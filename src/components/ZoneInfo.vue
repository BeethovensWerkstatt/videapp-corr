<template>
  <div class="zone-info">
    <strong>Measure Information</strong>
    <div v-if="activeZone()">
      <div class="smaller">{{ activeZone().zone }}</div>
      <input v-model="activeZone().label" />
      <btn-group>
        <btn @click.prevent="clearInfo">close</btn>
      </btn-group>
    </div>
  </div>
</template>

<script>
/**
 * Zone information widget
 *
 * @module components/ZoneInfo
 */
export default {
  name: 'ZoneInfo',
  computed: {
  },
  methods: {
    /**
     * @returns {object} selected zone
     */
    activeZone () {
      return this.$store.getters.activeZone()
    },
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
