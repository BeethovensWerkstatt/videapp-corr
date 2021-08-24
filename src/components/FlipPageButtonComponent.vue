<template>
  <div class="flip-button">
    <svg
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      @click="action"
      :class="{ enabled, disabled }"
    >
      <text x="0" y="50%" style="font-size: 8px;" dominant-baseline="middle">{{ isBackwards ? '◄' : '►' }}</text>
    </svg>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'FlipPageButtonComponent',
  props: {
    dir: {
      type: Number,
      required: true
    },
    action: {
      type: Function,
      required: true
    },
    enabled: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters(['viewer', 'sourceHeaderHeight', 'sourceMarginWidth']),
    disabled () {
      return !this.enabled
    },
    isBackwards () {
      return this.dir < 0
    }
  }
}
</script>

<style lang="scss" scoped>
.flip-button {
  width: 100%;
  height: 100%;
  background-color: white;

  svg {
    width: 100%;
  }
}

.disabled {
  fill: lightgrey;
}
.enabled {
  fill: black;
  cursor: pointer;
}
</style>
