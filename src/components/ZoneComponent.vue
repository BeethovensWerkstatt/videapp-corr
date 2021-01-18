<template>
    <div :id="divid" class="zone-component">
    </div>
</template>

<script>
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
