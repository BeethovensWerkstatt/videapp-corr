<template>
  <div
    class="sourceBack"
    :class="{ active: isActive }"
    :id="this.divid"
    :title="label"
  >
    <page-component
      :divid="divid + '_recto'"
      :page="source.pages[pagenr].r"
      :x="rectoX"
      :y="rectoY"
    />
    <page-component
      :divid="divid + '_verso'"
      :page="source.pages[pagenr].v"
      :x="versoX"
      :y="versoY"
    />
    <btn-group>
      <btn
        @click="prevPage"
        :disabled="!hasPrev">
      ◄
      </btn>
      <btn id="draghandle">
        ❂
      </btn>
      <btn
        @click="nextPage"
        :disabled="!hasNext"
      >
      ►
      </btn>
    </btn-group>
  </div>
</template>

<script>
// import Vue from 'vue'
// import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'
import PageComponent from '@/components/PageComponent.vue'

/**
 * @module components/SourceComponent
 */
export default {
  components: { PageComponent },
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
      tracker: null
    }
  },
  mounted () {
    this.tracker = new OpenSeadragon.MouseTracker({
      element: this.dragHandle,
      clickHandler: () => { this.selectSource() },
      dragHandler: this.dragHandler,
      dragEndHandler: this.dragEndHandler,
      releaseHandler: this.dragEndHandler
    })
  },
  computed: {
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
    dragHandle () {
      return this.$el.querySelector('#draghandle')
    }
  },
  methods: {
    checkPageNr (pnr) {
      return (pnr >= 0 && pnr < this.source.pages.length)
    }
  }
}
</script>

<style scoped lang="scss">
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
