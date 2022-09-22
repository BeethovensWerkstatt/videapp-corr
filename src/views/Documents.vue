<template>
  <div class="doclist">
    <h1>Dokumente</h1>
    <table>
      <tr v-for="(doc, i) in documents" :key="'doc-' + i">
        <td>
          <router-link :to="{ name: 'Dokument', params: { id: atId(doc.id) } }">{{ doc.title[0].title }}</router-link>
        </td>
        <td>
          {{ doc.composer.name }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { atId } from '@/toolbox'

export default {
  name: 'Documents',
  computed: {
    ...mapGetters(['documents'])
  },
  methods: {
    atId
  }
}
</script>

<style lang="scss" scoped>
.doclist {
  margin: auto;
  width: auto;

  table {
    width: 800px;
  }
}
</style>
