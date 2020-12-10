<template>
  <div class="zone-info">
    <strong>Measure Information</strong>
    <div v-if="ovl_zone">
      <div class="smaller">{{ ovl_zone.divid }}</div>
      <input v-model="ovl_zone.zone.label" />
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
    ovl_zone () {
      return this.$store.getters.activeZone
    }
  },
  methods: {
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
  padding: 8pt;
  text-align: left;
}
.smaller {
  font-size: 80%;
}
</style>
