<template>
  <div
    class="document-footer"
    :id="divid"
  >
    <div
      class="bottom-title"
      :style="{ left: marginPerc + '%', width: titlePerc + '%' }"
      id="draghandle-footer"
    >
      <div class="title">
        <div v-if="source.pages[pagenr].v" :style="footerStyleVerso">
          <template v-if="sourceURLVerso">
            <a :href="sourceURLVerso" target="_blank" :title="sourceDescVerso" @click="window.open(sourceURLVerso, '_blank')">{{ sourceLabelVerso }}</a>
          </template>
          <template v-else-if="sourceLabelVerso">
            {{ sourceLabelVerso }}
          </template>
        </div>
        <div v-if="source.pages[pagenr].r" :style="footerStyleRecto">
          <template v-if="sourceURLRecto">
            <a :href="sourceURLRecto" target="_blank" :title="sourceDescRecto" @click="window.open(sourceURLRecto, '_blank')">{{ sourceLabelRecto }}</a>
          </template>
          <template v-else-if="sourceLabelRecto">
            {{ sourceLabelRecto }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import OpenSeadragon from 'openseadragon'

const sourceLabel = (labels) => {
  if (labels) {
    let label = labels.names[0].label
    if (labels.names[0].page) label += ' [' + labels.names[0].page + ']'
    return label
  }
  return undefined
}
const sourceDesc = (labels) => {
  if (labels) {
    let label = labels.names[0].desc
    if (labels.names[0].page) label += ' [' + labels.names[0].page + ']'
    return label
  }
  return undefined
}

/**
 * @module components/DocumentFooterComponent
 * @vue-prop {String} sourceId id of source object
 */
export default {
  components: {},
  name: 'DocumentFooterComponent',
  props: {
    sourceId: {
      type: String,
      required: true
    },
    position: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const $el = ref(null)

    const store = useStore()

    const viewer = computed(() => store.getters.viewer)
    const background = viewer.world.getItemAt(0)
    let scale = background?.viewportToImageZoom(viewer.viewport.getZoom())
    if (!scale) {
      scale = 1
    }
    const position_ = ref({ ...store.getters.getSourceById(props.sourceId).position })
    const tracker = ref(null)
    const dragDelta = ref(null)

    const sourceFooterHeight = computed(() => store.getters.sourceFooterHeight)
    const sourceMarginWidth = computed(() => store.getters.sourceMarginWidth)
    const getSourceById = computed(() => store.getters.getSourceById)
    const getCanvasLabels = computed(() => store.getters.getCanvasLabels)

    const divid = computed(() => props.sourceId + '_footer')
    const overlay = computed(() => viewer.value ? viewer.value.getOverlayById(divid.value) : null)
    const marginPerc = computed(() => (100 * sourceMarginWidth.value / props.position.width))
    const titlePerc = computed(() => (100 - (2 * marginPerc.value)))
    const dragHandle = computed(() => $el.value?.querySelector('#draghandle-footer'))

    const source = computed(() => {
      const source = getSourceById.value(props.sourceId)
      if (source) {
        return source
      }
      // return fake source object
      console.warn('no source for ' + props.sourceId + '!')
      return {
        pages: [{ v: null, r: null }],
        position: { x: 0, y: 0 }
      }
    })

    /**
     * update overlay position
     */
    function updatePosition () {
      if (overlay.value) {
        overlay.value.update(props.position)
      }
    }
    watch({
      position () {
        // console.log(props.position)
        updatePosition()
      }
    })
    /**
     * set zoom factor
     */
    function doResize (e) {
      const zoom = viewer.value.world.getItemAt(0).viewportToImageZoom(e.zoom)
      // console.log(zoom)
      scale.value = zoom * 2
    }
    /**
     * check if page number is in range
     * @param {Number} pnr - page number to check
     * @returns {Boolean} true if `pnr` is in range
     */
    function checkPageNr (pnr) {
      return (pnr >= 0 && pnr < source.value.pages.length)
    }

    const sourceNameRecto = computed(() => {
      const page = source.value.pages[pagenr.value].r
      return getCanvasLabels(page?.id)
    })
    const sourceNameVerso = computed(() => {
      const page = source.value.pages[pagenr.value].v
      return getCanvasLabels(page?.id)
    })

    const sourceLabelRecto = computed(() => sourceLabel(sourceNameRecto.value) || 'Signatur Recto')
    const sourceDescRecto = computed(() => sourceDesc(sourceNameRecto.value) || 'Signatur Recto')
    const sourceURLRecto = computed(() => sourceNameRecto.value?.names[0].url)
    const sourceLabelVerso = computed(() => sourceLabel(sourceNameVerso.value) || 'Signatur Verso')
    const sourceDescVerso = computed(() => sourceDesc(sourceNameVerso.value) || 'Signatur Verso')
    const sourceURLVerso = computed(() => sourceNameVerso.value?.names[0].url)

    const pagenr = computed(() => {
      const pnr = +source.value.pagenr
      if (checkPageNr(pnr)) {
        return pnr
      }
      return 0
    })
    const rectopage = computed(() => {
      const page = source.value.pages[pagenr.value]
      const labels = getCanvasLabels(page?.r?.id)
      return labels?.page || page.value.r?.label || ''
    })
    const versopage = computed(() => {
      const page = source.value.pages[pagenr.value]
      const labels = getCanvasLabels(page?.v?.id)
      return labels?.page || page.v?.label || ''
    })
    const footerStyle = computed(() => {
      const zoom = viewer.value.viewport.getZoom(true)
      const scale = viewer.value.viewport._containerInnerSize.x * zoom
      // console.log('header scale', scale)
      return {
        'font-size': scale * sourceFooterHeight.value * 0.7 + 'px'
      }
    })
    const footerStyleRecto = computed(() => {
      const width = (versopage.value) ? '50%' : '100%'
      const display = (rectopage.value) ? 'inline-block' : 'none'
      return ({ ...footerStyle.value, 'text-align': 'right', 'padding-right': '5pt', display, width })
    })
    const footerStyleVerso = computed(() => {
      const width = (rectopage.value) ? '50%' : '100%'
      const display = (versopage.value) ? 'inline-block' : 'none'
      return ({ ...footerStyle.value, 'text-align': 'left', 'padding-left': '5pt', display, width })
    })

    onMounted(() => {
      if (viewer.value) {
        viewer.value.addOverlay({
          element: $el.value,
          location: props.position
        }, props.position, OpenSeadragon.TOP_CENTER)
        viewer.value.addHandler('zoom', doResize())
      }
    })

    return {
      $el,
      viewer,
      position_,
      tracker,
      dragDelta,
      scale: ref(scale),
      window: ref(window),

      sourceFooterHeight,
      sourceMarginWidth,
      getSourceById,
      getCanvasLabels,

      divid,
      overlay,
      marginPerc,
      titlePerc,
      dragHandle,

      source,
      pagenr,
      sourceNameRecto,
      sourceNameVerso,
      sourceLabelRecto,
      sourceDescRecto,
      sourceURLRecto,
      sourceLabelVerso,
      sourceDescVerso,
      sourceURLVerso,
      rectopage,
      versopage,
      footerStyle,
      footerStyleRecto,
      footerStyleVerso
    }
  }
}
</script>

<style lang="scss" scoped>
.document-footer {
  // outline: 1px solid red;
  padding: 0%;
  margin: 0%;

  .btn {
    width: 100%;
    height: 100%;
    margin: 0%;
    padding: 0%;
  }
  .bottom-title {
    position: absolute;
    height: 100%;
    text-align: center;
    white-space: nowrap;
    // TODO color consts in separate file
    background: linear-gradient(0deg, #dddddd, #ffffff);
    border-radius: 3px;

    .title {
      position: absolute;
      left: 0;
      width: 100%;
      overflow: hidden;
      font-size: 80%;
    }
  }
}

</style>
