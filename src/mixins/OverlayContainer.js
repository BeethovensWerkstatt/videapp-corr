/**
 * Container for AssociatedOverlay objects
 * @memberof mixins
 * @vue-data {Object[]} overlays - list of overlay objects
 */
export const OverlayContainer = {
  data () {
    return {
      overlays: []
    }
  },
  methods: {
    /**
     * add overlay to container
     * @param {Object} overlay
     */
    addOverlay (overlay) {
      this.overlays = [...this.overlays.filter(ovl => ovl !== overlay), overlay]
    },
    /**
     * remove overlay from container
     * @param {Object} overlay
     */
    remOverlay (overlay) {
      this.overlays = [...this.overlays.filter(ovl => ovl !== overlay)]
    },
    /**
     * update all registered overlays
     *
     * @param {object} position - new position of container
     */
    updateOverlays (position) {
      this.overlays.forEach(function (ovl) {
        ovl.updateView((typeof position === 'function') ? position(ovl) : position)
      })
    },
    /**
     * start updating all overlays (for drag and drop)
     */
    startUpdateOverlays () {
      this.overlays.forEach(function (ovl) {
        ovl.startUpdate()
      })
    },
    /**
     * finish updating all overlays (for drag and drop)
     *
     * @param {object} position - new position of container
     */
    finishUpdateOverlays (position) {
      this.overlays.forEach(function (ovl) {
        ovl.finishUpdate((typeof position === 'function') ? position(ovl) : position)
      })
    }
  }
}
