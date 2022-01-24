<template>
  <context-modal
    @context-modal="finishDialog"
    :active="dialogActive"
    divid="filter-dialog"
    :title="$t(tagLabel[dialog.tag])"
    :dialog="dialog"
  >
    <div class="filterInfo">{{ filterInfo }}</div>
    <hr />
    <div>
      <input type="checkbox" @change="selectAll" id="filterSelectAll" />
      <label for="filterSelectAll">Alle Auswählen</label>
    </div>
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
        <template v-if="dialog.tag === 'movementMeasure'">
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
import n from '@/store/names'
import { sortTag, tagLabel, complaintFilterTags } from '@/store/complaints/data'
import tb from '@/toolbox'
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
    tagsSelected: []
  }),
  computed: {
    ...mapGetters([
      n.getters.complaintFilterDialog,
      n.getters.complaintFilter,
      n.getters.filterSelection,
      n.getters.filterSelect,
      n.getters.allComplaints,
      n.getters.workComplaints,
      n.getters.getMovementById,
      n.getters.getWork
    ]),
    dialogActive () {
      // console.log(this[n.getters.complaintFilterDialog])
      return !!this[n.getters.complaintFilterDialog]?.tag
    },
    tetherOptions () {
      const topts = {
        element: this.$el,
        target: '#' + this.dialog?.target,
        constraints: [
          {
            to: 'scrollParent',
            pin: true
          }
        ]
      }
      return topts
    },
    sid () {
      return 'sel-' + this.dialog?.tag
    },
    tags () {
      // console.log(this.tag, complaintFilterTags)
      switch (this.dialog?.tag) {
        case sortTag.movementMeasure:
          return this.movements
        case sortTag.document:
          return this.documents
      }
      if (this.dialog?.tag) {
        return ['', ...complaintFilterTags[this.dialog?.tag]]
      }
      return []
    },
    workId () {
      return this.$route.params.id
    },
    works () {
      // if (this.workId) {
      //  return [this.workId]
      // }
      const complaints = this.allComplaints
      const works = [...new Set(complaints.map(c => c.movement.work))]
      console.log(works)
      return works
    },
    movements () {
      const complaints = this.workId ? this.workComplaints(this.workId, false) : this[n.getters.allComplaints]
      const movements = [...new Set(complaints.map(c => c.affects[0].mdiv))]
      // console.log(complaints, movements)
      return movements
    },
    documents () {
      const complaints = this.workId ? this.workComplaints(this.workId, false) : this[n.getters.allComplaints]
      const documents = [...new Set(complaints.map(c => c.revisionDoc))]
      // console.log(this.workId, complaints, documents)
      return documents
    },
    filterInfo () {
      return this.tagsSelected?.length > 0 ? this.$t('messages.filter-count') : this.$t('messages.no-filter')
    }
  },
  methods: {
    setAll (val) {
      const keys = {}
      for (const key of this.tags) {
        keys[key] = val
      }
      this.$store.dispatch(n.actions.setFilterSelect, { tag: this.tag, keys })
    },
    select (e) {
      console.log(e.target)
      const t = e.target.value
      const v = e.target.checked
      console.log(e, t, v)
      this.$store.commit(n.mutations.SET_FILTER_SELECT, {
        tag: this.dialog?.tag, key: t, val: v
      })
      this.tagsSelected = this.tags.filter(this.isSelected)
    },
    selectAll (e) {
      console.log(e)
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
        const wrk = !this.workId ? (this.workTitle(movement.work) + ', ') : ''
        return wrk + tb.toRoman(movement.n) + '. ' + movement.label
      }
      return mdiv
    },
    workTitle (workId) {
      const work = this.getWork(workId)
      return work?.title[0].title
    },
    finishDialog (e) {
      console.log('close dialog ...', e)
      switch (e) {
        case 'ok':
          this.$store.commit(n.mutations.SET_FILTER, {
            tag: this.dialog.tag,
            filter: this.createFilter()
          })
          break
      }
      this.$store.commit(n.mutations.DISPLAY_FILTER_DIALOG, {})
    },
    createFilter () {
      const tag = this.dialog?.tag
      const filterSet = this.tags.filter((t) => {
        const sel = this.isSelected(t)
        // console.log(this.dialog?.tag, t, sel)
        return sel
      })
      console.log('set filter ...', filterSet)
      if (filterSet.length > 0) {
        // TODO movements / documents!!
        switch (this.dialog?.tag) {
          // filter by movements
          case sortTag.movementMeasure:
            return (c) => {
              for (const mvt of filterSet) {
                if (c.affects[0].mdiv === mvt) {
                  return true
                }
              }
              return false
            }
          // filter by revision document
          case sortTag.document:
            return (c) => {
              for (const doc of filterSet) {
                if (c.revisionDoc === doc) {
                  return true
                }
              }
              return false
            }
        }
        // filter by tag list
        const filter = (c) => {
          const tags = c.tags[tag]
          for (const t of filterSet) {
            if (t === '') {
              if (tags.length === 0) {
                return true
              }
            } else if (tags.indexOf(t) >= 0) {
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
.filterInfo {
  color: gray;
  font-style: italic;
}
</style>
