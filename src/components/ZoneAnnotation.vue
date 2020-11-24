<template>
  <div>
    <strong>Edit Annotation</strong>
    <div>{{ title }}</div>
  </div>
</template>

<script>
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
