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
export default {
  name: 'ZoneInfo',
  computed: {
  },
  methods: {
    activeZone () {
      return this.$store.getters.activeZone()
    },
    clearInfo () {
      this.$store.commit('ACTIVATE_ZONE', null)
    },
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
