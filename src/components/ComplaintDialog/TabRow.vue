<template>
  <div class="tabrow">
    <tab-col :styles="colStyles" :select="select" v-if="select.ante" :row="row" state="ante" />
    <tab-col :styles="colStyles" :select="select" v-if="select.rvsn" :row="row" state="revision" />
    <tab-col :styles="colStyles" :select="select" v-if="select.post" :row="row" state="post" />
  </div>
</template>

<script>
import TabCol from './TabCol.vue'

/**
 * @module components/ComplaintDialog/TabRow
 * @vue-property {Object} select - flags for flags what to display: ante, rvsn, post, facs, trns, text, anno
 * @vue-property {Object} row - the table row with columns for ante, revision and post
 * @vue-property {Object} colStyles - styles for each table row (width)
 */
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
    },
    colStyles: {
      type: Object,
      required: true
    }
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
.tabrow {
  display: table-row;
  max-width: 100%;
}
</style>
