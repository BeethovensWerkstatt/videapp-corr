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
        <complaint-dialog-tab-row v-for="(row,i) in docMap" :key="i+'x'" :row="row" :select="select">
        </complaint-dialog-tab-row>
        <div class="tabrow" v-for="(row,i) in docMap" :key="i">
          <div class="tabcol" v-if="row.ante && select.ante" :style="colStyles">
            <h2 v-if="row.ante.img && select.facs">{{ initialDocLabel(row) }}</h2>
            <div class="docimg" v-if="select.facs && row.ante.img && row.ante.img.url">
              <img :src="row.ante.img.url" :style="{ width: '100%' }" />
            </div>
            <h2 v-if="vrvValid(row.ante.mei)">{{ initialTextLabel(row) }}</h2>
            <verovio-component
              id="ante"
              :options="row.ante.mei"
              v-if="vrvValid(row.ante.mei)"
            />
            <h2 v-if="row.ante.annot && select.anno">Annotationen</h2>
            <div v-if="row.ante.annot && select.anno" v-html="row.ante.annot"/>
          </div>
          <div class="tabcol" v-if="row.revision && select.rvsn" :style="colStyles">
            <h2 v-if="row.revision.img && select.facs">{{ revisionDocLabel(row) }}</h2>
            <div class="docimg" v-if="select.facs && row.revision.img && row.revision.img.url">
              <img :src="row.revision.img.url" :style="{ width: '100%' }" />
            </div>
            <h2 v-if="vrvValid(row.revision.mei)">{{ revisionTextLabel(row) }}</h2>
            <verovio-component
              id="revision"
              :options="row.revision.mei"
              v-if="vrvValid(row.revision.mei)"
            />
            <h2 v-if="row.revision.annot && select.anno">Annotationen</h2>
            <div v-if="row.revision.annot && select.anno" v-html="row.ante.annot"/>
          </div>
          <div class="tabcol" v-if="row.post && select.post" :style="colStyles">
            <h2 v-if="row.post.img && select.facs">{{ revisedDocLabel(row) }}</h2>
            <div class="docimg" v-if="select.facs && row.post.img && row.post.img.url">
              <img :src="row.post.img.url" :style="{ width: '100%' }" />
            </div>
            <h2 v-if="vrvValid(row.post.mei)">{{ revisedTextLabel(row) }}</h2>
            <verovio-component
              id="post"
              :options="row.post.mei"
              v-if="vrvValid(row.post.mei)"
            />
            <h2 v-if="row.post.annot && select.anno">Annotationen</h2>
            <div v-if="row.post.annot && select.anno" v-html="row.post.annot"/>
          </div>
        </div>
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
import ComplaintDialogTabRow from '@/components/ComplaintDialog/TabRow.vue'

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
  components: { VerovioComponent, ComplaintDialogTabRow },
  name: 'ComplaintDialog',
  props: {
  },
  data () {
    return {
      select: {
        ante: true,
        rvsn: true,
        post: true,
        facs: true,
        trns: true,
        text: true,
        anno: true
      },
      zoom: 30
    }
  },
  watch: {
    tabWidth () {
      console.log(this.tabWidth)
    },
    styles () {
      console.log(window.innerHeight)
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
          docs.push({
            img: {
              url: stat.iiif[0]?.target.selector[0]['@id'],
              label: 'Sigel / Datum'
            }
          })
          // TODO we need different transcriptions here
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
              url: textTrans,
              scale: this.vzoom,
              trans: 'clear',
              label: 'Cleartext'
            }
          })
          // TODO we need the complaint text here
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
      return valid && ((this.select.text && options.trans === 'clear') || (this.select.trns && options.trans === 'dipl'))
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
      if (!this.select.rvsn && !this.select.post) {
        this.select.rvsn = true
      }
      this.select.ante = !this.select.ante
    },
    /**
     * toggle visibility of revision
     */
    toggleRvsn (e) {
      // avoid empty selection
      if (!this.select.ante && !this.select.post) {
        this.select.post = true
      }
      this.select.rvsn = !this.select.rvsn
    },
    /**
     * toggle visibility of post docs
     */
    togglePost (e) {
      // avoid empty selection
      if (!this.select.rvsn && !this.select.ante) {
        this.select.ante = true
      }
      this.select.post = !this.select.post
    },
    /**
     * toggle visibility of post docs
     */
    toggleFacs (e) {
      // avoid empty selection ...
      this.select.facs = !this.select.facs
    },
    /**
     * toggle visibility of post docs
     */
    toggleTrns (e) {
      // avoid empty selection ...
      this.select.trns = !this.select.trns
    },
    /**
     * toggle visibility of post docs
     */
    toggleText (e) {
      // avoid empty selection ...
      this.select.text = !this.select.text
    },
    /**
     * toggle visibility of post docs
     */
    toggleAnno (e) {
      // avoid empty selection ...
      this.select.anno = !this.select.anno
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
