<template>
  <div
    class="document-margin"
    :id="divid"
  >
    <div class="left-margin" :style="{ width: marginPerc + '%' }">
      <div class="marker" :style="{ height: '24%', top: '0%' }">1</div>
      <div class="marker" :style="{ height: '24%', top: '25%' }">2</div>
    </div>
    <div class="right-margin" :style="{ width: marginPerc + '%' }">
      <div class="marker" :style="{ height: '24%', top: '50%' }">3</div>
      <div class="marker" :style="{ height: '24%', top: '75%' }">4</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'

export default {
  name: 'DocumentMarginComponent',
  props: {
    sourceId: {
      type: String,
      required: true
    },
    position: {
      type: Object,
      required: true
    }
  },
  mounted () {
    // create overlay for margin bars
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
    ...mapGetters(['viewer', 'sourceHeaderHeight', 'sourceMarginWidth']),
    divid () {
      return this.sourceId + '_margin'
    },
    overlay () {
      return this.viewer ? this.viewer.getOverlayById(this.divid) : null
    },
    marginPerc () {
      return (100 * this.sourceMarginWidth / this.position.width)
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
.document-margin {
  position: relative;

  .left-margin {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    // TODO color consts in separate file
    // background: linear-gradient(270deg, #dddddd, #ffffff);
  }
  .right-margin {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    // TODO color consts in separate file
    // background: linear-gradient(90deg, #dddddd, #ffffff);
  }

  .marker {
    position: absolute;
    left: 5%;
    width: 90%;
    background-color: rgba(255, 255, 181, 0.164);
    border-radius: 3px;
    outline: 1px solid rgba(255, 166, 0, 0.349);

    &:hover {
      outline: 1px solid orange;
      background-color: rgba(255, 255, 181, 0.685);
    }
  }
}
</style>
