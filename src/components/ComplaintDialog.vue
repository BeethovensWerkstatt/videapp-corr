<template>
  <div class="dialog" :class="{ 'inactive': !this.active }" :style="styles">
    <div id="body" v-if="active">
      <div class="title">{{ toRoman(activeComplaint.movement.n) }}. {{ activeComplaint.movement.label }}, {{ activeComplaint.label }}</div>
      <div class="measures">
        Takte: {{ measures }} (<a :href="activeComplaint['@id']" target="_blank">link</a>)
      </div>
      <hr>
      <div class="loading" v-if="activeComplaint.loading">Lade {{ activeComplaint.label }}</div>
      <div class="tabview" v-else>
        <complaint-dialog-tab-row
          v-for="(row,i) in docMap"
          :key="i"
          :row="row"
          :select="select"
          :colStyles="colStyles"
        >
        </complaint-dialog-tab-row>
      </div>
    </div>
    <div id="select">
      <div @click="toggleAnte" :class="{ TSactive: select.ante }" class="TSbutton">ANTE</div>
      <div @click="toggleRvsn" :class="{ TSactive: select.rvsn }" class="TSbutton">RVSN</div>
      <div @click="togglePost" :class="{ TSactive: select.post }" class="TSbutton">POST</div>
      &nbsp;
      <div @click="toggleFacs" :class="{ TSactive: select.facs }" class="TSbutton">FACS</div>
      <div @click="toggleTrns" :class="{ TSactive: select.trns }" class="TSbutton">DIPL</div>
      <div @click="toggleText" :class="{ TSactive: select.text }" class="TSbutton">TEXT</div>
      <div @click="toggleAnno" :class="{ TSactive: select.anno }" class="TSbutton">ANNO</div>
    </div>
    <div id="close">
      <btn @click.prevent="closeDialog">{{ $t('terms.close') }}</btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { actions } from '@/store/names'
// import VerovioComponent from '@/components/VerovioComponent.vue'
import toolbox from '@/toolbox'
import ComplaintDialogTabRow from '@/components/ComplaintDialog/TabRow.vue'

/**
 * Complaint dialog component
 *
 * @module components/ComplaintDialog
 * @vue-data {Object} select - flags what to display: ante, rvsn, post, facs, trns, text, anno
 * @vue-computed {String} activeComplaintId - id of selected complaint
 * @vue-computed {Object} activeComplaint - selected complaint object
 * @vue-computed {Boolean} active - if dialog is opened
 * @vue-computed {Object} styles - calculated height from `window.innerheight`
 * @vue-computed {String} measures - indicator for affected measures
 * @vue-computed {Object} docMap - elemnts to display by row (ante, revision, post)
 * @vue-computed {Number} tabWidth - width of table
 * @vue-computed {Number} colCount - number of selected columns (ant, revision, post)
 * @vue-computed {Object} colStyles - styles for all columns: width = tabWidth / colCount
 */
