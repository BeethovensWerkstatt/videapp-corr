<template>
  <div class="context-dialog" :class="{ active }">
    <div :id="divid" v-if="active">
      <div class="context-modal-header">
        {{ title }}
      </div>
      <div class="context-modal-content">
        <slot></slot>
      </div>
      <div class="context-modal-control">
        <span v-for="(b,i) in buttons" :key="i + 'dlg-btn'">
          <btn @click="doClick(b.value)" class="btn" :class="b.class">{{ $t(b.label) }}</btn>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import n from '@/store/names'
import { complaintFilterTags } from '@/store/complaints'
import { sortTag, tagLabel } from '@/store/complaints/names'
// import tb from '@/toolbox'

export default {
  name: 'ContextModal',
  data: () => ({
    sortTag,
    tagLabel
  }),
  props: {
    divid: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    buttons: {
      type: Array,
      default: () => ([
        { label: 'terms.cancel', value: 'cancel' },
        { label: 'terms.ok', value: 'ok', class: 'btn-primary' }
      ])
    }
  },
  computed: {
    ...mapGetters([]),
    tags () {
      // console.log(this.tag, complaintFilterTags)
      switch (this.tag) {
        case sortTag.movementMeasure:
          return this.movements
        case sortTag.document:
          return this.documents
      }
      return ['', ...complaintFilterTags[this.tag]]
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
    }
  },
  methods: {
    doClick (e) {
      // console.log(e)
      this.$emit('context-modal', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.context-dialog {
  display: none;
  z-index: -1;
}
.context-dialog.active {
  display: inline-block !important;
  position: absolute;
  z-index: 1000 !important;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(3px);
  background-color: #33333333;
}
.context-dialog .context-modal-content {
  text-align: left;
  background-color: lightgray;
}
</style>
