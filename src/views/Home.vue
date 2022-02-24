<template>
  <div class="home">
    <header>
      <img alt="Beethovens Werkstatt" src="@/assets/beethovensw_finale01.png"/>
    </header>
    <div class="container">
      <div class="columns">
        <div class="column col-4">
          <btn @click="openWorks">{{ $tc('terms.case-study', 2) }}</btn>
        </div>
        <div class="column col-8" v-html="$t('messages.case-studies')" />
      </div>
      <div class="columns">
        <div class="column col-4">
          <btn @click="openModules">{{ $tc('terms.module', 2) }}</btn>
        </div>
        <div class="column sol-8" v-html="$t('messages.modules')" />
      </div>
      <div class="columns">
        <div class="column col-4">
          <btn @click="openDesktop" :disabled="true">{{ $t('terms.desktop-view') }}</btn>
        </div>
        <div class="column col-8" v-html="$t('messages.desktop-view')" />
      </div>
    </div>
    <!--
    <p>
      Herzlich Willkommen im dritten Modul von Beethovens Werkstatt. Dieses ist
      "Auf der Suche nach dem Werktext: Originalausgaben, variante Drucke und
       Beethovens Korrekturlisten". Thematisiert werden also die spezifischen
       Formen der Textentwicklung während und nach der Übergabe eines Werktextes
       an den Verleger. Um die Stadien der Genese und die variante
       Drucküberlieferung von Originalausgaben zu systematisieren, zu gruppieren
       und (abweichende) Auflagen in eine zeitliche Ordnung zu bringen, ist
       ein entsprechendes Kollationierungswerkzeug entwickelt worden.
       Zugleich wurde erforscht, inwieweit die in den Druckvarianten
       erkennbaren Korrekturen und/oder konzeptionellen Änderungen autorisiert
       sind. In diesem Zusammenhang befasst sich das Modul mit Beethovens
       Korrekturlisten und Revisionsverzeichnissen.
      </p>
      <p>
        Auf dieser Seite finden Sie die digital aufgearbeiteten Werke des
        Projekts. Sie können von hier die aktuellen Fallstudien erreichen, aber
        auch Materialien aus früheren Modulen des Projekts. Folgen Sie dazu
        bitte dem <router-link to="/works">Link zu den Werken des Projekts</router-link>.
    </p>
    -->
  </div>
</template>

<script>
// @ is an alias to /src

/**
 * Home view
 *
 * @module views/Home
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
  },
  methods: {
    openWorks () {
      this.$router.push({ name: 'Werke' })
    },
    openModules () {
      console.log('open modules ...')
    },
    openDesktop () {
      console.log('open desktop ...')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/scss/variables.scss";

header {
  max-width: 10rem;
  margin: 2rem auto;
  img {
    width: 10rem;
  }
}

p {
  max-width: 50rem;
  margin: 2rem auto;
  text-align: left;
}

.container {
  max-width: 50rem;
  margin: 2rem auto;
  text-align: left;
}
</style>
