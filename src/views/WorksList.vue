<template>
  <div class="workslist">
    <h1>Werkliste</h1>
    <p>
      <table id="worksList" class="table">
        <thead>
          <tr>
            <!-- <th>Komponist</th> -->
            <th>Werk</th>
            <th>Modul</th>
            <!-- <th>Sonstwas</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="work in works" :key="work['@id']">
            <!-- <td><a :href="work.composer['@id']">{{ work.composer.name }}</a></td> -->
            <td><router-link :to="getLink(work.id)">{{ work.label }}: {{ work.title /*[0].title*/ }}</router-link></td>
            <td><!-- Modul 3 -->{{ work.modules.join(', ') }}</td>
            <!-- <td><router-link :to="getLink(work.id)">Link</router-link></td> -->
          </tr>
        </tbody>
      </table>
    </p>
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
    ...mapGetters([n.getters.directory_works]),
    works () { return this[n.getters.directory_works] }
  },
  methods: {
    getLink (id) {
      return { name: 'Schreibtisch', params: { id } }
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
</style>
