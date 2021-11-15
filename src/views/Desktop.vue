<template>
  <div class="desk">
    <desktop-component divid="canvas"></desktop-component>
    <complaint-list-dialog />
    <complaint-dialog />
    <div id="sidebar">
      <div>
        <div id="navigatorBox">
          <div id="navigator"></div>
        </div>
        <div id="btnBox">
          <btn-group>
            <btn id="zoomIn" icon="plus" size="sm"></btn>
            <btn id="zoomOut" icon="minus" size="sm"></btn>
            <btn id="desktopOverview" icon="hResize" size="sm"></btn>
          </btn-group>
        </div>
      </div>
      <div v-if="viewer">
        <div>
          <label for="toggleDisplayMeasures">Takte anzeigen </label>
          <input
            id="toggleDisplayMeasures"
            type="checkbox"
            v-model="displayMeasures"
          />
        </div>
        zoom: {{ scale.toFixed(2) }}
      </div>
      <!-- <complaints-list /> -->
      <div>
        <btn @click="openComplaints" size="sm">
          Monita
        </btn>
      </div>
      <zone-info />
      <source-info />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DesktopComponent from '@/components/DesktopComponent'
import SourceInfo from '@/components/SourceInfo'
import ZoneInfo from '@/components/ZoneInfo.vue'
// import ComplaintsList from '@/components/ComplaintsList.vue'
import ComplaintListDialog from '../components/ComplaintListDialog.vue'
import ComplaintDialog from '@/components/ComplaintDialog.vue'
import { mutations } from '@/store/names'

/**
 * Desktop View
 *
 * @module views/Desktop
 * @vue-computed {object[]} sources - list of available sources
 */
export default {
  name: 'Desktop',
  components: {
    DesktopComponent,
    SourceInfo,
    ZoneInfo,
    // ComplaintsList,
    ComplaintDialog,
    ComplaintListDialog
  },
  mounted () {
    // console.log(this.sources)
  },
  computed: {
    ...mapGetters(['viewer', 'scale']),
    displayMeasures: {
      get () {
        const displayMeasures = this.$store.getters.displayMeasures
        // console.log('display: ' + displayMeasures)
        return displayMeasures
      },
      set (val) {
        this.$store.commit(mutations.SET_DISPLAY_MEASURES, val)
      }
    }
  },
  methods: {
    openComplaints () {
      this.$store.commit('COMPLAINTS_LIST', true)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "@/scss/variables.scss";

.desk {
  flex: 1 0 auto;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  position: relative;
}

#dialog {
  position: absolute;
  left: 0;
  top: 0;
  width: 800px;
  height: 600px;
  z-index: -1;
  background-color: white;
  border-radius: 5px;

  &:hover {
    border: 1px black solid;
  }
  &.active {
    z-index: 10;
  }
}

#canvas {
  height: 100%;
  width: calc(100% - 15rem);
  flex: 1 1 auto;

  .measure {
    width: 3rem;
    height: 1rem;
    border: .5px solid $border-color;
    border-radius: 5px;
    box-shadow: 0 0 .5rem #00000099;
    opacity: 0;

    &:hover {
      opacity: 1;
    }

    &.active {
      background-color: rgba($color: #ffffff, $alpha: .5);
    }
  }

}

#sidebar {
  height: 100%;
  width: calc(15rem - .5px);
  flex: 1 1 auto;
  border-left: .5px solid $border-color;
  background-color: #f5f5f5;
  padding: 5px;

  & > div {
    width: calc(100% - 1px - .4rem);
    margin: .2rem;
    border: .5px solid $border-color;
    border-radius: .3rem;
    background-color: #ffffff;
    box-shadow: 0 .1rem .5rem #00000033 inset;
    padding: 8px;
  }

  #navigator {
    height: 5rem;
    width: 100%;
  }

  #btnBox > div {
    display: inline-block;
  }
}
</style>
