<template>
    <div
      :id="divid"
      :style="styles()"
    >
      <zone-overlay
        v-for="(zone) in page.measures"
        :key="zone.zone"
        :source="source"
        :SF="SF"
        :page="page"
        :zone="zone"
        :style="styleForZone(zone)"
      />
    </div>
</template>

<script>
import ZoneOverlay from '@/components/ZoneOverlay'

/**
 * @vue-prop {object} source - source object
 * @vue-prop {SourceFacsimile} SF - SourceFacsimile component
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
    SF: {
      required: true
    },
    page: {
      type: Object,
      required: true
    }
  },
  computed: {
    viewer () {
      return this.SF.viewer
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
      // console.log(this.SF.getPageX(this.page))
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
