<template>
  <div>
    <h2>{{ label }}</h2>
    <input type="range" min="25" max="150" class="slider" v-model="izoom" />
    <div class="facsView">
      <img :src="src" :style="{ width: izoom + '%' }" />
    </div>
  </div>
</template>

<script>
/**
 * @module components/ComplaintDialog/TabColFacs
 * @vue-data {Number} izoom - image zoom factor in percent of width (TODO get resolution and width of image)
 * @vue-prop {String} src - image url
 * @vue-prop {String} label - label/title of image (facsimile)
 */
export default {
  name: 'ComplaintDialogTabColFacs',
  data () {
    return {
      izoom: 100
    }
  },
  props: {
    src: {
      type: String,
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
.facsView {
  width: 100%;
  overflow: auto;
  resize: vertical;
}
.slider {
  width: 90%;
}
</style>
