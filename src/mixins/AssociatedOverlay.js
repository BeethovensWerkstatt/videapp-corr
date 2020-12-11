/**
 * Mixin for OpenSeadragon Overlay Components
 * @memberof mixins
 * @vue-prop {Object} container - associated element for this Overlay
 */
export const AssociatedOverlay = {
  props: {
    container: {
      type: Object,
      required: true
    }
  },
  mounted () {
    // console.log(this.updateView)
  }
}
