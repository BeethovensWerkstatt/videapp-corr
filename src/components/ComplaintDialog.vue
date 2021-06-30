<template>
  <div class="dialog" :class="{ 'inactive': !this.active }" :styles="styles">
    <div id="body" v-if="active">
      <div class="title">{{ toRoman(activeComplaint.movement.n) }}. {{ activeComplaint.movement.label }}, {{ activeComplaint.label }}</div>
      <div class="measures">
        Takte: {{ measures }} (<a :href="activeComplaint['@id']" target="_blank">link</a>)
      </div>
      <hr>
      <div class="loading" v-if="activeComplaint.loading">Lade {{ activeComplaint.label }}</div>
      <div class="tabview" v-else>
        <div class="tabrow" v-for="(row,i) in docMap" :key="i">
          <div class="tabcol" v-if="row.ante && selectAnte" :style="colStyles">
            <h2 v-if="row.ante.img && selectFacs">{{ initialDocLabel(row) }}</h2>
            <div class="docimg" v-if="selectFacs && row.ante.img && row.ante.img.url">
              <img :src="row.ante.img.url" :style="{ width: '100%' }" />
            </div>
            <h2 v-if="vrvValid(row.ante.mei)">{{ initialTextLabel(row) }}</h2>
            <verovio-component
              id="ante"
              :options="row.ante.mei"
              v-if="vrvValid(row.ante.mei)"
            />
            <h2 v-if="row.ante.annot && selectAnno">Annotationen</h2>
            <div v-if="row.ante.annot && selectAnno" v-html="row.ante.annot"/>
          </div>
          <div class="tabcol" v-if="row.revision && selectRvsn" :style="colStyles">
            <h2 v-if="row.revision.img && selectFacs">{{ revisionDocLabel(row) }}</h2>
            <div class="docimg" v-if="selectFacs && row.revision.img && row.revision.img.url">
              <img :src="row.revision.img.url" :style="{ width: '100%' }" />
            </div>
            <h2 v-if="vrvValid(row.revision.mei)">{{ revisionTextLabel(row) }}</h2>
            <verovio-component
              id="revision"
              :options="row.revision.mei"
              v-if="vrvValid(row.revision.mei)"
            />
            <h2 v-if="row.revision.annot && selectAnno">Annotationen</h2>
            <div v-if="row.revision.annot && selectAnno" v-html="row.ante.annot"/>
          </div>
          <div class="tabcol" v-if="row.post && selectPost" :style="colStyles">
            <h2 v-if="row.post.img && selectFacs">{{ revisedDocLabel(row) }}</h2>
            <div class="docimg" v-if="selectFacs && row.post.img && row.post.img.url">
              <img :src="row.post.img.url" :style="{ width: '100%' }" />
            </div>
            <h2 v-if="vrvValid(row.post.mei)">{{ revisedTextLabel(row) }}</h2>
            <verovio-component
              id="post"
              :options="row.post.mei"
              v-if="vrvValid(row.post.mei)"
            />
            <h2 v-if="row.post.annot && selectAnno">Annotationen</h2>
            <div v-if="row.post.annot && selectAnno" v-html="row.post.annot"/>
          </div>
        </div>
      </div>
    </div>
    <div id="select">
      <div @click="toggleAnte" :class="{ TSactive: selectAnte }" class="TSbutton">ANTE</div>
      <div @click="toggleRvsn" :class="{ TSactive: selectRvsn }" class="TSbutton">RVSN</div>
      <div @click="togglePost" :class="{ TSactive: selectPost }" class="TSbutton">POST</div>
      &nbsp;
      <div @click="toggleFacs" :class="{ TSactive: selectFacs }" class="TSbutton">FACS</div>
      <div @click="toggleTrns" :class="{ TSactive: selectTrns }" class="TSbutton">DIPL</div>
      <div @click="toggleText" :class="{ TSactive: selectText }" class="TSbutton">TEXT</div>
      <div @click="toggleAnno" :class="{ TSactive: selectAnno }" class="TSbutton">ANNO</div>
      &nbsp;
      <div class="dash">
        <input id="verovio-zoom" type="range" min="5" max="100" class="slider" v-model="vzoom" />
      </div>
    </div>
    <div id="close">
      <btn @click.prevent="closeDialog">{{ $t('terms.close') }}</btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { actions } from '@/store/names'
import VerovioComponent from '@/components/VerovioComponent.vue'
import toolbox from '@/toolbox'

/**
 * Complaint dialog component
 *
 * @module components/ComplaintDialog
 * @vue-computed {String} activeComplaintId - id of selected complaint
 * @vue-computed {Object} activeComplaint - selected complaint object
 * @vue-computed {boolean} active - if dialog is opened
 * @vue-computed {String} initialDocLabel - label for initial document
 * @vue-computed {String} revisionDocLabel - label for revision document
 * @vue-computed {String} revisedDocLabel - label for revised docuemnt
 * @vue-computed {String} initialTextLabel - label for initial text
 * @vue-computed {String} revisionTextLabel - label for revision text
 * @vue-computed {String} revisedTextLabel - label for revised text
 * @vue-computed {String} measures - indicator for affected measures
 */
