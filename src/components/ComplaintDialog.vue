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
          <div class="tabcol" v-if="selectAnte">
            <h2>{{ initialDocLabel }}</h2>
            <div class="docimg" v-if="row.ante.img && row.ante.img.url">
              <img :src="row.ante.img.url" :style="{ width: '100%' }" />
            </div>
            <h2>{{ initialTextLabel }}</h2>
            <verovio-component
              id="ante"
              :options="row.ante.mei"
              v-if="vrvValid(row.ante.mei)"
            />
          </div>
          <div class="tabcol" v-if="selectRvsn">
            <h2>{{ revisionDocLabel }}</h2>
            <div class="docimg" v-if="row.revision.img && row.revision.img.url">
              <img :src="row.revision.img.url" :style="{ width: '100%' }" />
            </div>
            <h2>{{ revisionTextLabel }}</h2>
            <verovio-component
              id="revision"
              :options="row.revision.mei"
              v-if="vrvValid(row.revision.mei)"
            />
          </div>
          <div class="tabcol" v-if="selectPost">
            <h2>{{ revisedDocLabel }}</h2>
            <div class="docimg" v-if="row.post.img && row.post.img.url">
              <img :src="row.post.img.url" :style="{ width: '100%' }" />
            </div>
            <h2>{{ revisedTextLabel }}</h2>
            <verovio-component
              id="post"
              :options="row.post.mei"
              v-if="vrvValid(row.post.mei)"
            />
          </div>
        </div>
      </div>
    </div>
    <div id="select">
      <div @click="toggleAnte" :class="{ TSactive: selectAnte }" class="TSbutton">ANTE</div>
      <div @click="toggleRvsn" :class="{ TSactive: selectRvsn }" class="TSbutton">RVSN</div>
      <div @click="togglePost" :class="{ TSactive: selectPost }" class="TSbutton">POST</div>
      <div class="dash">
        <input id="verovio-zoom" type="number" min="5" max="100" v-model="vzoom" />
      </div>
    </div>
    <div id="close">
      <btn @click.prevent="closeDialog">close</btn>
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
 * @vue-data {Object} [initialVersion={url:'demo.mei'}] - initial version MEI source
 * @vue-data {Object} [initialImageUrl=null] - initial version image url
 * @vue-data {Object} [revisionInstruction={url:'demo.mei'}] - revision instruction MEI source
 * @vue-data {Object} [revisionImageUrl=null] - revision instruction image url
 * @vue-data {Object} [revisesVersion={url:'demo.mei'}] - revised version MEI source
 * @vue-data {Object} [revisedImageUrl=null] - revised version image url
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
      zoom: 30
    }
  },
  watch: {
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
    initialDocLabel () {
      return this.initialVersion && this.initialVersion.label
        ? this.initialVersion.label
        : this.$t('terms.complaint.state.anteDoc')
    },
    revisionDocLabel () {
      return this.revisionInstruction && this.revisionInstruction.label
        ? this.revisionInstruction.label
        : this.$t('terms.complaint.state.revisionDoc')
    },
    revisedDocLabel () {
      return this.revisedVersion && this.revisedVersion.label
        ? this.revisedVersion.label
        : this.$t('terms.complaint.state.postDoc')
    },
    initialTextLabel () {
      return this.$t('terms.complaint.state.anteText')
    },
    revisionTextLabel () {
      return this.$t('terms.complaint.state.revisionText')
    },
    revisedTextLabel () {
      return this.$t('terms.complaint.state.postText')
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
        map.push(row)
      }
      // console.log(map)
      return map
    }
  },
  methods: {
    toRoman (num) {
      return toolbox.toRoman(num)
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
          const doc = {
            mei: {
              url: stat.mei,
              scale: this.vzoom
            }
          }
          // check for multiple images?
          doc.img = { url: stat.iiif[0]?.target.selector[0]['@id'] }
          if (doc.mei?.url || doc.img) {
            docs.push(doc)
          }
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
      return valid
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
      this.selectAnte = !this.selectAnte
    },
    /**
     * toggle visibility of revision
     */
    toggleRvsn (e) {
      this.selectRvsn = !this.selectRvsn
    },
    /**
     * toggle visibility of post docs
     */
    togglePost (e) {
      this.selectPost = !this.selectPost
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
        .tabcol {
          width: 33%;
          display: table-cell;
          overflow: scroll;
          vertical-align: middle;
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
