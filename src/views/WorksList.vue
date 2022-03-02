<template>
  <div class="workslist">
    <h1>{{ $tc('terms.case-study', 2) }}</h1>
    <div class="works-table">
      <table id="worksList" class="table">
        <thead>
          <tr>
            <th>{{ $t('terms.opus') }}</th>
            <th>{{ $tc('terms.work', 1) }}</th>
            <th>{{ $t('terms.software') }}</th>
            <th>{{ $tc('terms.explanatory', 2) }}</th>
            <th>{{ $tc('terms.module', 2) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="work in works" :key="work['@id']">
            <td>
              {{ work.label }}
            </td>
            <td>
              {{ work.title }}
            </td>
            <td>
              <router-link :to="getLink(work.id)" target="_blank" v-if="work.route">
                &#x06de; {{ work.apptitle || '[?]' }}
              </router-link>
              <a :href="work.app" target="_blank" v-else-if="work.app">
                &#x06de; {{ work.apptitle || '[?]' }}
              </a>
              <template v-else>&mdash;</template>
            </td>
            <td>
              <a :href="work.url" target="_blank" v-if="work.url">
                &#x2799; zu {{ work.label }} ...
              </a>
              <template v-else>&mdash;</template>
            </td>
            <td>
              <span v-for="(module, i) in work.modules" :key="module">
                <template v-if="i > 0">, </template>
                <a :href="moduleURL(module)" target="_blank" :title="moduleTitel(module)">{{ moduleLabel(module) }}</a>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import n from '@/store/names'
import { workSorter } from '@/store/directory'

/**
 * list of works component
 *
 * @module views/WorksList
 */
export default {
  name: 'WorksList',
  beforeCreate () {
    // this.$store.dispatch(actions.loadWorks)
  },
  computed: {
    // ...mapGetters(['works'])
    ...mapGetters([n.getters.directory_works, n.getters.directory_modules]),
    works () {
      const works = Object.values(this[n.getters.directory_works])
      // console.log(works)
      return works.sort(workSorter)
    }
  },
  methods: {
    getLink (id) {
      return { name: 'Schreibtisch', params: { id } }
    },
    moduleLabel (module) {
      const modules = this[n.getters.directory_modules]
      // console.log(module, modules[module]?.label)
      return modules[module]?.label || '[?]'
    },
    moduleTitel (module) {
      const modules = this[n.getters.directory_modules]
      // console.log(module, modules[module]?.label)
      return modules[module]?.title || ('[?]' + module)
    },
    moduleURL (module) {
      const modules = this[n.getters.directory_modules]
      // console.log(module, modules[module]?.url)
      return modules[module]?.url || '[?]'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1 {
  margin: 2rem;
}
#worksList {
  margin: 0 3rem 0;
  width: calc(100% - 6rem);
}
.works-table {
  max-width: 80rem;
  margin: 2rem auto;
  .table {
    width: 100%;
  }
}
</style>
