<template>
  <div class="facsView">
    <h2>{{ label }}</h2>
    <img :src="src" :style="{ width: '100%' }" />
  </div>
</template>

<script>
export default {
  name: 'ComplaintDialogTabColFacs',
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
  overflow: auto;
  resize: vertical;
}
</style>
