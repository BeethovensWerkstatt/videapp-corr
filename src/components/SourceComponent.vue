<template>
  <div class="source-component">
    <document-header-component
      :position="headerPos"
      :sourceId="sourceId"
      :active="isActive"
      @move-source="moveTo"
    />
    <document-margin-component
      :position="marginPos"
      :sourceId="sourceId"
      :active="isActive"
    />
    <page-component
      :divid="divid + '_' + pagenr + '_verso'"
      :sourceId="sourceId"
      :page="source.pages[pagenr].v"
      :pos="versoPos"
      :active="isActive"
    />
    <page-component
      :divid="divid + '_' + pagenr + '_recto'"
      :sourceId="sourceId"
      :page="source.pages[pagenr].r"
      :pos="rectoPos"
      :active="isActive"
    />
  </div>
</template>

<script>
// import Vue from 'vue'
import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'
import PageComponent from '@/components/PageComponent.vue'
import DocumentHeaderComponent from '@/components/DocumentHeaderComponent.vue'
import DocumentMarginComponent from '@/components/DocumentMarginComponent.vue'
import { mutations } from '@/store/names'
import { Url } from '@/toolbox/net'

/**
 * @module components/SourceComponent
 * @vue-prop {String} sourceId - id of source object
 * @vue-prop {Number} [defaultPage=0] - first opend page on load
 * @vue-data {Object} position_ - private position variable (x, y)
 * @vue-data {Object} tracker - OpenSeadragon.MouseTracker object
 * @vue-computed {OpenSeadragon.Viewer} viewer - Viewer object
 * @vue-computed {Number} scale - current scale of viewer
 * @vue-computed {Object} source - source object retrieved by sourceId
 * @vue-computed {String} label - label/title of source
 * @vue-computed {Number} pagenr - index of page pair (recto/verso)
 * @vue-computed {Object} position - position (x,y) of component (viewport coordinate), move page components and overlay on change
 * @vue-computed {Boolean} isActive - sourceId === $store.activeSourceId
 * @vue-computed {OpenSeadragon.Rect} rectoPos - position of recto page
 * @vue-computed {OpenSeadragon.Rect} versoPos - position of verso page
 */
export default {
  components: { PageComponent, DocumentHeaderComponent, DocumentMarginComponent },
  name: 'SourceComponent',
  props: {
    sourceId: {
      type: String,
      required: true
    },
    defaultPage: {
      type: Number,
      default: 0
    }
  },
  data: function () {
    return {
      position_: { ...this.$store.getters.getSourceById(this.sourceId).position },
      tracker: null
    }
  },
  computed: {
    ...mapGetters(['viewer', 'scale', 'sourceHeaderHeight', 'sourceMarginWidth']),
    divid () {
      const atId = new Url(this.sourceId)
      let id = atId.path.elements.pop()
      id = id.split('.').filter(e => e !== 'json').join('_')
      console.log(id)
      return id + '_dash'
    },
    source () {
      const source = this.$store.getters.getSourceById(this.sourceId)
      if (source) {
        return source
      }
      // return fake source object
      console.warn('no source for ' + this.sourceId + '!')
      return {
        pages: [{ v: null, r: null }],
        position: { x: 0, y: 0 }
      }
    },
    label () {
      return this.source.label
    },
    pagenr () {
      const pnr = +this.source.pagenr
      if (this.checkPageNr(pnr)) {
        return pnr
      }
      if (this.checkPageNr(this.defaultPage)) {
        return this.defaultPage
      }
      return 0
    },
    position: {
      get () {
        return this.position_
      },
      set (pos) {
        this.position_ = pos
        if (this.overlay) {
          // console.log('move source ' + this.sourceId + ': ' + JSON.stringify(pos))
          this.overlay.update(new OpenSeadragon.Point(this.dashX, this.dashY), OpenSeadragon.TOP_CENTER)
          this.$forceUpdate()
        }
      }
    },
    hasPrev () {
      return this.checkPageNr(this.pagenr - 1)
    },
    hasNext () {
      return this.checkPageNr(this.pagenr + 1)
    },
    isActive () {
      return this.sourceId === this.$store.getters.activeSourceId
    },
    headerPos () {
      const pp = this.source.pages[this.pagenr]
      const x = (pp.v ? this.versoPos.x : this.rectoPos.x) - this.sourceMarginWidth
      const y = (pp.v ? this.versoPos.y : this.rectoPos.y) - this.sourceHeaderHeight
      const width = this.rectoPos.width + this.versoPos.width + (2 * this.sourceMarginWidth)
      const pos = new OpenSeadragon.Rect(x, y, width, this.sourceHeaderHeight)
      return pos
    },
    marginPos () {
      const pp = this.source.pages[this.pagenr]
      const x = (pp.v ? this.versoPos.x : this.rectoPos.x) - this.sourceMarginWidth
      const y = (pp.v ? this.versoPos.y : this.rectoPos.y)
      const width = this.rectoPos.width + this.versoPos.width + (2 * this.sourceMarginWidth)
      const height = Math.max(this.rectoPos.height, this.versoPos.height)
      const pos = new OpenSeadragon.Rect(x, y, width, height)
      return pos
    },
    rectoPos () {
      const pp = this.source.pages[this.pagenr]
      if (pp.r) {
        // center page, if no recto page
        const x = this.position.x - (pp.v ? 0 : (pp.r.dimensions.width / 2))
        const y = this.position.y - (pp.r.dimensions.height / 2)
        const width = pp.r.dimensions.width
        const height = pp.r.dimensions.height
        return new OpenSeadragon.Rect(x, y, width, height)
      }
      return new OpenSeadragon.Rect(0, 0, 0, 0)
    },
    versoPos () {
      const pp = this.source.pages[this.pagenr]
      if (pp.v) {
        // center page, if no recto page
        const x = this.position.x - (pp.r ? pp.r.dimensions.width : (pp.v.dimensions.width / 2))
        const y = this.position.y - (pp.v.dimensions.height / 2)
        const width = pp.v.dimensions.width
        const height = pp.v.dimensions.height
        return new OpenSeadragon.Rect(x, y, width, height)
      }
      return new OpenSeadragon.Rect(0, 0, 0, 0)
    }
  },
  methods: {
    /**
     * check if page number is in range
     * @param {Number} pnr - page number to check
     * @returns {Boolean} true if `pnr` is in range
     */
    checkPageNr (pnr) {
      return (pnr >= 0 && pnr < this.source.pages.length)
    },
    /**
     * move SourceComponent to new position
     *
     * @param {Number} x - horizontal coordinate (viewport)
     * @param {Number} y - vertical coordinate (viewport)
     */
    moveTo (x, y) {
      this.position = { x, y }
      this.$store.commit(mutations.MOVE_SOURCE, { id: this.sourceId, ...this.position })
    }
  }
}
</script>

<style scoped lang="scss">
.source-component {
  position: relative;
}

.sourceBack {
  background-color: rgba($color: #ffffff, $alpha: 0.5);
  width: 110px;
  text-align: center;
}

.btn {
  background-color: rgba($color: #ffffff, $alpha: 0.5);
  border-radius: 5px;
  margin: 5pt;
  padding: 3pt;
}

.btn:hover {
  outline: 1px solid blue;
  background-color: rgba($color: #ffffff, $alpha: 0.8);
}
.active {
  outline: 1px solid green;
  background-color: rgba($color: #ffffff, $alpha: 0.8);
}
.hilite {
  outline: 1px solid green;
}
</style>
