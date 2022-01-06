<template>
  <div class="complaints-filter-dialog">
    <div class="cfd-btn">
      <btn
        @click="openDialog"
        class="btn-sm"
        :class="{ 'btn-primary': hasFilter || display }"
      >
        Y
      </btn>
    </div>
    <div :id="divid" v-if="display" class="cfg-dlg">
      <btn @click="closeDialog">{{ $t('terms.close') }}</btn>
      <div
        v-for="(t,i) in tags"
        :key="i + '-opt'"
      >
        <input
          :id="sid + '-' + t"
          type="checkbox"
          :checked="isSelected(t)"
          @change="select(t)" />
        <label :for="sid + '-' + t">
          {{ $t('taxonomy.' + t) }}
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import n from '@/store/names'
import { complaintFilterTags } from '@/store/complaints'

export default {
  name: 'ComplaintsFilterDialog',
  props: {
    tag: {
      type: String,
      required: true
    }
  },
  data: () => ({
    display: false
  }),
  computed: {
    ...mapGetters([n.getters.complaintFilter, n.getters.filterSelect]),
    divid () {
      return 'cfd-' + this.tag
    },
    sid () {
      return 'sel-' + this.tag
    },
    hasFilter () {
      return this.tag in Object.keys(this[n.getters.complaintFilter])
    },
    tags () {
      // console.log(this.tag, complaintFilterTags)
      return complaintFilterTags[this.tag]
    }
  },
  methods: {
    openDialog (e) {
      e.preventDefault()
      this.display = true
    },
    closeDialog (e) {
      e.preventDefault()
      const filterSet = this.tags.filter((t) => {
        const sel = this.isSelected(t)
        // console.log(this.tag, t, sel)
        return sel
      })
      console.log('TODO set filter ...', filterSet)
      const filter = (c) => {
        return true
      }
      this.$store.commit(n.mutations.SET_FILTER, { tag: this.tag, [this.tag]: filter })
      this.display = false
    },
    select (t) {
      this.$store.commit(n.mutations.SET_FILTER_SELECT, {
        tag: this.tag, key: t, val: true
      })
    },
    isSelected (t) {
      const sel = this[n.getters.filterSelect](this.tag, t)
      // console.log(t, sel)
      return sel
    }
  }
}
</script>

<style lang="scss" scoped>
.complaints-filter-dialog {
  display: inline-block;

  .cfg-dlg {
    display: block !important;
    position: absolute;
    top: 25px;
    left: 0px;
    width: 400px;
    height: 400px;
    background: white;
  }
  .cfd-btn {
    position: absolute;
    display: inline-block;
    right: 3px;
    top: 3px;
  }
}
</style>
