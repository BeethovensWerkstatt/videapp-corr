<template>
  <div class="dialogBack">
    <div class="select-page-dialog">
      <div class="head">
        <h3>{{ sourceLabel }}</h3>
        <div class="close">
          <button class="btn btn-sm" @click.prevent="closeDialog"><i class="icon icon-cross"></i> {{ $t('terms.close') }}</button>
        </div>
      </div>
      <div class="body">
        <table>
          <tr class="table-head"><th colspan="3">Verso</th><th colspan="3">Recto</th></tr>
          <template v-for="(pp, i) in source.pages">
            <tr :key="'page-row-' + i" :class="{ selected: i === pagenr }">
              <td>
                <template v-if="hasVerso(i)">
                  <button class="btn btn-link" @click.prevent="openPage(i)">({{ i * 2 }})</button>
                </template>
              </td>
              <td>
                <template v-if="hasVerso(i)">
                  <button
                    class="btn btn-link"
                    @click.prevent="openPage(i)"
                    :title="versoDesc(pp)"
                  >
                    {{ versoLabel(pp) }}
                  </button>
                </template>
              </td>
              <td>
                <template v-if="hasVerso(i)">
                  <button class="btn btn-link" @click.prevent="openPage(i)">{{ versoPage(pp) }}</button>
                </template>
              </td>
              <td>
                <template v-if="hasRecto(i)">
                  <button class="btn btn-link" @click.prevent="openPage(i)">({{ (i * 2) + 1 }})</button>
                </template>
              </td>
              <td>
                <template v-if="hasRecto(i)">
                  <button
                    class="btn btn-link"
                    @click.prevent="openPage(i)"
                    :title="rectoDesc(pp)"
                  >
                    {{ rectoLabel(pp) }}
                  </button>
                </template>
              </td>
              <td>
                <template v-if="hasRecto(i)">
                  <button class="btn btn-link" @click.prevent="openPage(i)">{{ rectoPage(pp) }}</button>
                </template>
              </td>
            </tr>
          </template>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import n from '@/store/names'

/*
const sourceLabel = (labels) => {
  if (labels) {
    let label = labels.names[0].label
    if (labels.names[0].page) label += ' [' + labels.names[0].page + ']'
    return label
  }
  return undefined
}
// */
const sourceDesc = (labels) => {
  if (labels) {
    const label = labels.names[0].desc
    return label
  }
  return undefined
}
const sourceLabel = (labels) => {
  if (labels) {
    const label = labels.names[0].label
    return label
  }
  return undefined
}
const sourcePage = (labels) => {
  if (labels) {
    const label = '[' + labels.names[0].page + ']'
    return label
  }
  return undefined
}

export default {
  name: 'SelectPageDialog',
  props: {
    sourceId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(['getCanvasLabels']),
    source () {
      const source = this.$store.getters.getSourceById(this.sourceId)
      if (source) {
        return source
      }
      // return fake source object
      console.warn('no source for ' + this.sourceId + '!')
      return {
        pages: [{ v: null, r: null }],
        position: { x: 0, y: 0 }
      }
    },
    sourceLabel () {
      // console.log(this.source.description, this.source.label)
      if (!this.source.label?.trim() || this.source.label === '… ') {
        return this.source.description || this.source.label
      }
      return this.source.label
    },
    pagenr () {
      return this.source?.pagenr || 0
    }
  },
  methods: {
    hasVerso (i) {
      return !!this.source?.pages[i].v
    },
    hasRecto (i) {
      return !!this.source?.pages[i].r
    },
    versoDesc (pp) {
      const l = this.getCanvasLabels(pp.v?.id)
      return sourceDesc(l) || '---'
    },
    rectoDesc (pp) {
      const l = this.getCanvasLabels(pp.r?.id)
      return sourceDesc(l) || '---'
    },
    versoLabel (pp) {
      const l = this.getCanvasLabels(pp.v?.id)
      return sourceLabel(l) || '---'
    },
    rectoLabel (pp) {
      const l = this.getCanvasLabels(pp.r?.id)
      return sourceLabel(l) || '---'
    },
    versoPage (pp) {
      const l = this.getCanvasLabels(pp.v?.id)
      return sourcePage(l) || '---'
    },
    rectoPage (pp) {
      const l = this.getCanvasLabels(pp.r?.id)
      return sourcePage(l) || '---'
    },
    openPage (p) {
      this.$store.commit(n.mutations.SET_PAGE, { id: this.sourceId, page: p })
      this.closeDialog()
    },
    closeDialog () {
      this.$store.commit('SET_SELECT_PAGE_ID', undefined)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialogBack {
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 11; // dynamic by open dialog? (open/close Layer in store?)
  background-color: rgba(0,0,0,.3);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.select-page-dialog {
  position: relative;
  margin: auto;
  width: 800px; // parametresize
  height: calc(80%);
  overflow: scroll;
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
  .body {
    table {
      margin: auto;
      tr {
        margin: 0;
        padding: 0;
      }
      td {
        margin: 0;
        padding-left: 7pt;
        text-align: center;
      }
      td:nth-child(1) {
        border-left: 1px solid gray;
      }
      td:nth-child(4) {
        border-left: 1px solid gray;
      }
      td:nth-child(6) {
        border-right: 1px solid gray;
      }
      .selected {
        background-color: lightyellow;
      }
    }
  }
}
</style>
