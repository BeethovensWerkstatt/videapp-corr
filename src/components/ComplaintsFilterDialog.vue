<template>
  <context-modal
    @context-modal="finishDialog"
    :active="dialogActive"
    divid="filter-dialog"
    :title="$t(tagLabel[dialog.tag])"
    :dialog="dialog"
    :buttons="buttons"
  >
    <div class="filterInfo">{{ filterInfo }}</div>
    <hr />
    <div class="selectAll">
      <input
        type="checkbox"
        id="filterSelectAll"
        v-model="selectAll"
      />
      <label for="filterSelectAll">{{ $t('terms.selectall') }}</label>
    </div>
    <div
      v-for="(t,i) in tags"
      :key="i + '-opt'"
    >
      <input
        :id="sid + '-' + t"
        type="checkbox"
        :checked="tagsSelected.indexOf(t) >= 0"
        @change="select"
        :value="t"
      />
      <label :for="sid + '-' + t">
        <template v-if="dialog.tag === 'work'">
          {{ workTitle(t) }}
        </template>
        <template v-else-if="dialog.tag === 'movementMeasure'">
          {{ movementTitle(t) }}
        </template>
        <template v-else-if="dialog.tag === 'document'">
          {{ t }}
        </template>
        <template v-else>
          {{ t ? $t('taxonomy.' + t) : '&mdash;' }}
        </template>
      </label>
    </div>
  </context-modal>
</template>

<script>
import { mapGetters } from 'vuex'
// import { vsprintf } from 'sprintf-js'
import n from '@/store/names'
import { sortTag, tagLabel } from '@/store/complaints/data'
import { filterAndCol } from '@/toolbox'
import ContextModal from './ContextModal.vue'

export default {
  components: { ContextModal },
  name: 'ComplaintsFilterDialog',
  props: {
    dialog: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    display: false,
    sortTag,
    tagLabel,
    tagsSelected: [],
    filterInfo: '',
    buttons: [
      { label: 'terms.cancel', value: 'cancel' },
      { label: 'terms.ok', value: 'ok', class: 'btn-primary' }
    ]
  }),
  watch: {
    dialog () {
      this.tagsSelected = this.tags.filter(this.isSelected)
    },
    tagsSelected () {
      this.updateFilterInfo()
    }
  },
  computed: {
    ...mapGetters([
      n.getters.complaintFilterDialog,
      n.getters.complaintFilter,
      n.getters.filterSelection,
      n.getters.filterSelect,
      n.getters.allComplaints,
      n.getters.workComplaints,
      n.getters.getMovementById,
      n.getters.getWork,
      n.getters.complaintFilterKeys,
      n.getters.complaintWorks,
      n.getters.complaintMovements,
      n.getters.complaintDocuments,
      n.getters.createComplaintFilter
    ]),
    dialogActive () {
      // console.log(this[n.getters.complaintFilterDialog])
      return !!this[n.getters.complaintFilterDialog]?.tag
    },
    sid () {
      return 'sel-' + this.dialog?.tag
    },
    tags () {
      // console.log(this.tag, complaintFilterTags)
      return this[n.getters.complaintFilterKeys](this.dialog?.tag, this.workId)
    },
    workId () {
      return this.$route.params.id
    },
    works () {
      return this[n.getters.complaintWorks]
    },
    movements () {
      return this[n.getters.complaintMovements](this.workId)
    },
    documents () {
      return this[n.getters.complaintDocuments](this.workId)
    },
    selectAll: {
      get () {
        const selection = this.tagsSelected
        return selection.length === this.tags.length
      },
      set (v) {
        // console.log(v)
        for (const t of this.tags) {
          this.$store.commit(n.mutations.SET_FILTER_SELECT, {
            tag: this.dialog?.tag, key: t, val: v
          })
        }
        this.tagsSelected = this.tags.filter(this.isSelected)
      }
    }
  },
  methods: {
    updateFilterInfo () {
      // current filter mapping
      const filtermap = { ...this[n.getters.complaintFilter] }
      // current filter
      const curFilter = filtermap[this.dialog?.tag]
      // filter by current checkboxes
      const newFilter = this.createFilter()
      // add/remove filter from filtermap
      if (this.dialog?.tag) {
        if (typeof newFilter === 'function') {
          filtermap[this.dialog.tag] = newFilter
        } else {
          delete filtermap[this.dialog.tag]
        }
      }

      const filters = Object.values(filtermap).filter(f => (typeof f === 'function'))
      // console.log(filters.map(f => f.filterTag))
      const allComplaints = this[n.getters.allComplaints]
      const complaints = filters.length > 0
        ? allComplaints.filter(filterAndCol(filters))
        : allComplaints
      // console.log(Object.keys(filtermap), filters.length, complaints.length)
      const msg = this.$tc('messages.complaint-count', complaints.length)
      // console.log(msg)
      this.filterInfo = msg

      // update ok-button-label
      let label = 'terms.ok'
      if (curFilter) {
        if (newFilter) {
          label = 'terms.complaint.filter.change'
        } else {
          label = 'terms.complaint.filter.deactivate'
        }
      } else {
        if (newFilter) {
          label = 'terms.complaint.filter.activate'
        }
      }
      this.buttons = [
        { label: 'terms.cancel', value: 'cancel' },
        { label, value: 'ok', class: 'btn-primary' }
      ]
    },
    select (e) {
      // console.log(e.target)
      const t = e.target.value
      const v = e.target.checked
      // console.log(e, t, v)
      this.$store.commit(n.mutations.SET_FILTER_SELECT, {
        tag: this.dialog?.tag, key: t, val: v
      })
      this.tagsSelected = this.tags.filter(this.isSelected)
    },
    isSelected (t) {
      const sel = this[n.getters.filterSelect](this.dialog?.tag, t)
      // console.log(t, sel)
      return sel
    },
    movementTitle (mdiv) {
      const movement = this[n.getters.getMovementById](mdiv)
      if (movement) {
        // console.log(movement)
        const wrk = !this.workId ? (this.workLabel(movement.work) + ', ') : ''
        return wrk + movement.label
      }
      return mdiv
    },
    workLabel (workId) {
      const work = this.getWork(workId)
      const workTitle = work?.label[0].title || work?.title[0].title
      const spidx = workTitle?.indexOf(' ')
      return (spidx >= 0 ? workTitle.substring(spidx + 1) : '')
    },
    workTitle (workId) {
      const work = this.getWork(workId)
      return work?.title[0].title
    },
    finishDialog (e) {
      // console.log('close dialog ...', e)
      const tag = this.dialog.tag
      const filter = this.createFilter()
      switch (e) {
        case 'ok':
          this.$store.commit(n.mutations.SET_FILTER, { tag, filter })
          break
        // case 'cancel':
      }
      this.$store.commit(n.mutations.DISPLAY_FILTER_DIALOG, {})
    },
    createFilter () {
      const filterTag = this.dialog?.tag
      const filterSet = this.tags.filter((t) => {
        const sel = this.isSelected(t)
        // console.log(this.dialog?.tag, t, sel)
        return sel
      })
      if (filterTag) {
        return this[n.getters.createComplaintFilter](filterTag, filterSet)
      }
      console.warn('no filter tag given!')
      // if no filterTag is given return dummy filter
      return (c) => true
    }
  }
}
</script>

<style lang="scss" scoped>
.filterInfo {
  color: gray;
  font-style: italic;
}
.selectAll {
  margin-bottom: 1em;
  font-style: italic;
}
</style>
