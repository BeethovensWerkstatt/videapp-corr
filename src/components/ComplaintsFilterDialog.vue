<template>
  <div class="complaints-filter-dialog">
    <div class="cfd-btn">
      <btn
        @click="openDialog"
        class="btn-sm"
        :class="{ 'btn-primary': hasFilter || display }"
        title="Filter"
      >
        Y
      </btn>
    </div>
    <div :id="divid" v-if="display" class="cfg-dlg">
      <btn @click="closeDialog">{{ $t('terms.close') }}</btn>&nbsp;
      <strong>{{ $t(tagLabel[tag]) }}</strong>
      <div
        v-for="(t,i) in tags"
        :key="i + '-opt'"
      >
        <input
          :id="sid + '-' + t"
          type="checkbox"
          :checked="isSelected(t)"
          @change="select"
          :value="t"
        />
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
import { sortTag, tagLabel } from '@/store/complaints/names'

export default {
  name: 'ComplaintsFilterDialog',
  props: {
    tag: {
      type: String,
      required: true
    }
  },
  data: () => ({
    display: false,
    sortTag,
    tagLabel
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
      const filters = this[n.getters.complaintFilter]
      const fi = Object.keys(filters).indexOf(this.tag)
      return fi >= 0 && Object.values(filters)[fi]
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
      const filter = this.createFilter()
      this.$store.commit(n.mutations.SET_FILTER, { tag: this.tag, filter })
      this.display = false
    },
    select (e) {
      console.log(e.target)
      const t = e.target.value
      const v = e.target.checked
      console.log(e, t, v)
      this.$store.commit(n.mutations.SET_FILTER_SELECT, {
        tag: this.tag, key: t, val: v
      })
    },
    isSelected (t) {
      const sel = this[n.getters.filterSelect](this.tag, t)
      // console.log(t, sel)
      return sel
    },
    createFilter () {
      const tag = this.tag
      const filterSet = this.tags.filter((t) => {
        const sel = this.isSelected(t)
        // console.log(this.tag, t, sel)
        return sel
      })
      console.log('TODO set filter ...', filterSet)
      if (filterSet.length > 0) {
        const filter = (c) => {
          const tags = c.tags[tag]
          for (const t of filterSet) {
            // TODO OR or AND??
            if (tags.indexOf(t) >= 0) {
              return true
            }
          }
          return false
        }
        return filter
      }
      return undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.complaints-filter-dialog {
  display: inline-block;

  .cfg-dlg {
    display: block !important;
    position: relative;
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
