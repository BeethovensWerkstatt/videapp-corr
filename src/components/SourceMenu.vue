<template>
  <div class="srcMenuButton">
    <span tabindex="0" @click.prevent="toggleMenu">
      &#x2630;
    </span>
    <div :id="menuid" style="z-index: 10000;">
      <ul class="srcMenu" v-if="active">
        <li class="menu-item">
          <button class="customBtn btn btn-link" @click.prevent="showOverview()">
            Document Overview
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'
import { atId } from '@/toolbox'

export default {
  name: 'SourceMenu',
  props: {
    sourceId: {
      type: String,
      required: true
    },
    position: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    active: false
  }),
  mounted () {
    this.viewer.addOverlay({
      element: this.$el.querySelector(`#${this.menuid}`),
      position: this.menuposition
    })
  },
  watch: {
    position () {
      if (this.overlay) {
        this.overlay.update(this.menuposition)
      }
    }
  },
  computed: {
    ...mapGetters(['viewer', 'sourceHeaderHeight']),
    menuid () {
      return 'source-menu-' + atId(this.sourceId)
    },
    menuposition () {
      const x = this.position.x
      const y = this.position.y + this.sourceHeaderHeight
      const width = this.position.width
      const height = 4 * this.sourceHeaderHeight
      return new OpenSeadragon.Rect(x, y, width, height)
    },
    overlay () {
      return this.viewer?.getOverlayById(this.menuid)
    }
  },
  methods: {
    toggleMenu () {
      console.log('toggleMenu')
      this.active = !this.active
    },
    showOverview () {
      console.log('display page overview ...')
      this.active = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.srcMenuButton {
  display: inline-block;
}
.srcMenu {
  margin: auto;
  display: inline-block;
  background-color: rgba(233, 231, 231, 0.45);
  li {
    list-style: none;
    background: linear-gradient(0deg, #dddddd, #ffffff);
  }
}
</style>
