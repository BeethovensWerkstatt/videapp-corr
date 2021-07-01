<template>
  <div class="facsView">
    <h2>{{ label }}</h2>
    <input type="range" min="25" max="150" class="slider" v-model="izoom" />
    <img :src="src" :style="{ width: izoom + '%' }" />
  </div>
</template>

<script>
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
