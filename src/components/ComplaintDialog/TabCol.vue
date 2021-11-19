<template>
  <div class="tabcol" :style="styles">
    <tab-col-facs
      v-if="facsPage"
      :label="facsLabel"
      :pageId="facsPage"
      :region="facsRegion"
      :state="state"
    />
    <tab-col-verovio
      v-if="transOptions"
      :options="transOptions"
      :label="transLabel"
      :divid="state + 'trans'"
      :state="state"
      layer="trans"
    />
    <tab-col-verovio
      v-if="textOptions"
      :options="textOptions"
      :label="textLabel"
      :divid="state + 'text'"
      :state="state"
      layer="text"
    />
    <tab-col-anno
      v-if="anno"
      :anno="anno"
      :tags="tags"
      :state="state"
    />
  </div>
</template>

<script>
import TabColAnno from './TabColAnno.vue'
import TabColFacs from './TabColFacs.vue'
import TabColVerovio from './TabColVerovio.vue'

// translate text state labels to i18n tags
const labels = {
  facs: {
    ante: 'terms.complaint.state.anteDoc',
    revision: 'terms.complaint.state.revisionDoc',
    post: 'terms.complaint.state.postDoc'
  },
  trans: {
    ante: 'terms.transcript.annot', // 'terms.complaint.state.anteTrans',
    revision: 'terms.transcript.annot', // 'terms.complaint.state.revisionTrans',
    post: 'terms.transcript.annot' // 'terms.complaint.state.postTrans'
  },
  text: {
    ante: 'terms.complaint.state.anteText',
    revision: 'terms.complaint.state.revisionText',
    post: 'terms.complaint.state.postText'
  }
}

/**
 * @module components/ComplaintDialog/TabCol
 * @vue-prop {Object} row - the table row with columns for ante, revision and post
 * @vue-prop {String} state - text state - one of `ante`, `revision` and `post`
 * @vue-prop {Object} styles - styles for this column (width)
 * @vue-prop {Object} select - flags what to display: ante, rvsn, post, facs, trns, text, anno
 * @vue-computed {String} facsLabel - label/title for facsimile or undefined
 * @vue-computed {String} facsPage - page id
 * @vue-computed {String} facsRegion - facsimile region (iiif)
 * @vue-computed {Object} transOptions - options for transcription MEI or undefined
 * @vue-computed {String} transLabel - label/title for transcription MEI or undefined
 * @vue-computed {Object} textOptions - options for cleartext MEI or undefined
 * @vue-computed {String} textLabel - label/title for cleartext MEI or undefined
 * @vue-computed {String} anno - text/html of annotation or undefined
 */
export default {
  components: { TabColFacs, TabColVerovio, TabColAnno },
  name: 'ComplaintDialogTabCol',
  props: {
    row: {
      type: Object,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    styles: {
      type: Object,
      required: true
    },
    select: {
      type: Object,
      required: true
    }
  },
  computed: {
    facsLabel () {
      let label = this.row[this.state]?.img?.label
      // console.log(label)
      if (!label) {
        const labeltag = labels.facs[this.state] ? labels.facs[this.state] : this.state
        label = this.$t(labeltag)
      }
      return label
    },
    facsPage () {
      if (!this.select.facs) {
        return undefined
      }
      return this.row[this.state]?.img?.page
    },
    facsRegion () {
      return this.row[this.state]?.img?.region
    },
    transOptions () {
      if (this.select.trns && this.row[this.state]?.mei?.trans === 'dipl' && this.row[this.state]?.mei?.url) {
        return this.row[this.state].mei
      }
      return undefined
    },
    transLabel () {
      let label = null // this.row[this.state]?.mei?.label
      // console.log(label)
      if (!label) {
        const labeltag = labels.trans[this.state] ? labels.trans[this.state] : this.state
        label = this.$t(labeltag)
      }
      return label
    },
    textOptions () {
      if (this.select.text && this.row[this.state]?.mei?.trans === 'clear' && this.row[this.state]?.mei?.url) {
        return this.row[this.state].mei
      }
      return undefined
    },
    textLabel () {
      let label = null // this.row[this.state]?.mei?.label
      // console.log(label)
      if (!label) {
        const labeltag = labels.text[this.state] ? labels.text[this.state] : this.state
        label = this.$t(labeltag)
      }
      return label
    },
    tags () {
      // console.log(this.row?.tags)
      return this.row?.tags
    },
    anno () {
      // console.log(this.row[this.state])
      if (this.select.anno && this.row[this.state]?.anno) {
        const temporalDivElement = document.createElement('div')
        temporalDivElement.innerHTML = this.row[this.state].anno ? this.row[this.state]?.anno : '&mdash;'
        let anno = temporalDivElement.textContent || temporalDivElement.innerText || '&mdash;'
        if (typeof anno !== 'string' || anno.trim().length === 0) {
          anno = '&mdash;'
        }
        return anno
      }
      return undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.tabcol {
  width: 33%;
  overflow: scroll;
  display: table-cell;
  overflow: scroll;
  vertical-align: top;
  padding: 3pt;
}
</style>
