<template>
  <div>
    <strong>Source Information</strong>
    <div>{{ title }}</div>
    <div>
        <table>
            <tr><td>Anzahl Seiten:</td><td>{{ pagecount }}</td></tr>
        </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SourceInfo',
  computed: {
    source () {
      const current = this.$store.state.sources.find((source) => {
        return source.id === this.$store.state.activeSourceId
      })
      if (current) {
        return current
      }
      return null
    },
    title () {
      if (this.source) {
        return this.source.label
      }
      return 'N/A'
    },
    pagecount () {
      if (this.source) {
        return this.source.pages.length
      }
      return 0
    }
  }
}
</script>
