<template>
    <div class="measure-ovl" :title="zone.zone" @click.prevent="activateZone" />
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
    // console.log(this.SF.getPageX(this.page) + ', ' + this.SF.getPageY(this.page))
    // console.log(this.getZonePos())
    const pos = this.getZonePos()
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
    overlay () {
      return this.viewer.getOverlayById(this.divid)
    },
    scaleFactor () {
      return parseInt(this.page.dimensions.width) / parseInt(this.page.pixels.width)
    }
  },
  methods: {
    updatePos () {
      const ovl = this.overlay
      if (ovl) {
        ovl.update(this.getZonePos(), OpenSeadragon.TOP_LEFT)
      }
    },
    getZonePos () {
      const zonepos = new OpenSeadragon.Rect(10, 10, 10, 10)
      zonepos.x = (parseInt(this.zone.x) * this.scaleFactor) + parseInt(this.SF.getPageX(this.page))
      zonepos.y = (parseInt(this.zone.y) * this.scaleFactor) + parseInt(this.SF.getPageY(this.page))
      zonepos.width = parseInt(this.zone.width) * this.scaleFactor
      zonepos.height = parseInt(this.zone.height) * this.scaleFactor
      return zonepos
    },
    activateZone () {
      this.SF.selectSource()
      this.SF.$store.commit('ACTIVATE_ZONE', this.zone.id)
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/scss/variables.scss";

.measure-ovl {
  width: 3rem;
  height: 1rem;
  border: .5px solid $border-color;
  // border-radius: 5px;
  // box-shadow: 0 0 .5rem #00000099;
  opacity: 0.2;

  &:hover {
    opacity: 1;
  }

  &.active {
    background-color: rgba($color: #ffffff, $alpha: .5);
  }
}
</style>
