<template>
  <div class="dialog" :class="{ 'inactive': !this.active }">
    <div id="body" v-if="active">
      <div class="title">{{ activeComplaint.movement.n }}. {{ activeComplaint.movement.label }}</div>
      <div class="measures">
        Takte:
        <span v-for="(m, i) in activeComplaint.measures" :key="m.id"><span v-if="i > 0">, </span>{{ m.label }}</span>
      </div>
      <hr>
      <div id="tabview">
        <div id="tabcol1">
          <h2>Ausgangsdokument</h2>
          <verovio-component id="ausgangsdokument" url="demo.mei" />
        </div>
        <div id="tabcol2">
          <h2>Revisionsdokument</h2>
          <verovio-component id="revisionsdokument" url="demo.mei" />
        </div>
        <div id="tabcol3">
          <h2>Zieldokument</h2>
          <verovio-component id="zieldokument" url="demo.mei" />
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
import VerovioComponent from './VerovioComponent.vue'

export default {
  components: { VerovioComponent },
  name: 'ComplaintDialog',
  props: {
  },
  computed: {
    ...mapGetters(['activeComplaintId', 'activeComplaint']),
    active () {
      if (this.activeComplaintId) {
        return true
      }
      return false
    }
  },
  methods: {
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

    #tabview {
      width: 100%;
      #tabcol1 {
        display: inline-block;
        width: 33%;
        overflow: scroll;
      }
      #tabcol2 {
        display: inline-block;
        width: 33%;
        overflow: scroll;
      }
      #tabcol3 {
        display: inline-block;
        width: 33%;
        overflow: scroll;
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
