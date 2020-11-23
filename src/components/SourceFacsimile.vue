<template>
  <div class="sourceBack" :id="this.divid">
    <label>{{ this.label }}</label>
  </div>
</template>

<script>
export default {
  name: 'SourceFacsimile',
  props: {
    source: {
      type: Object,
      default: () => { return {} }
    }
  },
  computed: {
    divid () {
      return this.source.id + '_back'
    },
    label () {
      return this.source.label
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
