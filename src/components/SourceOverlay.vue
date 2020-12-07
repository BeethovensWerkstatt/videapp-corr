<template>
    <div
      :style="styles()"
    >
      Hallo
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
  },
  methods: {
    styles () {
      console.log(this.SF.getPageX(this.page))
      return {
        position: 'absolute',
        left: this.SF.getPageX(this.page) + 'px',
        top: this.SF.getPageY(this.page) + 'px',
        width: 50 + 'px',
        height: 50 + 'px',
        border: '1px solid red'
      }
    }
  }
}
</script>

<style scoped>

</style>
