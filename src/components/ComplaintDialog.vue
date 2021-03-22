<template>
  <div class="dialog" :class="{ 'inactive': !this.active }" :styles="styles">
    <div id="body" v-if="active">
      <div class="title">{{ activeComplaint.movement.n }}. {{ activeComplaint.movement.label }}</div>
      <div class="measures">
        Takte: {{ measures }}
      </div>
      <hr>
      <div class="loading" v-if="activeComplaint.loading">Lade {{ activeComplaint.label }}</div>
      <div class="tabview" v-else>
        <div class="tabrow">
          <div class="tabcol">
            <h2>{{ initialDocLabel }}</h2>
            <div class="docimg" v-if="initialImageUrl">
              <img :src="initialImageUrl" :style="{ width: imageWidth('initialVersion') }" />
            </div>
          </div>
          <div class="tabcol">
            <h2>{{ revisionDocLabel }}</h2>
            <div class="docimg" v-if="revisionImageUrl">
              <img :src="revisionImageUrl" :style="{ width: imageWidth('revisionInstruction') }" />
            </div>
          </div>
          <div class="tabcol">
            <h2>{{ revisedDocLabel }}</h2>
            <div class="docimg" v-if="revisedImageUrl">
              <img :src="revisedImageUrl" :style="{ width: imageWidth('revisedVersion') }" />
            </div>
          </div>
        </div>
        <div class="tabrow">
          <div class="tabcol">
            <h2>{{ initialTextLabel }}</h2>
            <verovio-component
              id="initialVersion"
              :options="initialVersion"
              v-if="vrvValid(initialVersion)"
            />
          </div>
          <div class="tabcol">
            <h2>{{ revisionTextLabel }}</h2>
            <verovio-component
              id="revisionInstruction"
              :options="revisionInstruction"
              v-if="vrvValid(revisionInstruction)"
            />
          </div>
          <div class="tabcol">
            <h2>{{ revisedTextLabel }}</h2>
            <verovio-component
              id="revisedVersion"
              :options="revisedVersion"
              v-if="vrvValid(revisedVersion)"
            />
          </div>
        </div>
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
      initialVersion: {
        url: 'demo.mei'
      },
      initialImageUrl: null,
      revisionInstruction: {
        url: 'demo.mei'
      },
      revisionImageUrl: null,
      revisedVersion: {
        url: 'demo.mei'
      },
      revisedImageUrl: null
    }
  },
  watch: {
    activeComplaint () {
      this.initialVersion = this.embodiment('initialVersion')
      this.initialImageUrl = this.imageUrl('initialVersion')
      this.revisionInstruction = this.embodiment('revisionInstruction')
      this.revisionImageUrl = this.imageUrl('revisionInstruction')
      this.revisedVersion = this.embodiment('revisedVersion')
      this.revisedImageUrl = this.imageUrl('revisedVersion')
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
        height: 'calc(' + window.innerHeight + 'px - 2rem)'
      }
    },
    initialDocLabel () {
      return this.initialVersion && this.initialVersion.label
        ? this.initialVersion.label
        : 'Ausgangsdokument'
    },
    revisionDocLabel () {
      return this.revisionInstruction && this.revisionInstruction.label
        ? this.revisionInstruction.label
        : 'Revisionsdokument'
    },
    revisedDocLabel () {
      return this.revisedVersion && this.revisedVersion.label
        ? this.revisedVersion.label
        : 'Zieldokument'
    },
    initialTextLabel () {
      return 'Ausgangstext'
    },
    revisionTextLabel () {
      return 'Revisionstext'
    },
    revisedTextLabel () {
      return 'Zieltext'
    },
    measures () {
      const m = {}
      for (const c of this.activeComplaint.measures) {
        const mi = +c.label
        if (!m.min || mi < m.min) {
          m.min = mi
        }
        if (!m.max || mi > m.max) {
          m.max = mi
        }
      }
      if (m.min === m.max) {
        return '' + m.min
      }
      if (m.max - m.min === 1) {
        return m.min + ', ' + m.max
      }
      return m.min + '-' + m.max
    }
  },
  methods: {
    /**
     * @param {String} textStatus - one of 'initialVersion', 'revisionInstruction', 'revisedVersion'
     * @returns {Object} MEI source information for textStatus
     */
    embodiment (textStatus) {
      const complaint = this.activeComplaint
      // console.log(textStatus, complaint)
      if (complaint && complaint.embodiments) {
        const emb = complaint.embodiments.find(e => e.textStatus === textStatus)
        // console.log(textStatus, emb)
        if (emb) {
          const opts = {}
          opts.url = emb.mei
          opts.label = emb.label
          return opts
        }
      }
      return {}
    },
    /**
     * @param {String} textStatus - one of 'initialVersion', 'revisionInstruction', 'revisedVersion'
     * @returns {String} image url
     */
    imageUrl (textStatus) {
      const complaint = this.activeComplaint
      if (complaint && complaint.embodiments) {
        const emb = complaint.embodiments.find(e => e.textStatus === textStatus)
        if (emb) {
          return emb.iiif[0].target.selector[0]['@id']
        }
      }
      return null
    },
    /**
     * @param {String} textStatus - one of 'initialVersion', 'revisionInstruction', 'revisedVersion'
     * @returns {String} css image width
     */
    imageWidth (textStatus) {
      const complaint = this.activeComplaint
      if (complaint && complaint.embodiments) {
        const emb = complaint.embodiments.find(e => e.textStatus === textStatus)
        if (emb) {
          console.log(emb.iiif[0])
          const reWidth = new RegExp('xywh=\\d+,\\d+,(\\d+),\\d+')
          const m = reWidth.exec(emb.iiif[0].on.selector.value)
          if (m && m.length > 1) {
            // this fixed scaling factor should be retrieved from the source scaling
            // ... and this factor should adjustable
            return (+m[1] / 5) + 'px'
          }
        }
      }
      return '100%'
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
}

</style>
