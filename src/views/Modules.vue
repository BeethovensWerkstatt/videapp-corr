<template>
  <div class="modules">
    <h1>Module</h1>
    <div class="module columns" v-for="mod in modules" :key="mod.n" :class="{ inactive: mod.inactive }">
      <div class="column col-3">
        <h2>{{ mod.label }}</h2>
      </div>
      <div class="info column col-9">
        <h3>{{ mod.title }}</h3>
        <div v-if="mod.n === 1">
          Über Modul 1
        </div>
        <div v-if="mod.n === 2">
          Über Modul 2
        </div>
        <div v-if="mod.n === 3">
          <router-link :to="{ name: 'Monita' }">Monita-Liste</router-link>
        </div>
        <div v-if="mod.n === 4">
          Über Modul 4
        </div>
        <div v-if="mod.n === 5">
          Über Modul 5
        </div>
        <div>
          <a :href="mod.url" target="_blank">mehr</a>
        </div>
        <div>
          <span v-for="(w, i) in module_works(mod)" :key="i">
            <template v-if="i > 0">, </template>
            <router-link v-if="w.route" :to="{ name: w.route, params: { id: w.id } }" target="_blank" :title="w.title">{{ w.label }}</router-link>
            <a v-else :href="w.app" target="_blank" :title="w.title">{{ w.label }}</a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import n from '@/store/names'

export default {
  name: 'Modules',
  computed: {
    ...mapGetters([n.getters.directory_modules, n.getters.directory_get_work]),
    modules () {
      const mods = this[n.getters.directory_modules]
      return mods
    },
    get_work () {
      const works = this[n.getters.directory_get_work]
      return (key) => {
        const work = works(key) || { label: key, title: '[?]' }
        console.log('get work', key, work)
        return work
      }
    }
  },
  methods: {
    module_works (module) {
      if (module.works) {
        const works = module.works.map(w => this.get_work(w))
        return works.sort((w1, w2) => {
          if (w1.opus && w2.opus) {
            if (w1.opus < w2.opus) return -1
            if (w1.opus > w2.opus) return 1
            if (w1.opus === w2.opus) return 0
          }
          if (w1.woo && w2.woo) {
            if (w1.woo < w2.woo) return -1
            if (w1.woo > w2.woo) return 1
            if (w1.woo === w2.woo) return 0
          }
          if (w1.opus && w2.woo) return -1
          if (w1.woo && w2.opus) return 1
        })
      }
      return []
    }
  }
}
</script>

<style lang="scss" scoped>
.modules {
  h1 {
    max-width: 80rem;
    margin: 2rem auto;
    // outline: 1px solid gray;
    // border-radius: 15px;
  }

  .module {
    max-width: 80rem;
    margin: auto;
    text-align: left;
  }

  .inactive {
    pointer-events: none;
    cursor: default;
    text-decoration: none;
    color: gray;
  }
}
</style>
