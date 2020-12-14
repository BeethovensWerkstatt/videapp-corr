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
 * @module components.ZoneOverlay
 * @vue-prop {Object} source - source object
 * @vue-prop {SourceComponent} container - SourceComponent component
 * @vue-prop {Object} page - page object
 * @vue-prop {Object} zone - measure zone
 * @vue-computed {Object} $store - this component is created dynamically, so $store has to be retrieved from container
 * @vue-computed {Object} viewer - OpenSeadragon viewer
 * @vue-computed {String} divid - ID of div overlay tag
 * @vue-computed {String} divtitle - title attribute of div overlay tag
 * @vue-computed {Object} overlay - OpenSeadragon overlay object
 * @vue-computed {Number} scaleFactor - ratio of dimension and pixel width
 * @vue-computed {Boolean} isActive - `true` if zone is selected
 * @vue-computed {Boolean} hasLabel - `true` if `label` property is not empty
 * @vue-computed {Number} zoneposX - X coordinate of overlay on desktop
 * @vue-computed {Number} zoneposY - Y coordinate of overlay on desktop
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
    // console.log(this.container.getPageX(this.page) + ', ' + this.container.getPageY(this.page))
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
      return this.container.$store
    },
    viewer () {
      return this.container.viewer
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
    overlayType () {
      return 'zone'
    },
    scaleFactor () {
      return parseInt(this.page.dimensions.width) / parseInt(this.page.pixels.width)
    },
    isActive () {
      return this.container.activeZone && this.container.activeZoneId === this.zone.zone
    },
    hasLabel () {
      return this.zone.label && this.zone.label.length > 0
    },
    zoneposX () {
      return (parseInt(this.zone.x) * this.scaleFactor)
    },
    zoneposY () {
      return (parseInt(this.zone.y) * this.scaleFactor)
    }
  },
  methods: {
    /**
     * update position of overlay if not updating (drag and drop)
     */
    updateView () {
      if (!this.updating && this.overlay) {
        this.overlay.update(this.getZonePos(), OpenSeadragon.TOP_LEFT)
      }
    },
    /**
     * start updating (drag and drop)
     */
    startUpdate () {
      this.updating = true
    },
    /**
     * finish updating (drag and drop)
     */
    finishUpdate () {
      this.updating = false
      this.updateView()
    },
    /**
     * get current position of overlay
     *
     * @returns {OpenSeadragon.Rect} position and size of overlay
     */
    getZonePos () {
      const zonepos = new OpenSeadragon.Rect(10, 10, 10, 10)
      zonepos.x = this.zoneposX + this.container.getPageX(this.page)
      zonepos.y = this.zoneposY + this.container.getPageY(this.page)
      zonepos.width = parseInt(this.zone.width) * this.scaleFactor
      zonepos.height = parseInt(this.zone.height) * this.scaleFactor
      // console.log(this.page.place)
      // console.log(zonepos)
      return zonepos
    },
    /**
     * select this zone
     */
    activateZone (e) {
      if (e) {
        e.preventDefault()
      }
      this.container.activeZoneId = this.zone.zone
      this.container.selectSource()
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
