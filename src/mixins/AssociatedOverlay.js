const required = {
  function: ['updateView', 'startUpdate', 'finishUpdate'],
  string: ['overlayType']
}

/**
 * Mixin for OpenSeadragon Overlay Components.<br>
 * Needs functions `updateView`, `startUpdate`, `finishUpdate` and
 * `$store` property in the Vue component. This component is likely
 * created dynamically. In that case you have to provide a computed
 * property of that name:
 * @example
 * '$store' () {
 *   return this.container.$store
 * }
 *
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
    for (var type in required) {
      required[type].forEach(elem => {
        const t = typeof this[elem]
        if (t !== type) {
          console.error('missing ' + type + ' "' + elem + '" (' + (typeof this[elem]) + ')')
        }
      })
    }
  },
  computed: {

  }
}
