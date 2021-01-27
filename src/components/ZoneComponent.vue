<template>
    <div class="zone-component" :style="style">
    </div>
</template>

<script>
/**
 * @module components/ZoneComponent
 * @vue-prop {number} x - horizontal coordinate on page
 * @vue-prop {number} y - vertical coordinate on page
 * @vue-prop {number} width - width of measure zone
 * @vue-prop {number} height - height of measure zone
 */
export default {
  name: 'ZoneComponent',
  props: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  computed: {
    style () {
      return {
        left: (100 * this.x) + '%',
        top: (100 * this.y) + '%',
        width: (100 * this.width) + '%',
        height: (100 * this.height) + '%'
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/scss/variables.scss";

.zone-component {
  position: absolute;
  border: .5px solid $border-color;
  // border-radius: 5px;
  // box-shadow: 0 0 .5rem #00000099;
  opacity: 0;

  &.active {
    opacity: .5;
    background-color: rgba($color: #ffffff, $alpha: .5);
  }

  &.anno {
    opacity: .5;
    border: .5px solid blue !important;
    border-radius: 3px;
  }

  &:hover {
    opacity: 1;
    box-shadow: 0 0 .5rem #00000099;
  }

  &.hide {
    display: none
  }
}
</style>
