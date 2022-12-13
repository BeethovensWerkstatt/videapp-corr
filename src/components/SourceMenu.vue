<template>
  <div class="srcMenuButton">
    <span tabindex="0" @click.prevent="toggleMenu">
      &#x2630;
    </span>
    <div :id="menuid">
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
import { atId } from '../toolbox'
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
      position: this.position
    })
  },
  watch: {
    position () {
      if (this.overlay) {
        this.overlay.update(this.position)
      }
    }
  },
  computed: {
    ...mapGetters(['viewer']),
    menuid () {
      return 'source-menu-' + atId(this.sourceId)
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
  display: inline-block;
  background-color: lightgray;
  li {
    list-style: none;
  }
}
</style>
