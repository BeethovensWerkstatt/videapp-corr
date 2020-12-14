<template>
    <div
      :id="divid"
      :style="styles()"
    >
      <zone-overlay
        v-for="(zone) in page.measures"
        :key="zone.zone"
        :source="source"
        :container="SrcCmp"
        :page="page"
        :zone="zone"
        :style="styleForZone(zone)"
      />
    </div>
</template>

<script>
import ZoneOverlay from '@/components/ZoneOverlay'

/**
 * @module components.SourceOverlay
 * @vue-prop {object} source - source object
 * @vue-prop {SourceFacsimile} SrcCmp - SourceFacsimile component
 * @vue-prop {object} page - page object
 */
export default {
  name: 'SourceOverlay',
  components: {
    ZoneOverlay
  },
  data: function () {
    return {}
  },
  mounted () {
  },
  props: {
    source: {
      type: Object,
      required: true
    },
    SrcCmp: {
      required: true
    },
    page: {
      type: Object,
      required: true
    }
  },
  computed: {
    viewer () {
      return this.SrcCmp.viewer
    },
    divid () {
      return 'ovl_' + this.source.id
    },
    scaleFactor () {
      return parseInt(this.page.dimensions.width) / parseInt(this.page.pixels.width)
    }
  },
  methods: {
    styles () {
      // console.log(this.SrcCmp.getPageX(this.page))
      return {
      }
    },
    styleForZone (zone) {
      return {
        border: '1px solid green'
      }
    }
  }
}
</script>

<style scoped>

</style>
