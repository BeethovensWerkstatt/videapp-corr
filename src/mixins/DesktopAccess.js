/**
 * add local access to OpenSeadragon viewer and DesktopComponent
 * @memberof mixins
 * @vue-computed {Viewer} viewer - OpenSeadragon Viewer
 * @vue-computed {DesktopComponent} desktop - Desktop Component
 */
export const DesktopAccess = {
  mounted () {
    if (!this.$store) {
      console.error('$store is undefined')
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
