<template>
  <div class="dialogBack" :class="{ 'inactive': !this.select.dialog }">
    <div class="dialog">
      <div class="head">
        <h3>Ansichtseinstellungen</h3><!-- TODO: Get this into i18n -->
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
            {{ columnTitle[state] }}
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
            :class="[{ selected: select[artefact] }, artefact]"
          >
            {{ rowTitle[artefact] }}
          </div>
          <div
            v-for="state in ['ante', 'rvsn', 'post']"
            :key="state"
            :class="[{ selected: select[state] &&  select[artefact] }, artefact, state]"
          >
            <span v-if="select[state] && select[artefact]">✓</span>
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
    },
    columnTitle () {
      return { ante: 'ante revisionem', rvsn: 'revisio', post: 'post revisionem' }
    },
    rowTitle () {
      return { facs: 'Dokument', trns: 'Annotierte Transkription', text: 'Ausgangs- / Zieltext', anno: 'Kommentar' }
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
  border: .5px solid #333333;
  box-shadow: 0 .5rem 2rem #00000066;

  .head {
    height: 3rem;
    border-bottom: 1px solid gray;
    padding-left: 1em;
    text-align: left;
    background: linear-gradient(180deg, #cccccc 0%, #f5f5f5 100%);
    border-radius: .3rem .3rem 0 0;

    h3 {
      position: relative;
      top: .8rem;
      font-size: 1.2rem;
    }

    .close {
      position: absolute;
      top: 1em;
      right: 1em;
    }
  }

  .selectTab {
    display: table;
    border-collapse: collapse;
    margin: 1rem auto;

    .titleRow {
      display: table-row;
      font-weight: bold;

      div {
        display: table-cell;
      }
      div.selector {
        border-bottom: 1px solid #666666;
        & + .selector {
           border-left: 1px solid #666666;
        }
        padding: .1rem .3rem;
        writing-mode: sideways-lr;
        width: 2rem;
        height: 1rem;
        text-align: left;
        vertical-align: bottom;
        padding: .2rem 0;
        line-height: .8rem;
        cursor: pointer;
        background-color: #f5f5f5;
      }
      div.selected {
        background-color: #e5e5e5;
      }
    }
    .selectorRow {
      display: table-row;

      div {
        display: table-cell;
      }
      div.selector {
        font-weight: bold;
        margin: .1rem;
        padding: .1rem .3rem;
        text-align: right;
        cursor: pointer;
        // border: 1px solid blue;

        &.facs {
           background-color: #6CA5B466;
           &.selected {
             background-color: #6CA5B4;
          }
        }
        &.trns {
           background-color: #A7C4E566;
           &.selected {
             background-color: #A7C4E5;
          }
        }
        &.text {
           background-color: #AFEC7766;
           &.selected {
             background-color: #AFEC77;
          }
        }
        &.anno {
           background-color: #ECB57766;
           &.selected {
             background-color: #ECB577;
          }
        }
      }

      div.selected {
        background-color: #dbfabf;
      }
    }
  }
}

</style>
