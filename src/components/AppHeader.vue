<template>
  <header class="navbar">
    <section class="navbar-section">
      <span :title="versionText" @click="openCommit" class="navbar-brand mr-2 home">
        <img src="../assets/beethovensw_finale01.png" />
      </span>
    </section>
    <section class="navbar-section">
      <div class="website-menu">
        <a href="https://beethovens-werkstatt.de/" target="_blank" title="Beethovens Werkstatt">
          Home
        </a>
        <router-link :to="{ name: 'Home' }" class="active" title="VideApp">
          VideApp
        </router-link>
        <a href="https://beethovens-werkstatt.de/projekt/" target="_blank">
          Projekt
        </a>
        <a href="https://beethovens-werkstatt.de/modul-3/" target="_blank">
          Module
        </a>
        <a href="https://beethovens-werkstatt.de/glossar/" target="_blank">
          Glossar
        </a>
        <a href="https://beethovens-werkstatt.de/kontakt/" target="_blank">
          Kontakt
        </a>
      </div>
      <div class="progress"><Progress /></div>
    </section>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import Progress from '@/components/Progress.vue'
import n from '@/store/names'

/**
 * Application header component
 *
 * @module components/AppHeader
 */
export default {
  components: { Progress },
  name: 'AppHeader',
  computed: {
    ...mapGetters([n.getters.version, n.getters.mainbranch]),
    versionText () {
      // console.log(config)
      return this.version?.branch !== this[n.getters.mainbranch]
        ? this.version?.version ? this.version.version + this.version.branch : this.version?.branch
        : 'VideApp version ' + this.version?.date
    }
  },
  methods: {
    openCommit (e) {
      if (e.shiftKey) {
        if (this.version?.commit) {
          const url = 'https://github.com/BeethovensWerkstatt/videapp-corr/commit/' + this.version.commit
          console.log(url)
          // we could open '_blank', but named it will open only one new tab/window
          window.open(url, 'videapp-commit')
        }
      } else {
        this.$router.push({ name: 'Home' })
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
  border-bottom: 1px solid $light-border-color;

  border-top: 5px solid $highlight-color;

  a, a:active, a:visited, a:hover {
    color: $link-color;
  }

  img {
    height: 1rem;
    position: relative;
    top: 5px;
    left: 1rem;
  }

  .home {
    cursor: pointer;
  }

  .website-menu {
    a {
      display: inline-block;
      font-family: "Open Sans", GillSans, Calibri, Trebuchet, sans-serif;
      font-weight: 800;
      font-size: .5rem;
      text-transform: uppercase;
      letter-spacing: -0.08px;
      margin: 0;
      padding: .3rem .5rem;
      color: #3a3a3a;
      text-decoration:none;
      position: relative;
      &:hover {
        color: #c93b22;
      }

      &.active {
        color: $highlight-color;
        border-bottom: 1px solid $highlight-color;
        position: relative;
        bottom: -1px;
        background-color: lighten($background-flat, 10%)
      }
    }
  }

  .progress {
    // display: inline-block;
    float: right;
    // position: absolute;
    margin-left: 25px;
    top: 0;
    right: 5pt;
    width: auto;
    height: auto;
    background-color: transparent;
  }
}

</style>
