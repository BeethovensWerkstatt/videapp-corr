<template>
  <div class="complaints-filter-dialog">
    <span>
      <btn @click="openDialog" :class="{ 'btn-primary': hasFilter || display }">
        Y
      </btn>
    </span>
    <div :id="divid" v-if="display" class="cfg-dlg">
      <btn @click="closeDialog">{{ $t('terms.close') }}</btn>
      <div
        v-for="(t,i) in tags"
        :key="i + '-opt'"
      >
        <input
          :id="sid + '-' + t"
          type="checkbox"
          :model="select[t]" />
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
    display: false,
    select: {}
  }),
  computed: {
    ...mapGetters([n.getters.complaintFilter]),
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
      this.display = false
    },
    changeFilter (e) {
      console.log(e, this.$el.querySelector('#' + this.sid).value)
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
    top: 10px;
    left: 10px;
    width: 600px;
    height: 400px;
    background: white;
  }
}
</style>
