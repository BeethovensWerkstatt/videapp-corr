<template>
  <span>
    <btn @click.prevent="openFilter">
    </btn>
  </span>
</template>

<script>
export default {
  name: 'ComplaintsFilterDialog',
  methods: {
    openFilter (e) {
      e.preventDefault()
      console.log(e)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
