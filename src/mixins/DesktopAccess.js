/**
 * @memberof mixins
 * @vue-computed {Viewer} viewer - OpenSeadragon Viewer
 * @vue-computed {DesktopComponent} desktop - Desktop Component
 */
export const DesktopAccess = {
  computed: {
    viewer () {
      return this.$store.getters.viewer
    },
    desktop () {
      return this.$store.getters.desktop
    }
  }
}
