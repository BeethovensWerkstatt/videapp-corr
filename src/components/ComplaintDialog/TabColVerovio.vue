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
  max-width: 100%;
  overflow: scroll;
}
</style>
