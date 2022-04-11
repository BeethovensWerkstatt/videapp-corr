<template>
  <div class="workslist">
    <h1>{{ $tc('terms.case-study', 2) }}</h1>
    <div class="works-table">
      <table id="worksList" class="table table-striped table-hover">
        <thead>
          <tr>
            <th>{{ $t('terms.opus') }}</th>
            <th>{{ $tc('terms.work', 1) }}</th>
            <th>{{ $t('terms.software') }}</th>
            <th>{{ $tc('terms.explanatory', 2) }}</th>
            <th>{{ $tc('terms.module', 1) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="work in works" :key="work['@id']">
            <td class="opusNumber">
              {{ work.label }}
            </td>
            <td class="workTitle">
              {{ work.title }}
            </td>
            <td class="appLink">
              <router-link class="workPill internal" :to="getLink(work)" v-if="work.route">
                <span v-html="appTitle(work)" />
              </router-link>
              <a :href="work.app" class="workPill external" target="_blank" v-else-if="work.app">
                <span v-html="appTitle(work)" /> <i class="icon icon-share"></i>
              </a>
              <span class="nofile" v-else>&mdash;</span>
            </td>
            <td class="dossierLink">
              <a :href="work.dossier" target="_blank" v-if="work.dossier" :title="work.dossiertitle">
                <span class="textPill"><document-symbol height="1rem" /></span>
              </a>
              <span class="nofile" v-else>&mdash;</span>
            </td>
            <td class="moduleLink">
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
import DocumentSymbol from '@/components/symbols/DocumentSymbol.vue'

const VideAppRE = /VideApp *(\w+)/i

/**
 * list of works component
 *
 * @module views/WorksList
 */
export default {
  name: 'WorksList',
  components: {
    DocumentSymbol
  },
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
    getLink (work) {
      return { name: work.route, params: { id: work.id } }
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
    },
    appTitle (work) {
      const m = VideAppRE.exec(work.apptitle || '')
      if (m) {
        return 'VideApp<sub>' + m[1] + '</sub>'
      }
      return work.apptitle || '[?]'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "@/scss/variables.scss";

a:hover, a:visited, a:active {
  text-decoration: none;
  color: darken($web-color,10%);
}

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

    td {
      padding: .2rem .4rem;
    }

    .opusNumber {
      font-weight: bold;
    }
    .workTitle {

    }
    .appLink {
      font-weight: bold;

      .workPill {
        border: .5px solid $border-color;
        border-radius: .3rem;
        background-color: $background-flat;
        background: linear-gradient(180deg, lighten($background-flat, 10%) 0%, darken($background-flat, 5%) 100%);
        padding: .05rem .5rem;
        margin: 0 .5rem .5rem 0;
        font-weight: bold;

        &:hover {
          background: linear-gradient(180deg, $background-flat 0%, darken($background-flat, 15%) 100%);
        }

        &.internal {
          font-weight: 500;
        }

        &.external {
          color: darken(desaturate($web-color,20%),5%);
          font-weight: 500;

          i {
            margin-left: .2rem;
            font-size: 70%;
          }
        }
      }
    }
    .dossierLink {
      .textPill {
        border: .5px solid $border-color;
        border-radius: .3rem;
        background-color: $background-flat;
        background: linear-gradient(180deg, lighten($background-flat, 10%) 0%, darken($background-flat, 5%) 100%);
        padding: .05rem .4rem .05rem 0;
        margin: 0;
        font-weight: bold;

        & > * {
          position: relative;
          top: 2px;
        }

        &:hover {
          background: linear-gradient(180deg, $background-flat 0%, darken($background-flat, 15%) 100%);
        }
      }
    }
    .moduleLink {

    }
  }
}
.nofile {
  color: lightgray;
}
</style>
