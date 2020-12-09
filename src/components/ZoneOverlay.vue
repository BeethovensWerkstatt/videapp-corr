<template>
    <div class="measure" :title="zone.zone" @click="activateZone" />
</template>

<script>
import OpenSeadragon from 'openseadragon'

/**
 * @vue-prop {object} source - source object
 * @vue-prop {SourceFacsimile} SF - SourceFacsimile component
 * @vue-prop {object} page - page object
 * @vue-prop {object} zone - measure zone
 */
export default {
  name: 'ZoneOverlay',
  data: function () {
    return {}
  },
  mounted () {
    // this.getZonePos()
    const pos = new OpenSeadragon.Rect(this.zone.x, this.zone.y, 10, 10)
    this.viewer.addOverlay(this.$el, pos)
  },
  props: {
    source: {
      type: Object,
      required: true
    },
    SF: {
      required: true
    },
    page: {
      type: Object,
      required: true
    },
    zone: {
      type: Object,
      required: true
    }
  },
  computed: {
    viewer () {
      return this.SF.viewer
    },
    divid () {
      return 'ovl_' + this.zone.zone
    },
    scaleFactor () {
      return parseInt(this.page.dimensions.width) / parseInt(this.page.pixels.width)
    }
  },
  methods: {
    getZonePos () {
      const zonepos = new OpenSeadragon.Rect(10, 10, 10, 10)
      zonepos.x = (parseInt(this.zone.x) * this.scaleFactor) + parseInt(this.SF.getPageX(this.page))
      zonepos.y = (parseInt(this.zone.y) * this.scaleFactor) + parseInt(this.SF.getPageY(this.page))
      zonepos.width = parseInt(this.zone.width) * this.scaleFactor
      zonepos.height = parseInt(this.zone.height) * this.scaleFactor
      return zonepos
    },
    activateZone () {
      this.SF.openSourceInfo()
      this.SF.$store.commit('ACTIVATE_ZONE', this)
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/scss/variables.scss";

.measure {
  width: 3rem;
  height: 1rem;
  border: .5px solid $border-color;
  border-radius: 5px;
  box-shadow: 0 0 .5rem #00000099;
  opacity: 0;

  &:hover {
    opacity: 1;
  }

  &.active {
    background-color: rgba($color: #ffffff, $alpha: .5);
  }
}

</style>
