<template>
  <container id="app">
    <app-header />
    <router-view />
    <app-footer />
  </container>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppHeader, AppFooter
  }
}
</script>

<style lang="scss">
@import "./scss/verovio.scss";

body {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#app-router-view {
  padding-bottom: 1rem;
}

</style>
