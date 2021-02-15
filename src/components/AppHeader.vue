<template>
  <header>
    VideApp<sub>corr</sub> &bullet; <router-link to="/">Startseite</router-link> &bullet; <router-link to="/works">Werkliste</router-link>
  </header>
</template>

<script>
/**
 * Application header component
 *
 * @module components/AppHeader
 */
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
