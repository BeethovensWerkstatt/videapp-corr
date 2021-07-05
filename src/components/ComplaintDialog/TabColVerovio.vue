<template>
  <div>
    <h2>{{ label }}</h2>
    <input :id="vid+'-zoom'" type="range" min="5" max="100" class="slider" v-model="vzoom" />
    <div class="vrvContainer">
      <verovio-component
        :id="vid"
        :options="voptions"
      />
    </div>
  </div>
</template>

<script>
import VerovioComponent from '@/components/VerovioComponent.vue'

/**
 * @module components/ComplaintDialog/TabColVerovio
 * @vue-prop {String} vid - id for verovio element
 * @vue-prop {Options} options - verovio options
 * @vue-prop {String} label - label/title for this element
 */
export default {
  components: { VerovioComponent },
  name: 'ComplaintDialogTabColVerovio',
  data () {
    return {
      zoom: 30
    }
  },
  props: {
    vid: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },
  computed: {
    vzoom: {
      get () {
        return parseInt(this.zoom)
      },
      set (zoom) {
        this.zoom = parseInt(zoom)
      }
    },
    voptions () {
      return { ...this.options, scale: this.vzoom }
    }
  }
}
</script>

<style lang="scss" scoped>
.vrvContainer {
  width: 100%;
  overflow: auto;
  resize: vertical;
}
</style>
