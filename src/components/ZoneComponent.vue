<template>
    <div :id="divid" class="zone-component" :style="style">
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
  }
}
</script>

<style scoped>
.zone-component {
    position: absolute;
}
</style>
