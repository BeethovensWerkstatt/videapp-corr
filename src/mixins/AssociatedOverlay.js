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
    if (!this.update) {
      throw new Error('"update" not implemented')
    }
  }
}
