<template>
    <div
      :id="divid"
      :style="styles()"
    >
      <div
        v-for="(item, zone) in page.measures"
        :key="zone.zone"
        :style="styleForZone(zone)"
      />
    </div>
</template>

<script>
/**
 * @vue-prop {object} source - source object
 * @vue-prop {SourceFacsimile} SF - SourceFacsimile component
 */
export default {
  name: 'SourceOverlay',
  data: function () {
    return {}
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
        border: '1px solid red'
      }
    },
    styleForZone (zone) {
      return {
        position: 'absolute',
        left: (zone.x * this.scaleFactor) + 'px',
        right: (zone.y * this.scaleFactor) + 'px',
        width: zone.width + 'px',
        height: zone.height + 'px',
        border: '1px solid green'
      }
    }
  }
}
</script>

<style scoped>

</style>
