<template>
  <div id="osd-canvas"></div>
</template>

<script>
import OpenSeadragon from 'openseadragon'

export default {
  name: 'OpenSeadragon',
  data: () => {
    return {}
  },
  methods: {
    init () {
      const viewer = OpenSeadragon({
        id: 'osd-canvas',
        prefixUrl: 'images/',
        tileSources: [],
        sequenceMode: false,
        animationTime: 1.5,
        showReferenceStrip: true,
        showRotationControl: true,
        // showNavigator: true,
        // navigatorRotate: false,
        // navigatorId: "navigator",
        showFullPageControl: false,
        zoomInButton: 'zoomIn',
        zoomOutButton: 'zoomOut',
        homeButton: 'desktopOverview',
        // rotateLeftButton: containerID + '_rotateLeft',
        // rotateRightButton: containerID + '_rotateRight',
        // toolbar: 'desktopToolbar',
        pixelsPerWheelLine: 60,
        // Enable touch rotation on tactile devices
        gestureSettingsTouch: {
          pinchRotate: true
        },
        gestureSettingsMouse: {
          clickToZoom: false,
          dblClickToZoom: true
        },
        collectionMode: false
      })
      // viewer -> store ... proxy?
      this.$store.commit('SET_VIEWER', viewer)
      this.$store.commit('SET_OSD', this)
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    viewer () {
      return this.$store.getters.viewer
    }
  }
}
</script>

<style scoped>
#osd-canvas {
  width: 100%;
  height: 800px;
}
</style>
