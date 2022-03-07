<template>
  <div class="home">
    <header>
      <img alt="Beethovens Werkstatt" src="@/assets/beethovensw_finale01.png"/>
    </header>
    <div class="container">
      <div class="columns">
        <div class="column col-3">
          <button class="btn heroBtn" @click="openWorks">{{ $tc('terms.case-study', 2) }}</button>
        </div>
        <case-studies class="column col-9 content" />
        <!-- <div class="column col-9 content" v-html="$t('messages.case-studies')" /> -->
      </div>
      <div class="columns">
        <div class="column col-3">
          <button class="btn heroBtn" @click="openModules">{{ $tc('terms.module', 2) }}</button>
        </div>
        <modules class="column col-9 content" />
      </div>
      <div class="columns">
        <div class="column col-3">
          <button class="btn heroBtn" @click="openDesktop" :disabled="true">{{ $t('terms.desktop-view') }}</button>
        </div>
        <desktop-view class="column col-9 content" />
      </div>
    </div>
  </div>
</template>

<script>
import CaseStudies from '@/components/text/CaseStudies.vue'
import Modules from '@/components/text/ModulesView.vue'
import DesktopView from '@/components/text/DesktopView.vue'

/**
 * Home view
 *
 * @module views/Home
 * @vue-computed {object[]} sources - list of available sources
 */
export default {
  name: 'Home',
  components: {
    CaseStudies,
    Modules,
    DesktopView
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
      this.$router.push({ name: 'Module' })
    },
    openDesktop () {
      console.log('open desktop ...')
    },
    openComplaints () {
      this.$router.push({ name: 'Monita' })
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

  .columns {
    margin-bottom: 1rem;
    padding: 1rem;

    .column button.heroBtn {
      background-color: #e5e5e5;
      color: #333333;
      border-color: #333333;
      margin: 0;
      padding: 1rem 0;
      height: 3rem;
      width: 100%;
      font-weight: 500;
      font-size: 1rem;
      border-radius: .5rem;
      line-height: 1;
    }

    .column.content {
      padding: 0 2rem;
    }

  }
}

</style>
