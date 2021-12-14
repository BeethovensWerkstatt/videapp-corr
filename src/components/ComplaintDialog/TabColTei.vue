<template>
  <div class="TEI">
    <!-- <a :href="tei" v-if="tei">TEI</a> -->
    <div class="teitext" v-html="teitext" v-if="teitext" />
  </div>
</template>

<script>
import axios from 'axios'
/**
 * @module components/ComplaintDialog/TabColTei
 */
export default {
  name: 'ComplaintDialogTabColTei',
  props: {
    tei: undefined
  },
  data: () => ({
    data: '',
    teitext: ''
  }),
  mounted () {
    this.loadTEI()
  },
  watch: {
    tei () {
      console.log(this.tei)
      this.loadTEI()
    }
  },
  methods: {
    loadTEI () {
      console.log('load', this.tei)
      // TODO store getter function
      if (this.tei) {
        axios.get(this.tei).then(({ data }) => {
          // exchange MEI with SVG
          const toolkit = this.$store.getters.vrvToolkit()
          // TODO options in data or computed
          toolkit.setOptions({
            scale: 2,
            pageWidth: 10000,
            outputIndent: 1,
            adjustPageWidth: true,
            adjustPageHeight: true,
            svgBoundingBoxes: true,
            svgViewBox: true
          })
          const parser = new DOMParser()
          const serializer = new XMLSerializer()
          const renderedHTML = parser.parseFromString(data, 'text/xml')
          renderedHTML.querySelectorAll('.notatedMusic').forEach(span => {
            const MEI = serializer.serializeToString(span.children[0])
            // console.log(MEI)
            toolkit.loadData(MEI)
            const svgtxt = toolkit.renderToSVG(1)
            const svg = parser.parseFromString(svgtxt, 'image/svg+xml')
            const heightatt = document.createAttribute('height')
            heightatt.value = '5em'
            svg.documentElement.setAttributeNode(heightatt)
            span.innerHTML = serializer.serializeToString(svg.documentElement)
          })
          this.teitext = serializer.serializeToString(renderedHTML)
        }).catch((error) => console.log(error))
      } else {
        this.teitext = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.teitext {
  resize: vertical;
  width: 100%;
  height: 400px;
  overflow: auto;
  text-align: left;
  padding: 5px;
}
</style>
