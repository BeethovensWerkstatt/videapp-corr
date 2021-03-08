<template>
  <div class="dialog" :class="{ 'inactive': !this.active }" :styles="styles">
    <div id="body" v-if="active">
      <div class="title">{{ activeComplaint.movement.n }}. {{ activeComplaint.movement.label }}</div>
      <div class="measures">
        Takte:
        <span v-for="(m, i) in activeComplaint.measures" :key="m.id"><span v-if="i > 0">, </span>{{ m.label }}</span>
      </div>
      <hr>
      <div class="loading" v-if="activeComplaint.loading">Lade {{ activeComplaint.label }}</div>
      <div class="tabview" v-else>
        <div class="tabrow">
          <div class="tabcol">
            <h2>{{ initialDocLabel }}</h2>
            <div class="docimg" v-if="initialImageUrl">
              <img :src="initialImageUrl"/>
            </div>
          </div>
          <div class="tabcol">
            <h2>{{ revisionDocLabel }}</h2>
            <div class="docimg" v-if="revisionImageUrl">
              <img :src="revisionImageUrl"/>
            </div>
          </div>
          <div class="tabcol">
            <h2>{{ revisedDocLabel }}</h2>
            <div class="docimg" v-if="revisedImageUrl">
              <img :src="revisedImageUrl"/>
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
 * @vue-computed {String} activeComplaintId - id of selected complaint
 * @vue-computed {Object} activeComplaint - selected complaint object
 * @vue-computed {boolean} active - if dialog is opened
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
    }
  },
  methods: {
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
    imageUrl (textStatus) {
      const complaint = this.activeComplaint
      if (complaint && complaint.embodiments) {
        const emb = complaint.embodiments.find(e => e.textStatus === textStatus)
        if (emb) {
          return emb.iiif[0].target.selector[0]['@id']
        }
      }
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
