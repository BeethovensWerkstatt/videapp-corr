<template>
    <div
      :id="divid"
      class="measure-ovl"
      :title="divtitle"
      @click.prevent="activateZone"
      :class="{ active: this.isActive, anno: hasLabel, hide: updating }"
    >
    {{ (this.zone.label.length > 0) ? '&bullet;' : '' }}
    </div>
</template>

<script>
import OpenSeadragon from 'openseadragon'
import { AssociatedOverlay } from '@/mixins/AssociatedOverlay'

/**
 * @vue-prop {object} source - source object
 * @vue-prop {SourceFacsimile} SF - SourceFacsimile component
 * @vue-prop {object} page - page object
 * @vue-prop {object} zone - measure zone
 */
export default {
  name: 'ZoneOverlay',
  mixins: [AssociatedOverlay],
  data: function () {
    return {
      updating: false
    }
  },
  mounted () {
    // console.log(this.SF.getPageX(this.page) + ', ' + this.SF.getPageY(this.page))
    // console.log(this.getZonePos())
    const pos = this.getZonePos()
    this.viewer.addOverlay(this.$el, pos)
    this.zone.component = this
    this.zone.overlay = this.viewer.getOverlayById(this.divid)
    // console.log(this.container)
    this.container.addOverlay(this)
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
    '$store' () {
      return this.SF.$store
    },
    viewer () {
      return this.SF.viewer
    },
    divid () {
      return 'ovl_' + this.zone.zone
    },
    divtitle () {
      if (this.zone.label) {
        return this.zone.label
      }
      return this.zone.zone
    },
    overlay () {
      return this.viewer.getOverlayById(this.divid)
    },
    scaleFactor () {
      return parseInt(this.page.dimensions.width) / parseInt(this.page.pixels.width)
    },
    isActive () {
      return this.SF.$store.getters.activeZone() && this.SF.$store.getters.activeZone().component === this
    },
    hasLabel () {
      return this.zone.label && this.zone.label.length > 0
    }
  },
  methods: {
    updateView (force = false) {
      if ((force || !this.updating) && this.overlay) {
        this.overlay.update(this.getZonePos(), OpenSeadragon.TOP_LEFT)
      }
    },
    startUpdate () {
      this.updating = true
    },
    finishUpdate () {
      this.updateView(true)
      this.updating = false
    },
    getZonePos () {
      const zonepos = new OpenSeadragon.Rect(10, 10, 10, 10)
      zonepos.x = (parseInt(this.zone.x) * this.scaleFactor) + parseInt(this.SF.getPageX(this.page))
      zonepos.y = (parseInt(this.zone.y) * this.scaleFactor) + parseInt(this.SF.getPageY(this.page))
      zonepos.width = parseInt(this.zone.width) * this.scaleFactor
      zonepos.height = parseInt(this.zone.height) * this.scaleFactor
      return zonepos
    },
    activateZone (e) {
      if (e) {
        e.preventDefault()
      }
      this.SF.selectSource()
      this.SF.$store.commit('ACTIVATE_ZONE', this.zone.zone)
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
  opacity: 0;

  &.active {
    opacity: .5;
    background-color: rgba($color: #ffffff, $alpha: .5);
  }

  &.anno {
    opacity: .5;
    border: .5px solid blue !important;
    border-radius: 3px;
  }

  &:hover {
    opacity: 1;
    box-shadow: 0 0 .5rem #00000099;
  }

  &.hide {
    display: none
  }
}
</style>
