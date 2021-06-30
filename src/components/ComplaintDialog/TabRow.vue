<template>
  <div class="tabrow">
    <tab-col :row="row" state="ante" />
    <tab-col :row="row" state="revision" />
    <tab-col :row="row" state="post" />
  </div>
</template>

<script>
import TabCol from './TabCol.vue'
export default {
  components: { TabCol },
  name: 'ComplaintDialogTabRow',
  props: {
    select: {
      type: Object,
      required: true
    },
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
  max-width: 100%;
}
</style>
