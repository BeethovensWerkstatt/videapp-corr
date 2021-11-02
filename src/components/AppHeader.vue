<template>
  <header>
    <span :title="versionText" @click="openCommit">VideApp<sub>corr</sub></span>
    <router-link to="/">{{ $t('terms.home') }}</router-link>
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
    ...mapGetters(['version']),
    versionText () {
      return this.version?.version
    }
  },
  methods: {
    openCommit (e) {
      if (e.shiftKey && this.version?.commit) {
        const url = 'https://github.com/BeethovensWerkstatt/videapp-corr/commit/' + this.version.commit
        console.log(url)
        // we could open '_blank', but named it will open only one new tab/window
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
  background-color: $background-flat;
  border-bottom: .5px solid $light-border-color;
  padding: .2rem 1rem;

  a, a:active, a:visited, a:hover {
    color: $link-color;
  }

  a:before {
    content: '|';
    padding: 0 .5rem;
    color: $text-color;
    cursor: default;
  }

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