export default {
  components: { VerovioComponent },
  name: 'ComplaintDialog',
  props: {
  },
  data () {
    return {
      selectAnte: true,
      selectRvsn: true,
      selectPost: true,
      selectFacs: true,
      selectTrns: true,
      selectText: true,
      selectAnno: true,
      zoom: 30
    }
  },
  watch: {
    tabWidth () {
      console.log(this.tabWidth)
    }
  },
  computed: {
    ...mapGetters(['activeComplaintId', 'activeComplaint']),
    vzoom: {
      get () {
        return parseInt(this.zoom)
      },
      set (zoom) {
        this.zoom = parseInt(zoom)
      }
    },
    active () {
      if (this.activeComplaintId) {
        return true
      }
      return false
    },
    styles () {
      return {
        height: 'calc(' + window.innerHeight + 'px - 2rem)'
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
      const ante = this.statusDocs(this.activeComplaint?.anteDocs)
      const revision = this.statusDocs(this.activeComplaint?.revisionDocs)
      const post = this.statusDocs(this.activeComplaint?.postDocs)
      const len = Math.max(ante.length, revision.length, post.length)
      // console.log(len, ante, revision, post)
      const map = []
      for (let i = 0; i < len; i++) {
        const row = {}
        row.ante = i < ante.length ? ante[i] : {}
        row.revision = i < revision.length ? revision[i] : {}
        row.post = i < post.length ? post[i] : {}
        console.log(row)
        map.push(row)
      }
      // console.log(map)
      return map
    },
    tabWidth () {
      if (this.$el) {
        const el = this.$el.querySelector('.tabview')
        console.log(el?.innerWidth, this.$el)
        return el?.innerWidth > 0 ? el.innerWidth : this.$el.innerWidth
      }
      return 400
    },
    colCount () {
      let cnt = 0
      if (this.selectAnte) {
        cnt++
      }
      if (this.selectRvsn) {
        cnt++
      }
      if (this.selectPost) {
        cnt++
      }
      return Math.max(1, cnt)
    },
    colStyles () {
      const mw = (this.tabWidth / this.colCount)
      console.log(this.tabWidth, this.colCount, mw)
      const styles = {
        'max-width': mw + 'px'
      }
      console.log(styles)
      return styles
    }
  },
  methods: {
    toRoman (num) {
      return toolbox.toRoman(num)
    },
    initialDocLabel (row) {
      return row.ante?.img?.label
        ? row.ante.img.label
        : this.$t('terms.complaint.state.anteDoc')
    },
    revisionDocLabel (row) {
      return row.revision?.img?.label
        ? row.revision.img.label
        : this.$t('terms.complaint.state.revisionDoc')
    },
    revisedDocLabel (row) {
      return row.post?.img?.label
        ? row.post.img.label
        : this.$t('terms.complaint.state.postDoc')
    },
    initialTextLabel (row) {
      if (row.ante?.mei?.label) {
        return row.ante.mei.label
      }
      return this.$t('terms.complaint.state.anteText')
    },
    revisionTextLabel (row) {
      if (row.revision?.mei?.label) {
        return row.revision.mei.label
      }
      return this.$t('terms.complaint.state.revisionText')
    },
    revisedTextLabel (row) {
      if (row.post?.mei?.label) {
        return row.post.mei.label
      }
      return this.$t('terms.complaint.state.postText')
    },
    /**
     * normalize textStatus -- one of `anteDocs`, `revisionDocs` and `postDocs`--
     * to an array of objects `{ mei: { url }, img: { url } }`
     *
     * (TODO width/resolution)
     */
    statusDocs (textStatus) {
      const docs = []
      // console.log(textStatus)
      if (textStatus) {
        textStatus.forEach(stat => {
          docs.push({
            img: {
              url: stat.iiif[0]?.target.selector[0]['@id'],
              label: 'Sigel / Datum'
            }
          })
          docs.push({
            mei: {
              url: stat.mei,
              scale: this.vzoom,
              trans: 'dipl',
              label: 'Annot. Transkript.'
            }
          })
          docs.push({
            mei: {
              url: stat.mei,
              scale: this.vzoom,
              trans: 'clear',
              label: 'Cleartext'
            }
          })
          docs.push({
            annot: '<p>Erklärungen und Anmerkungen</p>'
          })
        })
      }
      return docs
    },
    /**
     * check if options are valid
     */
    vrvValid (options) {
      const valid = (options && options.url && options.url.length > 0)
      // console.log(options, valid)
      return valid && ((this.selectText && options.trans === 'clear') || (this.selectTrns && options.trans === 'dipl'))
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
      // avoid empty selection
      if (!this.selectRvsn && !this.selectPost) {
        this.selectRvsn = true
      }
      this.selectAnte = !this.selectAnte
    },
    /**
     * toggle visibility of revision
     */
    toggleRvsn (e) {
      // avoid empty selection
      if (!this.selectAnte && !this.selectPost) {
        this.selectPost = true
      }
      this.selectRvsn = !this.selectRvsn
    },
    /**
     * toggle visibility of post docs
     */
    togglePost (e) {
      // avoid empty selection
      if (!this.selectRvsn && !this.selectAnte) {
        this.selectAnte = true
      }
      this.selectPost = !this.selectPost
    },
    /**
     * toggle visibility of post docs
     */
    toggleFacs (e) {
      // avoid empty selection ...
      this.selectFacs = !this.selectFacs
    },
    /**
     * toggle visibility of post docs
     */
    toggleTrns (e) {
      // avoid empty selection ...
      this.selectTrns = !this.selectTrns
    },
    /**
     * toggle visibility of post docs
     */
    toggleText (e) {
      // avoid empty selection ...
      this.selectText = !this.selectText
    },
    /**
     * toggle visibility of post docs
     */
    toggleAnno (e) {
      // avoid empty selection ...
      this.selectAnno = !this.selectAnno
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
      .tabrow {
        display: table-row;
        max-width: 100%;
        .tabcol {
          width: 33%;
          overflow: scroll;
          resize: vertical;
          display: table-cell;
          overflow: scroll;
          vertical-align: top;
          padding: 3pt;
          img {
            width: 100%;
          }
        }
      }
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