export default {
  components: { ComplaintDialogTabRow },
  name: 'ComplaintDialog',
  props: {
  },
  data () {
    return {
      innerHeight: window.innerHeight,
      select: this.$store.getters.complaintDisplaySelect
    }
  },
  mounted () {
    window.addEventListener('resize', this.resize)
  },
  watch: {
    tabWidth () {
      console.log(this.tabWidth)
    },
    styles () {
      console.log(this.innerHeight)
    }
  },
  computed: {
    ...mapGetters(['activeComplaintId', 'activeComplaint']),
    active () {
      if (this.activeComplaintId) {
        return true
      }
      return false
    },
    styles () {
      return {
        height: 'calc(' + this.innerHeight + 'px - 2rem)'
      }
    },
    measures () {
      const complaint = this.activeComplaint
      if (complaint.affects?.length > 0) {
        return complaint.affects[0].measures.label
      }
      return ''
    },
    docMap () {
      // console.log('complaint', this.activeComplaint)
      const ante = this.statusDocs('ante')
      const revision = this.statusDocs('revision')
      const post = this.statusDocs('post')
      const len = Math.max(ante.length, revision.length, post.length)
      // console.log(len, ante, revision, post)
      const map = []
      for (let i = 0; i < len; i++) {
        const row = {}
        row.ante = i < ante.length ? ante[i] : {}
        row.revision = i < revision.length ? revision[i] : {}
        row.post = i < post.length ? post[i] : {}
        // console.log(row)
        map.push(row)
      }
      // console.log(map)
      return map
    },
    tabWidth () {
      if (this.$el) {
        const el = this.$el.querySelector('.tabview')
        // console.log(el?.innerWidth, this.$el)
        return el?.innerWidth > 0 ? el.innerWidth : this.$el.innerWidth
      }
      return 400
    },
    colCount () {
      let cnt = 0
      if (this.select.ante) {
        cnt++
      }
      if (this.select.rvsn) {
        cnt++
      }
      if (this.select.post) {
        cnt++
      }
      return Math.max(1, cnt)
    },
    colStyles () {
      const mw = (this.tabWidth / this.colCount)
      // console.log(this.tabWidth, this.colCount, mw)
      const styles = {
        'max-width': mw + 'px'
      }
      // console.log(styles)
      return styles
    }
  },
  methods: {
    toRoman (num) {
      return toolbox.toRoman(num)
    },
    /**
     * create array of objects `[{ mei: { url }}, { img: { url } }, ...]`
     *
     * @todo get width/resolution for facsimile
     *
     * @param {String} status - one of `'ante'`, `'revision'` and `'post'`
     */
    statusDocs (status) {
      const docs = []
      // console.log(textStatus)
      let textStatus, textTrans
      switch (status) {
        case 'ante':
          textStatus = this.activeComplaint.anteDocs
          textTrans = this.activeComplaint.text.ante
          break
        case 'revision':
          textStatus = this.activeComplaint.revisionDocs
          break
        case 'post':
          textStatus = this.activeComplaint.postDocs
          textTrans = this.activeComplaint.text.post
          break
      }
      if (textStatus) {
        textStatus.forEach(stat => {
          // console.log(stat.iiif[0]?.on.full)
          docs.push({
            img: {
              // TODO scaling? NO goto OSD
              url: stat.iiif[0]?.target.selector[0]['@id'],
              page: stat.iiif[0]?.on.full,
              region: stat.iiif[0]?.on.selector.value,
              label: 'Sigel / Datum'
            }
          })
          // TODO where is the right MEI
          docs.push({
            mei: {
              url: stat.mei,
              trans: 'dipl',
              label: 'Annot. Transkript.'
            }
          })
          docs.push({
            mei: {
              url: textTrans,
              trans: 'clear',
              label: 'Cleartext'
            }
          })
          // TODO we need the complaint text here
          docs.push({
            anno: '<p>Erklärungen und Anmerkungen</p>'
          })
        })
      }
      return docs
    },
    /**
     * close this dialog
     */
    closeDialog (e) {
      this.$store.dispatch(actions.activateComplaint, null)
    },
    /**
     * toggle visibility of ante docs
     */
    toggleAnte (e) {
      const select = { ...this.select }
      // avoid empty selection
      if (!select.rvsn && !select.post) {
        select.rvsn = true
      }
      select.ante = !select.ante
      this.select = select
    },
    /**
     * toggle visibility of revision
     */
    toggleRvsn (e) {
      const select = { ...this.select }
      // avoid empty selection
      if (!select.ante && !select.post) {
        select.post = true
      }
      select.rvsn = !select.rvsn
      this.select = select
    },
    /**
     * toggle visibility of post docs
     */
    togglePost (e) {
      const select = { ...this.select }
      // avoid empty selection
      if (!select.rvsn && !select.ante) {
        select.ante = true
      }
      select.post = !select.post
      this.select = select
    },
    /**
     * toggle visibility of facsimiles
     */
    toggleFacs (e) {
      // avoid empty selection ...
      this.select = { ...this.select, facs: !this.select.facs }
    },
    /**
     * toggle visibility of transcriptions
     */
    toggleTrns (e) {
      this.select = { ...this.select, trns: !this.select.trns }
    },
    /**
     * toggle visibility of cleartext
     */
    toggleText (e) {
      this.select = { ...this.select, text: !this.select.text }
    },
    /**
     * toggle visibility of annotation text
     */
    toggleAnno (e) {
      this.select = { ...this.select, anno: !this.select.anno }
    },
    resize () {
      console.log('resize dialog')
      this.innerHeight = window.innerHeight
    }
  }
}
</script>

<style lang="scss" scoped>

.inactive {
  display: none;
}

.dialog {
  position: absolute;
  left: 1rem;
  top: 1rem;
  // TODO ??
  width: calc(100% - 17rem);
  height: calc(100% - 2rem);
  border-radius: 5pt;
  background-color: white;
  border: 1px solid black;

  #body {
    width: 100%;
    height: 100%;
    overflow: scroll;
    .title {
      font-weight: bold;
      font-size: 110%;
      margin-top: 3pt;
    }
    .measures {
      font-size: 90%;
    }

    .tabview {
      display: table;
      width: calc(100% - 10pt);
      margin: 5pt;
    }
  }
  #close {
    position: absolute;
    top: 1em;
    right: 1em;
  }
  #select {
    display: inline-block;
    position: absolute;
    top: 1em;
    left: 1em;

    .TSbutton {
      display: inline-block;
      width: 3em;
      border: 1px solid gray;
      background-color: rgb(146, 118, 118);
      border-radius: 5pt;
    }
    .TSactive {
      background-color: lightgreen;
    }
    .dash {
      display: inline-block;
      input {
        width: 4em;
      }
    }
  }
}

</style>
