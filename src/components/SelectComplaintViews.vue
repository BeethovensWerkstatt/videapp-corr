<template>
  <div class="dialogBack" :class="{ 'inactive': !this.select.dialog }">
    <div class="dialog">
      <div class="head">
        <div class="close">
          <button class="btn btn-sm" @click.prevent="closeDialog"><i class="icon icon-cross"></i> {{ $t('terms.close') }}</button>
        </div>
      </div>

      <div class="selectTab">
        <div class="titleRow">
          <div />
          <div
            v-for="state in ['ante', 'rvsn', 'post']"
            :key="state"
            class="selector"
            @click="toggle(state)"
            :class="{ selected: select[state] }"
          >
            {{ state }}
          </div>
        </div>
        <div
          v-for="artefact in ['facs', 'trns', 'text', 'anno']"
          :key="artefact"
          class="selectorRow"
        >
          <div
            class="selector"
            @click="toggle(artefact)"
            :class="{ selected: select[artefact] }"
          >
            {{ artefact }}
          </div>
          <div
            v-for="state in ['ante', 'rvsn', 'post']"
            :key="state"
            :class="{ selected: select[state] && select[artefact] }"
          >
            <span v-if="select[state] && select[artefact]">&times;</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SelectComplaintViews',
  computed: {
    ...mapGetters(['complaintDisplaySelect']),
    select: {
      get () {
        return this.complaintDisplaySelect
      },
      set (sel) {
        this.$store.commit('SET_COMPLAINT_DISPLAY_SELECT', sel)
      }
    }
  },
  methods: {
    closeDialog () {
      this.select = { ...this.select, dialog: false }
    },
    toggle (key) {
      const select = { ...this.select }
      select[key] = !select[key]
      // TODO avoid empty
      this.select = select
    }
  }
}
</script>

<style lang="scss" scoped>

.dialogBack {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 11; // dynamic by open dialog? (open/close Layer in store?)
  background-color: rgba(0,0,0,.3);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.inactive {
  display: none;
}

.dialog {
  position: relative;
  margin: 15% auto;
  width: 800px; // parametresize
  height: 300px; // auto by content
  background-color: white;
  border-radius: 5px;

  .head {
    height: 3rem;
    border-bottom: 1px solid gray;
    padding-left: 1em;
    text-align: left;
    background: linear-gradient(180deg, #cccccc 0%, #f5f5f5 100%);
    border-radius: .3rem .3rem 0 0;

    .close {
      position: absolute;
      top: 1em;
      right: 1em;
    }
  }

  .selectTab {
    display: table;
    margin: auto;

    .titleRow {
      display: table-row;
      font-weight: bold;

      div {
        display: table-cell;
      }
      div.selector {
        border: 1px solid blue;
        border-radius: 3px;
      }
      div.selected {
        background-color: rgba(255, 0, 0, 0.26);
      }
    }
    .selectorRow {
      display: table-row;

      div {
        display: table-cell;
      }
      div.selector {
        font-weight: bold;
        border: 1px solid blue;
        border-radius: 3px;
      }
      div.selected {
        background-color: rgba(255, 0, 0, 0.26);
      }
    }
  }
}

</style>
