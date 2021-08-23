<template>
  <div
    class="document-header"
    :id="divid"
  >
    <div class="top-left" :style="{ width: marginPerc + '%' }">
    </div>
    <div
      id="draghandle"
      class="top-title"
      :style="{ left: marginPerc + '%', width: titlePerc + '%' }"
    >
    </div>
    <div class="top-right" :style="{ width: marginPerc + '%' }">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'

/**
 * @module components/DocumentHeaderComponent
 * @vue-prop {Number} marginWidth width of margins
 * @vue-prop {Number} height height of title bar
 * @vue-prop {String} sourceId id of source object
 */
export default {
  name: 'DocumentHeaderComponent',
  props: {
    position: {
      type: Object,
      required: true
    },
    marginWidth: {
      type: Number,
      required: true
    },
    sourceId: {
      type: String,
      required: true
    }
  },
  mounted () {
    if (this.viewer) {
      this.viewer.addOverlay({
        element: this.$el,
        location: this.position
      }, this.position, OpenSeadragon.TOP_CENTER)
    }
  },
  watch: {
    position () {
      this.updatePosition()
    }
  },
  computed: {
    ...mapGetters(['viewer']),
    divid () {
      return this.sourceId + '_header'
    },
    overlay () {
      return this.viewer ? this.viewer.getOverlayById(this.divid) : null
    },
    marginPerc () {
      return (100 * this.marginWidth / this.position.width)
    },
    titlePerc () {
      return 100 - (2 * this.marginPerc)
    },
    dragHandle () {
      return this.$el.querySelector('#draghandle')
    }
  },
  methods: {
    updatePosition () {
      if (this.overlay) {
        this.overlay.update(this.position)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.document-header {
  outline: 1px solid red;
  .top-left {
    position: absolute;
    left: 0;
    height: 100%;
    background-color: green;
  }
  .top-right {
    position: absolute;
    right: 0;
    height: 100%;
    background-color: red;
  }
  .top-title {
    position: absolute;
    height: 100%;
    background-color: yellow;
  }
}
</style>
