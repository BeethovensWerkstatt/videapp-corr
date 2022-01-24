<template>
  <div>
    <div
      class="context-dialog"
      :class="{ active }"
    />
    <div
      :id="divid"
      class="context-modal"
      :style="modalStyle"
    >
      <div class="context-modal-container" v-if="active">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tether from 'tether'
import n from '@/store/names'

export default {
  name: 'ContextModal',
  data: () => ({
    tether: undefined
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
    dialog: {
      type: Object,
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
  beforeUpdate () {
    if (this.tether) {
      // console.log('destroy Tether ...')
      this.tether.destroy()
      this.tether = undefined
    }
  },
  updated () {
    const element = this.modalElement
    const topts = this.dialog?.tether ? { ...this.dialog.tether, element } : undefined
    // console.log(this.divid, topts, element)
    if (this.active && topts) {
      // console.log(document.querySelector(topts.target))
      this.tether = new Tether(topts)
    }
  },
  computed: {
    ...mapGetters([
      n.getters.complaintFilterDialog
    ]),
    modalElement () {
      return this.$el.querySelector('#' + this.divid)
    },
    modalStyle () {
      const style = {
        ...(this.dialog?.dimension ? this.dialog.dimension : {})
      }
      // console.log(style)
      return style
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
  position: fixed;
  z-index: 1000 !important;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(1px);
  background-color: #33333333;
}
.context-modal {
  position: absolute;
  display: inline-block;
  z-index: 1001 !important;
  .context-modal-container {
    background-color: white;
    border-radius: 5px;

    .context-modal-header {
      background: linear-gradient(180deg, #cccccc 0%, #f5f5f5 100%);
      font-weight: bold;
      padding: 3px;
    }
    .context-modal-content {
      text-align: left;
      padding: 5px;
    }
    .context-modal-control {
      text-align: center;
    }
  }
}
</style>
