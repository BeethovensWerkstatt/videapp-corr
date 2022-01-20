<template>
  <div class="complaints-filter-button">
    <div class="cfd-btn">
      <btn
        @click="openDialog"
        class="btn-sm btn-link"
        :class="{ hasFilter }"
        title="Filter"
      >
        <symbol-filter :SVGclass="hasFilter ? 'active' : ''" />
      </btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import n from '@/store/names'
import SymbolFilter from './symbols/SymbolFilter.vue'

export default {
  components: { SymbolFilter },
  name: 'ComplaintsFilterButton',
  props: {
    tag: {
      type: String,
      required: true
    }
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters([n.getters.complaintFilter]),
    hasFilter () {
      const filters = this[n.getters.complaintFilter]
      const fi = Object.keys(filters).indexOf(this.tag)
      return fi >= 0 && Object.values(filters)[fi]
    }
  },
  methods: {
    openDialog (e) {
      e.preventDefault()
      console.log(e)
      // console.log('filter', this.tag)
      // TODO calc position, with and height from userConf?
      this.$store.commit(n.mutations.DISPLAY_FILTER_DIALOG, {
        tag: this.tag,
        position: {
          x: e.pageX,
          y: e.pageY,
          w: 400,
          h: 400
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.complaints-filter-button {
  display: inline-block;

  .cfd-btn {
    display: inline-block;
    .hasFilter {
      outline-color: rgba(65, 105, 225, 0.568);
    }
  }
}
</style>
