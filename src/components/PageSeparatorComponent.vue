<template>
  <div class="separator" :id="divid">&nbsp;</div>
</template>

<script>
import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'
import { Url } from '@/toolbox/net'

export default {
  name: 'PageSeparatorComponent',
  mounted () {
    if (this.viewer) {
      this.viewer.addOverlay({
        element: this.$el,
        location: this.position
      }, this.position, OpenSeadragon.TOP_CENTER)
      // this.viewer.addHandler('zoom', this.doResize)
    }
  },
  beforeDestroy () {
    this.viewer.removeOverlay(this.$el)
  },
  props: {
    position: {
      type: Object,
      required: true
    },
    sourceId: {
      type: String,
      required: true
    }
  },
  watch: {
    position () {
      if (this.overlay) {
        this.overlay.update(this.position)
      }
    }
  },
  computed: {
    ...mapGetters(['viewer']),
    divid () {
      const atId = new Url(this.sourceId)
      let id = atId.path.elements.pop()
      id = id.split('.').filter(e => e !== 'json').join('_')
      // console.log(id)
      return id + '_separator'
    },
    overlay () {
      return this.viewer ? this.viewer.getOverlayById(this.divid) : null
    }
  }
}
</script>

<style lang="scss" scoped>

.separator {
  padding: 0%;
  margin: 0%;
  background: linear-gradient(270deg, #dddddd, #ffffff);
}

</style>
