<template>
  <div class="dialogBack" :class="{ 'inactive': !this.active }">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ComplaintListDialog',
  props: {},
  data: () => ({}),
  mounted () {
    window.addEventListener('resize', this.resize)
  },
  watch: {
    active () {
      if (this.active) {
        this.viewer.navigator.element.style.display = 'none'
      } else {
        this.viewer.navigator.element.style.display = 'inline-block'
      }
    }
  },
  computed: {
    ...mapGetters(['viewer']),
    active () {
      return false
    }
  }
}

</script>

<style lang="scss" scoped>

.dialogBack {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
  background-color: rgba(0,0,0,.3);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.inactive {
  display: none;
}

.dialog {
  position: absolute;
  left: 1rem;
  top: 1rem;
  // TODO ??
  width: calc(100% - 2rem);
  height: calc(100% - 2rem);
  border-radius: 5px;
  background-color: white;
  border: .5px solid #666666;
  box-shadow: 0 0 .8rem #00000066;
  border-radius: .3rem;
}

</style>
