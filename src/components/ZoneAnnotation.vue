<template>
  <div>
    <strong>Edit Annotation</strong>
    <div>{{ title }}</div>
  </div>
</template>

<script>
/**
 * This component will serve measure annotations. (to be developed)
 *
 * @vue-computed {String} title
 */
export default {
  computed: {
    title () {
      const current = this.$store.state.sources.find((source) => { return source.id === this.$store.state.activeSourceId })
      if (current) {
        return current.label
      }
      return 'N/A'
    }
  }
}
</script>
