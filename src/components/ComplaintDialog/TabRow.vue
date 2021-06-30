<template>
  <div class="tabrow">
  </div>
</template>

<script>
export default {
  name: 'ComplaintDialogTabRow',
  props: {
    row: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.tabrow {
  display: table-row;
}
</style>
