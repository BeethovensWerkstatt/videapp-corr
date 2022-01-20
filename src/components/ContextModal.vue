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

export default {
  name: 'ContextModal',
  data: () => ({
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
