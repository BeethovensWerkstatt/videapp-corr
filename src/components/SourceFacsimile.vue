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
      default: () => {
        return {
          pages: [{ v: null, r: null }]
        }
      }
    }
  },
  computed: {
    divid () {
      return this.source.id + '_back'
    },
    label () {
      return this.source.label
    }
  },
  mounted () {
    const leftPage = this.source.pages[0].v
    const rightPage = this.source.pages[0].r

    if (leftPage !== null) {
      this.addPage(leftPage, this.source)
    }
    if (rightPage !== null) {
      this.addPage(rightPage, this.source)
    }
  },
  methods: {
    addSource (source, i) {
      console.log(source)
    },
    addPage (page, source) {
      console.log(page)
      console.log(source)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
