<template>
  <div class="complaints-filter-button" :id="divid">
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
    divid () {
      return 'ComplaintFilterButton-' + this.tag
    },
    hasFilter () {
      const filters = this[n.getters.complaintFilter]
      const fi = Object.keys(filters).indexOf(this.tag)
      return fi >= 0 && Object.values(filters)[fi]
    }
  },
  methods: {
    openDialog (e) {
      e.preventDefault()
      // console.log(e)
      if (e.altKey) {
        this.$store.commit(n.mutations.SET_FILTER, {
          tag: this.tag
        })
      } else {
        // console.log('filter', this.tag)
        // TODO calc position, with and height from userConf?
        this.$store.commit(n.mutations.DISPLAY_FILTER_DIALOG, {
          tag: this.tag,
          tether: {
            target: '#' + this.divid,
            attachment: 'top center',
            targetAttachment: 'bottom center',
            constraints: [
              {
                to: 'window',
                pin: true
              }
            ]
          },
          dimension: {
            width: '500px',
            'padding-bottom': '1em'
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.complaints-filter-button {
  display: inline-block;

  .cfd-btn {
    display: inline-block;
    border-radius: 5px;
    .hasFilter {
      outline-color: rgba(65, 105, 225, 0.568) !important;
    }
    &:hover {
      background-color: rgba(245, 220, 81, 0.493);
    }
    button, button:focus {
      outline: none;
    }
  }
}
</style>
