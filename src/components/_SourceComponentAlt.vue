<template>
  <div
    class="sourceBack"
    :class="{ active: isActive }"
    :id="this.divid"
    :title="label"
    @resize="resize"
  >
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
import Vue from 'vue'
import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'
import SourceOverlay from '@/components/SourceOverlay'
import { OverlayContainer } from '@/mixins/OverlayContainer'

const SourceOverlayVue = Vue.extend(SourceOverlay)

/**
 * @deprecated
 * Source components are created dynamically. See {@tutorial vue-components-programmatically}.
 * If a source is selected it may be accessed globally. See {@link module:components/SourceInfo}.
 *
 * @module components/SourceComponentAlt
 * @vue-mixin {mixin.OverlayContainer}
 * @vue-data {Object} position - position of source on desktop (x,y)
 * @vue-data {Number} pagenr - index of displayed page-pair
 * @vue-prop {Object} source - source object
 * @vue-prop {Number} index - index of this source
 * @vue-prop {Number} [defaultPage=0] - default page pair
 * @vue-computed {String} divid - id of the div for the source label
 * @vue-computed {String} label - label of this source
 * @vue-computed {OpenSeadragon} viewer - OpenSeadragon Viewer
 * @vue-computed {Boolean} hasNext - next page pair available
 * @vue-computed {Boolean} hasPrev - previous page pair available
 * @vue-computed {String} left_label - label of left (verso) page
 * @vue-computed {String} right_label - label of right (recto) page
 * @vue-computed {Boolean} isActive - true if this is the selected source
 */
