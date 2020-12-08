<template>
  <div class="home">
    <!--<img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <h1>Ich bin eine Begrüßungsseite</h1>
    <p>
      Hier können wir lauter lustigen Text schreiben, wenn wir das möchten.
      Für den Moment mache ich die <router-link to="/works">Werke</router-link>
      über einen separaten Link erreichbar, aber die könnten auch hier integriert
      werden.
    </p>
  </div>
</template>

<script>
// @ is an alias to /src

/**
 * Home view
 *
 * @vue-computed {object[]} sources - list of available sources
 */
export default {
  name: 'Home',
  components: {
  },
  mounted () {
    // console.log(this.sources)
  },
  computed: {
    sources () {
      // TODO query
      return this.$store.getters.sources
    }
  }
}
</script>
