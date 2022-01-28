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
  watch: {
    dialog () {
      this.tagsSelected = this.tags.filter(this.isSelected)
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
      n.getters.getWork
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
      return this.$store.getters[n.getters.complaintFilterKeys](this.dialog?.tag, this.workId)
    },
    workId () {
      return this.$route.params.id
    },
    works () {
      return this.$store.getters[n.getters.complaintWorks]
    },
    movements () {
      return this.$store.getters[n.getters.complaintMovements](this.workId)
    },
    documents () {
      return this.$store.getters[n.getters.complaintDocuments](this.workId)
    },
    filterInfo () {
      const msg = this.$tc('messages.filter-count', (this.tagsSelected?.length ? this.tagsSelected.length : 0))
      // console.log(msg)
      return msg
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
      // console.log('close dialog ...', e)
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
      const filterTag = this.dialog?.tag
      const filterSet = this.tags.filter((t) => {
        const sel = this.isSelected(t)
        // console.log(this.dialog?.tag, t, sel)
        return sel
      })
      if (filterTag) {
        return this.$store.getters[n.getters.createComplaintFilter](filterTag, filterSet)
      }
      console.warn('noe filter tag given!')
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