export default {
  name: 'SourceComponent',
  mixins: [OverlayContainer],
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
    // console.log('source-component: ' + this.sourceId)
    return {
      pagenr: this.defaultPage,
      ti_recto: null,
      ti_verso: null,
      moving: null,
      tracker: null,
      overlays: [],
      activeZoneId: null
    }
  },
  mounted () {
    // link this source component with source object
    this.source.component = this

    this.addMark(this.source.position.x, this.source.position.y, '')

    const dh = this.$el.querySelector('#draghandle')
    this.tracker = new OpenSeadragon.MouseTracker({
      element: dh,
      clickHandler: () => { this.selectSource() },
      dragHandler: this.dragHandler,
      dragEndHandler: this.dragEndHandler,
      releaseHandler: this.dragEndHandler
    })

    this.openPage(this.pagenr)

    this.viewer.addOverlay(this.$el, this.getDashPos(), OpenSeadragon.TOP_CENTER)
  },
  computed: {
    ...mapGetters(['viewer']),
    divid () {
      return this.source.id + '_back'
    },
    source () {
      const source = this.$store.getters.getSourceById(this.sourceId)
      if (source) {
        return source
      }
      // return fake source object
      console.warn('fake source!')
      return {
        pages: [{ v: null, r: null }],
        position: { x: 0, y: 0 }
      }
    },
    position: {
      get () {
        return {
          x: this.source.position.x,
          y: this.source.position.y
        }
      },
      set (pos) {
        if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
          this.$store.commit('MOVE_SOURCE', { id: this.sourceId, x: pos.x, y: pos.y })
        }
      }
    },
    label () {
      return this.source.label
    },
    hasNext () {
      return this.pagenr < this.source.pages.length - 1
    },
    hasPrev () {
      return this.pagenr > 0
    },
    left_label () {
      if (this.pagenr >= 0 && this.pagenr < this.source.pages.length) {
        if (this.source.pages[this.pagenr].v) {
          return this.source.pages[this.pagenr].v.label
        }
      }
      return '---'
    },
    right_label () {
      if (this.pagenr >= 0 && this.pagenr < this.source.pages.length) {
        if (this.source.pages[this.pagenr].r) {
          return this.source.pages[this.pagenr].r.label
        }
      }
      return '---'
    },
    overlay () {
      return this.viewer.getOverlayById(this.divid)
    },
    isActive () {
      return this.$store.getters.activeSourceId === this.sourceId
    },
    activePage () {
      // TODO check pagenr
      return this.source.pages[this.pagenr]
    },
    activeZone () {
      var zone = null
      if (this.activeZoneId) {
        if (this.activePage.r) {
          zone = this.activePage.r.measures.find(zone => {
            return zone.zone === this.activeZoneId
          })
        }
        if (!zone && this.activePage.v) {
          zone = this.activePage.v.measures.find(zone => {
            return zone.zone === this.activeZoneId
          })
        }
        return zone
      }
      return zone
    }
  },
  methods: {
    /**
     * get size of control widget
     *
     * @returns {OpenSeadragon.Point}
     */
    getSize () {
      const w = this.$el ? this.$el.clientWidth : 200
      const h = this.$el ? this.$el.clientHeight : 10
      const size = new OpenSeadragon.Point(w, h)
      return this.viewer.viewport.deltaPointsFromPixels(size)
    },
    /**
     * get width of control in OpenSeadragon coordinates
     *
     * @returns {number} width of control panel
     */
    getWidth () {
      return this.getSize().x
    },
    /**
     * get height of control in OpenSeadragon coordinates
     *
     * @returns {number} height of control panel
     */
    getHeight () {
      return this.getSize().y
    },
    /**
     * open next page pair
     */
    nextPage () {
      const p = this.pagenr + 1
      this.openPage(p)
    },
    /**
     * open previous page pair
     */
    prevPage () {
      const p = this.pagenr - 1
      this.openPage(p)
    },
    /**
     * is current page single?
     */
    isSinglePage () {
      if (!this.source.pages[this.pagenr].v && !this.source.pages[this.pagenr].r) {
        console.warn('no displayed page???')
      }
      return (this.source.pages[this.pagenr].v === null &&
              this.source.pages[this.pagenr].r !== null) ||
             (this.source.pages[this.pagenr].v !== null &&
              this.source.pages[this.pagenr].r === null)
    },
    /**
     * open page pair of index <i>p</i>
     *
     * @param p - index of page pair
     */
    openPage (p) {
      // console.log('open page ' + p)
      if (p >= this.source.pages.length) p = this.source.pages.length - 1
      if (p < 0) p = 0

      this.pagenr = p

      const leftPage = this.source.pages[p].v
      const rightPage = this.source.pages[p].r

      // remove all zone overlays
      this.overlays.forEach(ovl => {
        if (ovl.overlayType === 'zone') {
          ovl.destroy()
        }
      })

      if (leftPage !== null) {
        this.addPage(leftPage, rightPage === null)
      } else {
        if (this.ti_verso) {
          this.ti_verso.setOpacity(0)
          this.ti_verso.destroy()
          this.ti_verso = null
        }
      }
      if (rightPage !== null) {
        this.addPage(rightPage, leftPage === null)
      } else {
        if (this.ti_recto) {
          this.ti_recto.setOpacity(0)
          this.ti_recto.destroy()
          this.ti_recto = null
        }
      }
    },
    /**
     * get X coordinate of control panel
     *
     * @returns {number} X coordinate
     */
    getDashX () {
      return this.position.x - (this.getWidth() / 2)
    },
    /**
     * get Y coordinate of control panel
     *
     * @returns {number} Y coordinate
     */
    getDashY () {
      return this.position.y + (this.source.maxDimensions.height / 2)
    },
    /**
     * get coordinate point of control panel
     *
     * @returns {OpenSeadragon.Point} coordinate of left upper corner
     */
    getDashPos () {
      // console.log(this.getWidth())
      return new OpenSeadragon.Point(this.getDashX(), this.getDashY())
    },
    /**
     * update dash coordinates to current scale
     */
    updateDashPos () {
      const p = this.getDashPos()
      if (this.overlay) {
        this.overlay.update(p, OpenSeadragon.TOP_CENTER)
      }
    },
    /**
     * calculate X for page
     *
     * @param {object} page - page object
     * @param {boolean} single - is single page
     * @returns {number} X coordinate of tiled source images
     */
    getPageX (page) {
      const x = this.position.x
      if (this.isSinglePage()) {
        return x - (this.source.maxDimensions.width / 2)
      }
      return page.place === 'verso'
        ? x - (this.source.maxDimensions.width / 2)
        : x // + (this.source.maxDimensions.width / 4)
    },
    /**
     * calculate Y for page
     *
     * @param {object} page - page object
     * @param {boolean} single - is single page
     * @returns {number} Y coordinate of tiled source images
     */
    getPageY (page) {
      const y = this.position.y
      return y - (this.source.maxDimensions.height / 2)
    },
    /**
     * Move this SourceComponent to a new position
     *
     * @param {number} tox - X coordinate
     * @param {number} toy - Y coordinate
     */
    moveTo (tox, toy, end = false) {
      // console.log(tox + ' - ' + toy)
      // console.log(this.ti_recto)
      // console.log(this.ti_verso)

      this.position = { x: tox, y: toy }

      this.updateDashPos()

      const pageXr = this.getPageX({ place: 'recto' })
      const pageYr = this.getPageY({ place: 'recto' })
      const pageXv = this.getPageX({ place: 'verso' })
      const pageYv = this.getPageY({ place: 'verso' })
      const pageP = function (ovl) {
        return (ovl.overlayType === 'zone' && ovl.page.place === 'verso')
          ? { x: ovl.container.getPageX({ place: 'verso' }), y: ovl.container.getPageY({ place: 'verso' }) }
          : { x: ovl.container.getPageX({ place: 'recto' }), y: ovl.container.getPageY({ place: 'recto' }) }
      }

      this.updateOverlays(pageP)

      var ovl
      // move debug markers ... TODO SimpleOverlay!
      const tenp = this.viewer.viewport.deltaPointsFromPixels(new OpenSeadragon.Point(10, 10)).x
      ovl = this.viewer.getOverlayById('mark_' + this.divid + '_')
      if (ovl) {
        ovl.update(
          new OpenSeadragon.Point(this.position.x - tenp, this.position.y - tenp),
          OpenSeadragon.TOP_CENTER)
      }
      ovl = this.viewer.getOverlayById('mark_' + this.divid + '_verso')
      if (ovl) {
        const pos = new OpenSeadragon.Point(
          pageXv - tenp,
          pageYv - tenp)
        ovl.update(pos, OpenSeadragon.TOP_CENTER)
      }
      ovl = this.viewer.getOverlayById('mark_' + this.divid + '_recto')
      if (ovl) {
        const pos = new OpenSeadragon.Point(
          pageXr - tenp,
          pageYr - tenp)
        ovl.update(pos, OpenSeadragon.TOP_CENTER)
      }
      // ... move debug markers end

      if (this.ti_verso) {
        this.ti_verso.setPosition(new OpenSeadragon.Point(pageXv, pageYv), true)
      }
      if (this.ti_recto) {
        this.ti_recto.setPosition(new OpenSeadragon.Point(pageXr, pageYr), true)
      }
    },
    /**
     * create TiledImage for verso and recto page.
     *
     * @param {Object} page - parameters of page: width, height, uri
     */
    addPage (page, single = false) {
      // const scaleFactor = parseInt(page.dimensions.width) / parseInt(page.pixels.width)
      // console.log(scaleFactor)

      const x = this.getPageX(page, single)
      const y = this.getPageY(page)

      const elt = document.createElement('div')
      elt.id = this.divid + '_' + page.place
      elt.className = 'hilite'
      const tisrc = {
        tileSource: {
          '@context': 'http://iiif.io/api/image/2/context.json',
          '@id': page.uri,
          profile: 'http://iiif.io/api/image/2/level2.json',
          protocol: 'http://iiif.io/api/image',
          width: page.pixels.width,
          height: page.pixels.height,
          overlays: [
            {
              element: elt,
              location: new OpenSeadragon.Rect(3, 3, 5, 5)
            }
          ]
        },
        success: (e) => {
          // when the tiled image is loaded (on success), a previous image is removed
          if (page.place === 'verso') {
            if (this.ti_verso) {
              // clear canvas before removing the ti
              this.ti_verso.setOpacity(0)
              this.ti_verso.destroy()
            }
            this.ti_verso = e.item
          } else {
            if (this.ti_recto) {
              // clear canvas before removing the ti
              this.ti_recto.setOpacity(0)
              this.ti_recto.destroy()
            }
            this.ti_recto = e.item
          }
        },
        x,
        y,
        width: page.dimensions.width// ,
        // fitBounds: new OpenSeadragon.Rect(source.position.x, source.position.y, page.dimensions.width, page.dimensions.height),
        // fitBoundsPlacement: placement,
        // degrees: source.rotation / 5
      }
      // console.log(tisrc.tileSource.overlays)
      this.viewer.addTiledImage(tisrc)
      // 10px in OSD scale
      const tenp = this.viewer.viewport.deltaPointsFromPixels(new OpenSeadragon.Point(10, 10)).x
      // mark is of height and width 20px - align it centered
      this.addMark(x - tenp, y - tenp, page.place)
      this.updateDashPos()

      // TODO srcovl lives only for this moment. This should be cleaned up!
      const srcovl = new SourceOverlayVue({
        propsData: {
          SrcCmp: this,
          source: this.source,
          page: page
        }
      })
      srcovl.$mount()
    },
    /**
     * place source on top of the stack
     */
    placeOnTop () {
      const ci = this.viewer.world.getItemCount()
      if (this.ti_verso) {
        this.viewer.world.setItemIndex(this.ti_verso, ci - 1)
      }
      if (this.ti_recto) {
        this.viewer.world.setItemIndex(this.ti_recto, ci - 1)
      }
    },
    /**
     * select this source
     *
     * @param {Object} e - event object
     */
    selectSource (e) {
      if (e) {
        e.preventDefault()
      }
      this.$store.commit('ACTIVATE_SOURCE', this.sourceId)
      this.placeOnTop()
    },
    /**
     * handle drag and drop with the drag handler
     *
     * @param {Object} e - event object
     */
    dragHandler (e) {
      if (!this.moving) {
        this.moving = { ...this.position }
        this.selectSource()
        this.startUpdateOverlays()
      }
      const delta = this.viewer.viewport.deltaPointsFromPixels(e.delta)
      this.moveTo(this.position.x + delta.x, this.position.y + delta.y)
    },
    /**
     * handle drag and drop with the drag handler
     *
     * @param {Object} e - event object
     */
    dragEndHandler (e) {
      // const delta = this.viewer.viewport.deltaPointsFromPixels(e.position)
      // this.moveTo(
      //  this.position.x + delta.x,
      //  this.position.y + delta.y)
      this.finishUpdateOverlays(this.position)
      this.moving = null
    },
    /**
     * get current zoom scale
     *
     * @returns {number} zoom factor
     */
    getScale () {
      var zoom = this.viewer.viewport.getZoom(true)
      return this.viewer.viewport._containerInnerSize.x * zoom
    },
    /**
     * get CSS transformation string
     *
     * @returns {string} 'scale(*scale*) rotate(*rotation*)'
     */
    getTransform () {
      var rotation = this.viewer.viewport.getRotation()
      return 'scale(' + this.getScale() + ') rotate(' + rotation + ')'
    },
    /**
     * *not used*
     * calculate styles for control panel
     *
     * @returns {object} position and scale
     */
    styles () {
      var p = this.viewer.viewport.pixelFromPoint(this.getDashPos(), true)

      return {
        left: p.x + 'px',
        top: p.y + 'px',
        transform: this.getTransform()
      }
    },
    /**
     * *not used*
     * process resize events
     */
    resize (e) {
      console.log(e)
      this.updateDashPos()
    },
    /**
     * **for debugging**
     * add red 'X' at position (x, y)
     */
    addMark (x, y, tag) {
      const id = 'mark_' + this.divid + '_' + tag
      const mark = document.createElement('div')
      mark.setAttribute('id', id)
      mark.setAttribute('style', 'font-weight: bold; color: red; width: 20px; text-align: center;')
      mark.innerHTML = 'X'
      if (this.overlay) {
        this.overlay.update(new OpenSeadragon.Point(x - 10, y), OpenSeadragon.Placement.TOP_CENTER)
      } else {
        this.viewer.addOverlay(mark,
          new OpenSeadragon.Point(x - 10, y),
          { placement: OpenSeadragon.Placement.TOP_CENTER })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
