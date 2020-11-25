<template>
  <div>
    <strong>Source Information</strong>
    <div>{{ title }}</div>
    <div>
        <table>
            <tr><td>Anzahl Seiten:</td><td>{{ pagecount }}</td></tr>
            <tr><td>Verso:</td><td>{{ verso_label }}</td></tr>
            <tr><td>Recto:</td><td>{{ recto_label }}</td></tr>
        </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SourceInfo',
  computed: {
    source () {
      if (this.$store.state.activeSourceFacs) {
        return this.$store.state.activeSourceFacs.source
      }
      return null
    },
    activePage () {
      if (this.$store.state.activeSourceFacs) {
        return this.$store.state.activeSourceFacs.pagenr
      }
      return 0
    },
    title () {
      if (this.source) {
        return this.source.label
      }
      return '---'
    },
    pagecount () {
      if (this.source) {
        var pc = 0
        this.source.pages.forEach(page => {
          if (page.v) pc++
          if (page.r) pc++
        })
        return pc
      }
      return 0
    },
    verso_label () {
      if (this.$store.state.activeSourceFacs) {
        return this.$store.state.activeSourceFacs.left_label
      }
      return '---'
    },
    recto_label () {
      if (this.$store.state.activeSourceFacs) {
        return this.$store.state.activeSourceFacs.right_label
      }
      return '---'
    }
  }
}
</script>
