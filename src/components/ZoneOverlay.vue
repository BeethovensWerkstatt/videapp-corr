<template>
    <div class="measure" />
</template>

<script>
/**
 * @vue-prop {object} source - source object
 * @vue-prop {SourceFacsimile} SF - SourceFacsimile component
 * @vue-prop {object} page - page object
 * @vue-prop {object} zone - measure zone
 */
export default {
  name: 'ZoneOverlay',
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
    },
    zone: {
      type: Object,
      required: true
    }
  },
  computed: {
    divid () {
      return 'ovl_' + this.zone.zone
    },
    scaleFactor () {
      return parseInt(this.page.dimensions.width) / parseInt(this.page.pixels.width)
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/scss/variables.scss";

.measure {
  width: 3rem;
  height: 1rem;
  border: .5px solid $border-color;
  border-radius: 5px;
  box-shadow: 0 0 .5rem #00000099;
  opacity: 0;

  &:hover {
    opacity: 1;
  }

  &.active {
    background-color: rgba($color: #ffffff, $alpha: .5);
  }
}

</style>
