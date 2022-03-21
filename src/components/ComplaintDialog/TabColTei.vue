<template>
  <div class="TEI">
    <h2 :class="'heading_' + layer">
      {{ label }} <!--<span class="indicator">(TEI)</span> -->
      <a
        v-if="glossaryLink !== ''"
        class="glossaryLink"
        target="_blank"
        rel="noopener noreferrer"
        :href="glossaryLink"
      >
        <i class="icon icon-link"></i>
      </a>
    </h2>
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
    tei: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    layer: {
      type: String,
      required: true
    }
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
  computed: {
    glossaryLink () {
      if (this.$props.label === 'annotierte Transkription') {
        return ''
      } else if (this.$props.label === 'Zieltext') {
        return 'https://beethovens-werkstatt.de/glossary/zieltext/'
      } else if (this.$props.label === 'Ausgangstext') {
        return 'https://beethovens-werkstatt.de/glossary/ausgangstext/'
      } else {
        return ''
      }
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
            outputIndent: 0,
            pageMarginTop: 0,
            pageMarginBottom: 0,
            pageMarginLeft: 0,
            pageMarginRight: 0,
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
            // svg.documentElement.setAttributeNode(heightatt)
            span.innerHTML = serializer.serializeToString(svg.documentElement)
          })
          this.teitext = serializer.serializeToString(renderedHTML)
        }).catch((error) => {
          console.log(error)
          this.teitext = '<div class="error">' + error + '</div>'
        })
      } else {
        this.teitext = '&mdash;xxx'
      }
    }
  }
}
</script>

<style lang="scss">
.teitext {
  resize: vertical;
  width: 100%;
  height: 400px;
  overflow: auto;
  text-align: left;
  padding: 5px;
}

h2 {
  text-align: left;
  font-size: .8rem;
  font-weight: 500;
  margin: 0.5rem 0rem .2rem;
  padding: .3rem;
  background-color: #f5f5f5;
  border: 1px solid #333333;
  cursor: default;

  &.heading_trans {
    background-color: #A7C4E5; // #6CA5B4;
    .indicator {
      color: gray;
    }
  }

  &.heading_text {
    background-color: #AFEC77; // #A7C4E5;
  }

  .glossaryLink {
    color: #666666;
    cursor: question;
  }
}

.error {
  color: red;
}

.notatedMusic {
  svg {
    height: 5em;
    vertical-align: -80%;
  }
}
</style>
