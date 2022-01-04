<template>
  <div class="complaints-filter-dialog">
    <span>
      <btn @click="openDialog" :class="{ 'btn-primary': hasFilter || display }">
        Y
      </btn>
    </span>
    <div :id="divid" v-if="display" class="cfg-dlg">
      <btn @click="closeDialog">{{ $t('terms.close') }}</btn>
      Filter {{ tag }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import n from '@/store/names'

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
    ...mapGetters([n.getters.complaintFilter]),
    divid () {
      return 'cfd-' + this.tag
    },
    hasFilter () {
      return this.tag in Object.keys(this[n.getters.complaintFilter])
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
    width: 100px;
    height: 100px;
    background: orange;
  }
}
</style>
