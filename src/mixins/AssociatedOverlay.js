const required = ['updateView', 'startUpdate', 'finishUpdate']

/**
 * Mixin for OpenSeadragon Overlay Components.<br>
 * Needs functions `updateView`, `startUpdate`, `finishUpdate` in the Vue component
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
    required.forEach(func => {
      if (typeof this[func] !== 'function') {
        console.error('"' + func + '" (' + (typeof this[func]) + ')')
      }
    })
  }
}
