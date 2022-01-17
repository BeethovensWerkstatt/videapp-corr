<template>
  <div :id="divid">
    <div class="contextModalHeader">
    </div>
    <div class="contextModalContent">
    </div>
    <div class="contextModalControl">
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContextModal',
  props: {
    buttons: {
      type: Array,
      default: () => ([])
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
