<template>
  <div class="dialogBack" :class="{ 'inactive': !this.active }">
    <div class="dialog" :style="styles">
      <div class="head" v-if="active">
        <div class="title">
          <div class="titletext">
            {{ title }}
          </div>
        </div>
        <div class="close">
          <button class="btn btn-sm" @click.prevent="closeDialog">
            <i class="icon icon-cross"></i>
            {{ $t('terms.close') }}
          </button>
        </div>
      </div>
      <div class="body" v-if="active">
        <complaints-list />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ComplaintsList from './ComplaintsList.vue'

export default {
  components: { ComplaintsList },
  name: 'ComplainsListDialog',
  props: {},
  data: () => ({}),
  mounted () {
    window.addEventListener('resize', this.resize)
  },
  watch: {
    active () {
      if (this.active) {
        this.$store.commit('ADD_MODAL', this.$vnode.tag)
      } else {
        this.$store.commit('REM_MODAL', this.$vnode.tag)
      }
    }
  },
  computed: {
    ...mapGetters(['viewer', 'showComplaintsList']),
    active: {
      get () {
        return this.showComplaintsList
      },
      set (show) {
        this.$store.commit('COMPLAINTS_LIST', show)
      }
    },
    title () {
      return 'ComplaintsList'
    },
    styles () {
      return {}
    }
  },
  methods: {
    closeDialog () {
      this.active = false
    }
  }
}

</script>

<style lang="scss" scoped>

.dialogBack {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
  background-color: rgba(0,0,0,.3);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.inactive {
  display: none;
}

.dialog {
  position: absolute;
  left: 1rem;
  top: 1rem;
  // TODO ??
  width: calc(100% - 2rem);
  height: calc(100% - 2rem);
  border-radius: 5px;
  background-color: white;
  border: .5px solid #666666;
  box-shadow: 0 0 .8rem #00000066;
  border-radius: .3rem;

  .head {
    height: 3rem;
    border-bottom: 1px solid gray;
    padding-left: 1em;
    text-align: left;
    background: linear-gradient(180deg, #cccccc 0%, #f5f5f5 100%);
    border-radius: .3rem .3rem 0 0;
    .title {
      display: inline-block;
      width: 50%;
      .titletext {
        font-weight: bold;
        font-size: 110%;
        margin-top: 3pt;
      }
      .measures {
        font-size: 90%;

        .monitumLink {
          font-weight: 700;
        }
      }
    }
  }

  .body {
    width: 100%;
    height: calc(100% - 80px);
    overflow: scroll;

    .tabview {
      display: table;
      width: calc(100% - 10pt);
      margin: 5pt;

      .fakeRow {
        display: table-row;

        .fakeCol {
          display: table-cell;
          font-weight: 100;
          text-align: left;
          padding: 0 0 0 .2rem;
        }
      }
    }
  }
  .close {
    position: absolute;
    top: 1em;
    right: 1em;
  }
}

</style>
