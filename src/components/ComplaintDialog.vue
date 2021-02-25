<template>
  <div class="dialog" :class="{ 'inactive': !this.active }" :styles="styles">
    <div id="body" v-if="active">
      <div class="title">{{ activeComplaint.movement.n }}. {{ activeComplaint.movement.label }}</div>
      <div class="measures">
        Takte:
        <span v-for="(m, i) in activeComplaint.measures" :key="m.id"><span v-if="i > 0">, </span>{{ m.label }}</span>
      </div>
      <hr>
      <div class="tabview">
        <div class="tabrow">
          <div class="tabcol">
            <h2>Ausgangsdokument</h2>
            <verovio-component id="ausgangsdokument" :options="source" v-if="vrvValid(source)" />
          </div>
          <div class="tabcol">
            <h2>Revisionsdokument</h2>
            <verovio-component id="revisionsdokument" :options="revision" v-if="vrvValid(revision)" />
          </div>
          <div class="tabcol">
            <h2>Zieldokument</h2>
            <verovio-component id="zieldokument" :options="target" v-if="vrvValid(target)" />
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
import { mutations } from '@/store/names'
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
      source: {
        url: 'BWV_0009_1.xml',
        from: 'xml',
        page: 7,
        height: 300
      },
      revision: {
        url: 'demo.mei',
        height: 300
      },
      target: {
        url: 'https://raw.githubusercontent.com/music-encoding/sample-encodings/master/MEI_4.0/Music/Complete_examples/Ahle_Jesu_meines_Herzens_Freud.mei',
        page: 2,
        height: 300
      }
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
    }
  },
  methods: {
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
      this.$store.commit(mutations.ACTIVATE_COMPLAINT, null)
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
