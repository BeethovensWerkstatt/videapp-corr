<template>
  <div class="workslist">
    <h1>Werkliste</h1>
    <div class="works-table">
      <table id="worksList" class="table">
        <thead>
          <tr>
            <!-- <th>Komponist</th> -->
            <th>{{ $t('terms.opus') }}</th>
            <th>{{ $tc('terms.work', 1) }}</th>
            <th>{{ $tc('terms.module', 2) }}</th>
            <!-- <th>Sonstwas</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="work in works" :key="work['@id']">
            <!-- <td><a :href="work.composer['@id']">{{ work.composer.name }}</a></td> -->
            <td><router-link :to="getLink(work.id)">{{ work.label }}</router-link></td>
            <td><router-link :to="getLink(work.id)">{{ work.title /*[0].title*/ }}</router-link></td>
            <td>
              <span v-for="(module, i) in work.modules" :key="module">
                <template v-if="i > 0">, </template>
                <a :href="moduleURL(module)" target="_blank" :title="module">{{ moduleLabel(module) }}</a>
              </span>
            </td>
            <!-- <td><router-link :to="getLink(work.id)">Link</router-link></td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import n from '@/store/names'

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
      return works.sort((w1, w2) => {
        if (w1.opus && w2.opus) {
          if (w1.opus < w2.opus) {
            return -1
          }
          if (w1.opus > w2.opus) {
            return 1
          }
          // this shouldn't happen!
          if (w1.opus === w2.opus) {
            return w1.title.localeCompare(w2.title)
          }
        }
        if (w1.opus || w1.opus) {
          return w1.opus ? -1 : 1
        }
      })
    }
  },
  methods: {
    getLink (id) {
      return { name: 'Schreibtisch', params: { id } }
    },
    moduleLabel (module) {
      const modules = this[n.getters.directory_modules]
      console.log(module, modules[module]?.label)
      return modules[module]?.label || '[?]'
    },
    moduleURL (module) {
      const modules = this[n.getters.directory_modules]
      console.log(module, modules[module]?.url)
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
