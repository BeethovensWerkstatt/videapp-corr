<template>
    <div
      class="zone-component"
      :style="style"
      :class="{
        active: this.isActive,
        anno: this.hasAnno
      }"
      :title="zoneTitle"
      @click.prevent="activateZone"
    >
      <div class="zone-label" v-if="displayMeasures">
        {{ zoneLabel }}
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { actions } from '@/store/names'

/**
 * @module components/ZoneComponent
 * @vue-prop {String} sourceId - id of source object
 * @vue-prop {String} zoneId - id of measure zone
 * @vue-prop {Number} x - horizontal coordinate on page
 * @vue-prop {Number} y - vertical coordinate on page
 * @vue-prop {Number} width - width of measure zone
 * @vue-prop {Number} height - height of measure zone
 * @vue-computed {Number} scale - current scaling of viewer
 * @vue-computed {String} activeZoneId - active zone id for countaining source
 * @vue-computed {Object} style - styles for measure zone (percent size for page overlay)
 * @vue-computed {Boolean} isActive - zone is selected for corresponding source
 * @vue-computed {Boolean} hasAnno - annotation registered for measure zone
 * @vue-computed {String} zoneLabel - label/title for zone
 */
export default {
  name: 'ZoneComponent',
  props: {
    sourceId: {
      type: String,
      required: true
    },
    zoneId: {
      type: String,
      required: true
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  watch: {
    displayMeasures () {
    }
  },
  computed: {
    ...mapGetters(['scale', 'displayMeasures']),
    style () {
      return {
        position: 'absolute',
        left: (100 * this.x) + '%',
        top: (100 * this.y) + '%',
        width: (100 * this.width) + '%',
        height: (100 * this.height) + '%',
        'font-size': 'min(14pt,' + (100 * this.scale + '%') + ')'
      }
    },
    activeZoneId () {
      const src = this.$store.getters.getSourceById(this.sourceId)
      // console.log(src.activeZoneId)
      return src.activeZoneId
    },
    isActive () {
      return this.displayMeasures || (this.activeZoneId === this.zoneId)
    },
    hasAnno () {
      return this.label && this.label.length > 0
    },
    zone () {
      const zone = this.$store.getters.getZoneById(this.sourceId, this.zoneId)
      return zone
    },
    label () {
      const zone = this.zone
      if (zone) {
        return zone.label
      }
      return null
    },
    zoneNr () {
      const zone = this.zone
      if (zone) {
        return zone.measure
      }
      return null
    },
    zoneTitle () {
      const zone = this.zone
      if (zone) {
        return zone.title
      }
      return null
    },
    zoneLabel () {
      return this.hasAnno ? this.label : ('' + this.zoneNr)
    }
  },
  methods: {
    /**
     * activate zone
     */
    activateZone (e) {
      this.$store.dispatch(actions.activateZone, { source: this.sourceId, zone: this.zoneId })
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/scss/variables.scss";

.zone-component {
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
.zone-label {
  position: absolute;
  top: 50%;
  width: 100%;
  margin: 0%;
  text-align: center;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  background-color: rgba($color: #ffffff, $alpha: .5);
}
</style>
