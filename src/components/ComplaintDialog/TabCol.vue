<template>
  <div class="tabcol">
  </div>
</template>

<script>
export default {
  name: 'ComplaintDialogTabCol',
  props: {
    row: {
      type: Object,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.tabcol {
  display: table-column;
}
</style>
