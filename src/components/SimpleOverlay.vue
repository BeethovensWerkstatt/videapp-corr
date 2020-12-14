<template>
    <div :class="cls">{{ content}}</div>
</template>

<script>
import OpenSeadragon from 'openseadragon'
import AssociatedOverlay from '@/mixins'

/**
 * Simple Overlay component
 *
 * @module components.SimpleOverlay
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
      viewer: {
        type: OpenSeadragon.Viewer,
        required: true
      },
      id: {
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
      cls: {
        type: Object,
        default: { marker: true }
      },
      content: {
        default: 'X'
      },
      register: {
        type: Function,
        default: null
      }
    }
  },
  mounted () {
    this.createOverlay()
    if (this.register) {
      this.register(this)
    }
  },
  computed: {
    overlay () {
      return this.viewer.getOverlayById(this.id)
    }
  },
  methods: {
    createOverlay () {
      this.viewer.addOverlay(this.$el, this.position)
    },
    destroyOverlay () {
      const ovl = this.overlay
      if (ovl) {
        ovl.destroy()
      }
    },
    updateView () {
      const ovl = this.overlay
      if (ovl) {
        ovl.update(this.position)
      }
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
