<template>
    <div class="zone-component" :style="style" @click.prevent="activateZone">
      <div class="zone-label">
        {{ zoneLabel }}
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

/**
 * @module components/ZoneComponent
 * @vue-prop {number} x - horizontal coordinate on page
 * @vue-prop {number} y - vertical coordinate on page
 * @vue-prop {number} width - width of measure zone
 * @vue-prop {number} height - height of measure zone
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
  computed: {
    ...mapGetters(['scale']),
    style () {
      return {
        position: 'absolute',
        left: (100 * this.x) + '%',
        top: (100 * this.y) + '%',
        width: (100 * this.width) + '%',
        height: (100 * this.height) + '%',
        'font-size': (100 * this.scale + '%')
      }
    },
    zoneLabel () {
      return 'zone'
    }
  },
  methods: {
    activateZone (e) {
      this.$store.dispatch('activateZone', { source: this.sourceId, zone: this.zoneId })
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
