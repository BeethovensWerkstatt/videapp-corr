<template>
  <div class="source-info">
    <strong>Source Information</strong>
    <div>
      <select @change="changeSource" :value="$store.getters.activeSource ? $store.getters.activeSource.id : ''">
        <option key="---none---" value="">--- select source ---</option>
        <option
          v-for="src in $store.getters.sources"
          :key="src.id"
          :value="src.id"
        >
          {{ src.label }}
        </option>
      </select>
      <table width="100%" v-if="this.$store.getters.activeSource">
        <tr><td colspan="2"><hr /></td></tr>
        <tr><td>Titel:</td><td class="smaller">{{ title }}</td></tr>
        <tr><td>Seiten:</td><td>{{ pagecount }} <span v-if="this.source" class="smaller"> [{{ first_label }} &ndash; {{ last_label }}]</span></td></tr>
        <tr><td colspan="2"><hr /></td></tr>
        <tr><td>Verso:</td><td>{{ verso_label }}</td></tr>
        <tr><td>Recto:</td><td>{{ recto_label }}</td></tr>
        <tr><td>Position:</td><td>{{ position }}</td></tr>
      </table>
    </div>
    <div v-if="this.$store.getters.activeSource">
      <hr />
      <btn-group>
        <btn
          @click="prevPage"
          :disabled="!hasPrev"
        >
          ◄
        </btn>
        <btn
          @click="nextPage"
          :disabled="!hasNext"
        >
          ►
        </btn>
        <btn disabled="true">&nbsp;</btn>
        <btn @click.prevent="clearInfo">close</btn>
      </btn-group>
    </div>
  </div>
</template>

<script>
/**
 * Display information about current selected/activated source and
 * its display state (displayed page).
 *
 * @vue-computed source {Object} - selected source object
 * @vue-computed activePage {Number} - index of the displayed verso-recto page pair.
 * @vue-computed title {String} - title of the source
 * @vue-computed pagecount {Number} - number of pages available for this source
 * @vue-computed verso_label {String} - label of left/verso page
 * @vue-computed recto_label {String} - label of right/recto page
 * @vue-computed first_label {String} - label of first available page
 * @vue-computed last_label {String} - label of last available page
 */
export default {
  name: 'SourceInfo',
  computed: {
    source () {
      return this.$store.getters.activeSource
    },
    activePage () {
      if (this.$store.getters.activeSource) {
        return this.$store.getters.activeSource.component.pagenr
      }
      return 0
    },
    title () {
      if (this.source) {
        return this.source.label
      }
      return '---'
    },
    pagecount () {
      if (this.source) {
        var pc = 0
        this.source.pages.forEach(page => {
          if (page.v) pc++
          if (page.r) pc++
        })
        return pc
      }
      return '---'
    },
    verso_label () {
      if (this.$store.getters.activeSource) {
        return this.$store.getters.activeSource.component.left_label
      }
      return '---'
    },
    recto_label () {
      if (this.$store.getters.activeSourceFacs) {
        return this.$store.getters.activeSourceFacs.right_label
      }
      return '---'
    },
    first_label () {
      if (this.source) {
        if (this.source.pages[0].v) {
          return this.source.pages[0].v.label
        }
        return this.source.pages[0].r.label
      }
      return ''
    },
    last_label () {
      if (this.source) {
        const lp = this.source.pages.length - 1
        if (this.source.pages[lp].r) {
          return this.source.pages[lp].r.label
        }
        return this.source.pages[lp].v.label
      }
      return ''
    },
    hasPrev () {
      const sf = this.$store.getters.activeSource.component
      return sf && sf.hasPrev
    },
    hasNext () {
      const sf = this.$store.getters.activeSource.component
      return sf && sf.hasNext
    },
    position () {
      const sf = this.$store.getters.activeSource.component
      if (sf) {
        return sf.position.x.toFixed(2) + ' / ' + sf.position.y.toFixed(2)
      }
      return '---'
    }
  },
  methods: {
    prevPage () {
      const sf = this.$store.getters.activeSource.component
      return sf && sf.prevPage()
    },
    nextPage () {
      const sf = this.$store.getters.activeSource.component
      return sf && sf.nextPage()
    },
    /**
     * unselect source / reset component
     */
    clearInfo () {
      this.$store.commit('ACTIVATE_SOURCE', null)
    },
    /**
     * change selected source
     */
    changeSource (e) {
      if (e.target.value === '') {
        this.clearInfo()
      } else {
        this.$store.getters.sources.forEach(source => {
          if (source.id === e.target.value) {
            this.$store.commit('ACTIVATE_SOURCE', source.id)
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.source-info {
  padding: 8pt;
  text-align: left;
}
.smaller {
  font-size: 80%;
}
</style>
