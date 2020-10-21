<template>
  <header>
    VideApp<sub>corr</sub> (<router-link to="/">Startseite</router-link>)
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "@/scss/variables.scss";

header {
  border-bottom: .5px solid $border-color;
  padding: .2rem 1rem;
}
</style>
