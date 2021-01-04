// required elements for components using AssociatedOverlay mixin
const required = {
  function: ['updateView', 'startUpdate', 'finishUpdate', 'destroy'],
  string: ['overlayType'],
  object: ['$store']
}

/**
 * Mixin for OpenSeadragon Overlay Components.<br>
 * Needs functions `updateView`, `startUpdate`, `finishUpdate` and
 * `$store`,`overlayType` properties in the Vue component. This component is likely
 * created dynamically. In that case you have to provide a computed
 * property of that name:
 * @example <caption>define `$store` for dynamic vue component</caption>
 * '$store' () {
 *   return this.container.$store
 * }
 *
 * @memberof mixins
 * @vue-prop {Object} container - associated element for this Overlay
 * @vue-computed {Viewer} viewer - OpenSeadragon Viewer
 * @vue-computed {DesktopComponent} desktop - Desktop Component
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
    viewer () {
      return this.$store.getters.viewer
    },
    desktop () {
      return this.$store.getters.desktop
    }

  }
}
