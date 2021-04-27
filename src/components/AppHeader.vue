<template>
  <header>
    <span :title="version" @click="openCommit">VideApp<sub>corr</sub></span> &bullet;
    <router-link to="/">{{ $t('terms.home') }}</router-link> &bullet;
    <router-link to="/works">{{ $t('terms.works') }}</router-link>
    <div class="progress"><Progress /></div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import Progress from '@/components/Progress.vue'

/**
 * Application header component
 *
 * @module components/AppHeader
 */
export default {
  components: { Progress },
  name: 'AppHeader',
  computed: {
    ...mapGetters(['version'])
  },
  methods: {
    openCommit (e) {
      if (e.shiftKey && this.version?.commit) {
        const url = 'https://github.com/BeethovensWerkstatt/videapp-corr/commit/' + this.version.commit
        console.log(url)
        window.open(url, 'videapp-commit')
      }
    }
  }
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
