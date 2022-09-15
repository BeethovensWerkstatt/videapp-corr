<template>
  <div class="desk">
    <desktop-component divid="canvas" :width="1650" :height="1000"></desktop-component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DesktopComponent from '@/components/DesktopComponent'

/**
 * Desktop View without complaints
 *
 * @module views/Desktop
 * @vue-computed {object[]} sources - list of available sources
 */
export default {
  name: 'Desktop',
  components: {
    DesktopComponent
  },
  computed: {
    ...mapGetters(['viewer', 'scale'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "@/scss/variables.scss";

.desk {
  flex: 1 0 auto;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  position: relative;
}

#canvas {
  height: 100%;
  width: calc(100% - 15rem);
  flex: 1 1 auto;

  .measure {
    width: 3rem;
    height: 1rem;
    border: .5px solid $border-color;
    border-radius: 5px;
    box-shadow: 0 0 .5rem #00000099;
    opacity: 0;

    &:hover {
      opacity: 1;
    }

    &.active {
      background-color: rgba($color: #ffffff, $alpha: .5);
    }
  }
}
</style>
