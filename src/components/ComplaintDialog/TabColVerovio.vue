<template>
  <div class="vrvContainer">
    <h2>{{ label }}</h2>
    <verovio-component
      :id="vid"
      :options="options"
    />
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
