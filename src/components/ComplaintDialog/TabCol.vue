<template>
  <div class="tabcol">
    <tab-col-facs v-if="facsUrl" :src="facsUrl" :label="facsLabel" />
  </div>
</template>

<script>
import TabColFacs from './TabColFacs.vue'

export default {
  components: { TabColFacs },
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
  },
  computed: {
    facsUrl () {
      const url = this.row[this.state]?.img?.url
      // console.log(url)
      return url
    },
    facsLabel () {
      const label = this.row[this.state]?.img?.label
      // console.log(label)
      return label
    }
  }
}
</script>

<style lang="scss" scoped>
.tabcol {
  width: 33%;
  overflow: scroll;
  resize: vertical;
  display: table-cell;
  overflow: scroll;
  vertical-align: top;
  padding: 3pt;
}
</style>
