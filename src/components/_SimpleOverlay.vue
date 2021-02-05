<template>
    <div :class="cls" :id="id">{{ content}}</div>
</template>

<script>
import OpenSeadragon from 'openseadragon'
import { AssociatedOverlay } from '@/mixins/AssociatedOverlay'

/**
 * Simple Overlay component
 *
 * @module components/SimpleOverlay
 */
export default {
  name: 'SimpleOverlay',
  mixins: [AssociatedOverlay],
  data () {
    return {
      position: new OpenSeadragon.Point(this.x, this.y)
    }
  },
  props () {
    return {
      id: {
        type: String,
        required: true
      },
      cls: {
        type: Object,
        default: { marker: true }
      },
      content: {
        default: 'X'
      }
    }
  },
  mounted () {
    this.createOverlay()
    if (this.container) {
      this.container.addOverlay(this)
    }
  },
  computed: {
    '$store' () {
      return this.container.$store
    },
    overlay () {
      return this.viewer.getOverlayById(this.id)
    },
    overlayType () {
      return 'simple'
    }
  },
  methods: {
    create () {
      this.viewer.addOverlay(this.$el, this.position)
    },
    destroy () {
      const ovl = this.overlay
      if (ovl) {
        ovl.destroy()
      }
    },
    updateView (position) {
      const ovl = this.overlay
      this.position.x = position.x
      this.position.y = position.y
      if (ovl) {
        ovl.update(this.position)
      }
    },
    startUpdate () {
    },
    finishUpdate () {
    }
  }
}
</script>

<style scoped>
.marker {
  font-weight: bold;
  color: red;
  width: 20px;
  text-align: center;
}
</style>
