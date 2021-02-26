<template>
  <header>
    VideApp<sub>corr</sub> &bullet;
    <router-link to="/">Startseite</router-link> &bullet;
    <router-link to="/works">Werkliste</router-link>
    <div class="progress"><Progress /></div>
  </header>
</template>

<script>
import Progress from '@/components/Progress.vue'
/**
 * Application header component
 *
 * @module components/AppHeader
 */
export default {
  components: { Progress },
  name: 'AppHeader'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "@/scss/variables.scss";

header {
  border-bottom: .5px solid $border-color;
  padding: .2rem 1rem;

  .progress {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 5pt;
    width: auto;
    height: auto;
    background-color: transparent;
  }
}

</style>
