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
    }
  }
}
