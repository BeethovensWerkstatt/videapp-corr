<template>
  <div class="dialogBack" :class="{ 'inactive': !this.active }">
    <select-complaint-views />
    <div class="dialog" :style="styles">
      <div class="head" v-if="active">
        <div class="title">
          <div class="titletext">
            {{ workTitle(activeComplaint['@work']) }},
            {{ activeComplaint.movement.label }}{{ (complaintLabel !== '') ? (', ' + complaintLabel) : '' }}, {{ $t('terms.measure') }} {{ measures }}
          </div>
          <div class="measures">
            Monitum <a class="monitumLink" :href="activeComplaint['@id']" target="_blank" rel="noopener noreferrer" :title="monitumId">{{ monitumId.split('-')[0] }}</a>
          </div>
        </div>
        <div class="close">
          <button @click="desktopComplaint" class="btn btn-sm iconBtn"><i class="icon icon-copy"></i></button>
          <button :disabled="!previousComplaintId" @click="loadPrevious" class="btn btn-sm iconBtn"><i class="icon icon-arrow-left"></i></button>
          <button :disabled="!nextComplaintId" @click="loadNext" class="btn btn-sm iconBtn"><i class="icon icon-arrow-right"></i></button>
          <button class="btn btn-sm" @click.prevent="displayViewSelection"><i class="icon icon-menu"></i> Optionen</button>
          <button class="btn btn-sm" @click.prevent="closeDialog"><i class="icon icon-cross"></i> {{ $t('terms.close') }}</button>
        </div>
      </div>
      <div class="body" v-if="active">
        <div class="loading" v-if="activeComplaint.loading">{{ $t("terms.load") }} {{ activeComplaint.label }}</div>
        <div class="tabview" v-else>
          <div class="fakeRow">
            <div class="fakeCol" v-if="select.ante"><h2>{{ $t("terms.complaint.state.anteTitle") }}</h2></div>
            <div class="fakeCol" v-if="select.rvsn"><h2>{{ $t("terms.complaint.state.revisionTitle") }}</h2></div>
            <div class="fakeCol" v-if="select.post"><h2>{{ $t("terms.complaint.state.postTitle") }}</h2></div>
          </div>
          <complaint-dialog-tab-row
            v-for="(row,i) in docMap"
            :key="i"
            :row="row"
            :select="select"
            :colStyles="colStyles"
          >
          </complaint-dialog-tab-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import n from '@/store/names'
// import VerovioComponent from '@/components/VerovioComponent.vue'
import toolbox from '@/toolbox'
import ComplaintDialogTabRow from '@/components/ComplaintDialog/TabRow.vue'
import SelectComplaintViews from './SelectComplaintViews.vue'

/**
 * Complaint dialog component
 *
 * @module components/ComplaintDialog
 * @vue-data {Object} select - flags what to display: ante, rvsn, post, facs, trns, text, anno
 * @vue-computed {String} activeComplaintId - id of selected complaint
 * @vue-computed {Object} activeComplaint - selected complaint object
 * @vue-computed {Boolean} active - if dialog is opened
 * @vue-computed {Object} styles - calculated height from `window.innerheight`
 * @vue-computed {String} measures - indicator for affected measures
 * @vue-computed {Object} docMap - elemnts to display by row (ante, revision, post)
 * @vue-computed {Number} tabWidth - width of table
 * @vue-computed {Number} colCount - number of selected columns (ant, revision, post)
 * @vue-computed {Object} colStyles - styles for all columns: width = tabWidth / colCount
 */
export default {
  components: { ComplaintDialogTabRow, SelectComplaintViews },
  name: 'ComplaintDialog',
  props: {
  },
  data () {
    return {
      innerHeight: window.innerHeight
    }
  },
  mounted () {
    window.addEventListener('resize', this.resize)
  },
  watch: {
    /*
    tabWidth () {
      console.log(this.tabWidth)
    },
    styles () {
      console.log(this.innerHeight)
    },
    */
    active () {
      if (this.active) {
        this.$store.commit(n.mutations.ADD_MODAL, this.$vnode.tag)
      } else {
        this.$store.commit(n.mutations.REM_MODAL, this.$vnode.tag)
      }
    }
  },
  computed: {
    ...mapGetters([
      n.getters.viewer,
      n.getters.getWork,
      n.getters.displayComplaint,
      n.getters.activeComplaintId,
      n.getters.activeComplaint,
      n.getters.complaintDisplaySelect,
      n.getters.previousComplaintId,
      n.getters.nextComplaintId
    ]),
    workId () {
      return this.$route.params.id
    },
    active () {
      if (this.displayComplaint && this.activeComplaintId) {
        return true
      }
      return false
    },
    styles () {
      return {
        height: 'calc(' + this.innerHeight + 'px - 3.5rem)'
      }
    },
    measures () {
      const complaint = this.activeComplaint
      if (complaint.affects?.length > 0) {
        return complaint.affects[0].measures.label
      }
      return ''
    },
    complaintLabel () {
      const complaint = this.activeComplaint
      const label = complaint?.label
      if (complaint.affects?.length > 0) {
        const staves = complaint.affects[0].staves
        if (staves?.length > 0) {
          // console.log(staves)
          const insts = label ? [label] : []
          for (const sn of staves) {
            const sa = complaint.movement.staves.filter(s => s.n === sn)
            for (const s of sa) {
              insts.push(s.label || '[?]')
            }
          }
          // console.log(insts)
          return [...new Set(insts)].join(', ')
        }
      }
      return label
    },
    select: {
      get () {
        return this.complaintDisplaySelect
      },
      set (sel) {
        this.$store.commit(n.mutations.SET_COMPLAINT_DISPLAY_SELECT, sel)
      }
    },
    docMap () {
      // console.log('complaint', this.activeComplaint)
      const ante = this.statusDocs('ante')
      const revision = this.statusDocs('revision')
      const post = this.statusDocs('post')
      const len = Math.max(ante.length, revision.length, post.length)
      // console.log(len, ante, revision, post)
      const map = []
      for (let i = 0; i < len; i++) {
        const row = {
          tags: this.activeComplaint?.tags
        }
        row.ante = i < ante.length ? ante[i] : {}
        row.revision = i < revision.length ? revision[i] : {}
        row.post = i < post.length ? post[i] : {}
        // console.log(row)
        map.push(row)
      }
      // console.log(map)
      return map
    },
    tabWidth () {
      if (this.$el) {
        const el = this.$el.querySelector('.tabview')
        // console.log(el?.innerWidth, this.$el)
        return el?.innerWidth > 0 ? el.innerWidth : this.$el.innerWidth
      }
      return 400
    },
    colCount () {
      let cnt = 0
      if (this.select.ante) {
        cnt++
      }
      if (this.select.rvsn) {
        cnt++
      }
      if (this.select.post) {
        cnt++
      }
      return Math.max(1, cnt)
    },
    colStyles () {
      const mw = (this.tabWidth / this.colCount)
      // console.log(this.tabWidth, this.colCount, mw)
      const styles = {
        'max-width': mw + 'px'
      }
      // console.log(styles)
      return styles
    },
    monitumId () {
      let id = this.activeComplaintId.split('/').splice(-1)[0]
      id = id.substring(0, id.length - 5)
      return id
    }
  },
  methods: {
    toRoman (num) {
      return toolbox.toRoman(num)
    },
    workTitle (workId) {
      const work = this.getWork(workId)
      return work?.label ? work?.label[0].title : work?.title[0].title
    },
    /**
     * create array of objects `[{ mei: { url }}, { img: { url } }, ...]`
     *
     * @todo get width/resolution for facsimile
     *
     * @param {String} status - one of `'ante'`, `'revision'` and `'post'`
     */
    statusDocs (status) {
      const docs = []
      // console.log(textStatus)
      let textStatus, textTrans
      switch (status) {
        case 'ante':
          textStatus = this.activeComplaint.anteDocs
          textTrans = this.activeComplaint.text.ante
          break
        case 'revision':
          textStatus = this.activeComplaint.revisionDocs
          break
        case 'post':
          textStatus = this.activeComplaint.postDocs
          textTrans = this.activeComplaint.text.post
          break
      }
      if (textStatus) {
        textStatus.forEach(stat => {
          // console.log(stat.iiif[0]?.on.full)
          if (stat.tei) {
            console.log('TEI', stat.tei)
          }
          docs.push({
            img: {
              // TODO scaling? NO goto OSD
              url: stat.iiif[0]?.target.selector[0]['@id'],
              page: stat.iiif[0]?.on.full,
              region: stat.iiif[0]?.on.selector.value,
              label: stat.labels?.source + ', S.' + stat.labels?.pages // 'Sigel / Seite'
            }
          })
          docs.push({
            mei: {
              url: stat.mei,
              trans: 'dipl',
              label: 'Transkription' // 'transcription of ' + stat.labels?.source // 'Annot. Transkript.'
            },
            tei: {
              url: stat.tei
            }
          })
          docs.push({
            mei: {
              url: textTrans,
              trans: 'clear',
              label: 'Text'
            }
          })
          docs.push({
            anno: stat.comment
          })
        })
      }
      return docs
    },
    /**
     * close this dialog
     */
    closeDialog (e) {
      this.$store.commit(n.mutations.DISPLAY_COMPLAINT, false)
    },
    /**
     * display select dialog
     */
    displayViewSelection (e) {
      this.select = { ...this.select, dialog: true }
    },
    /**
     * toggle visibility of ante docs
     */
    toggleAnte (e) {
      const select = { ...this.select }
      // avoid empty selection
      if (!select.rvsn && !select.post) {
        select.rvsn = true
      }
      select.ante = !select.ante
      this.select = select
    },
    /**
     * toggle visibility of revision
     */
    toggleRvsn (e) {
      const select = { ...this.select }
      // avoid empty selection
      if (!select.ante && !select.post) {
        select.post = true
      }
      select.rvsn = !select.rvsn
      this.select = select
    },
    /**
     * toggle visibility of post docs
     */
    togglePost (e) {
      const select = { ...this.select }
      // avoid empty selection
      if (!select.rvsn && !select.ante) {
        select.ante = true
      }
      select.post = !select.post
      this.select = select
    },
    /**
     * toggle visibility of facsimiles
     */
    toggleFacs (e) {
      // avoid empty selection ...
      this.select = { ...this.select, facs: !this.select.facs }
    },
    /**
     * toggle visibility of transcriptions
     */
    toggleTrns (e) {
      this.select = { ...this.select, trns: !this.select.trns }
    },
    /**
     * toggle visibility of cleartext
     */
    toggleText (e) {
      this.select = { ...this.select, text: !this.select.text }
    },
    /**
     * toggle visibility of annotation text
     */
    toggleAnno (e) {
      this.select = { ...this.select, anno: !this.select.anno }
    },
    resize () {
      // console.log('resize dialog')
      this.innerHeight = window.innerHeight
    },
    loadPrevious () {
      console.log('activate previous sibling')
      this.$store.dispatch(n.actions.activateSibling, true)
    },
    loadNext () {
      console.log('activate next sibling')
      this.$store.dispatch(n.actions.activateSibling, false)
    },
    openPages (complaint) {
      this.$store.dispatch(n.actions.loadComplaint, {
        complaint,
        callback: (complaint) => {
          // console.log(complaint)
          for (const state of ['anteDocs', 'revisionDocs', 'postDocs']) {
            for (const c of complaint[state]) {
              const pageId = c.iiif[0]?.on.full
              const page = this.$store.getters.getPage(pageId)
              // console.log(state, page)
              this.$store.commit(
                n.mutations.SET_PAGE,
                {
                  id: page.source,
                  page: page.pagenumber
                })
            }
          }
          this.closeDialog()
          this.$store.commit(n.mutations.COMPLAINTS_LIST, false)
        }
      })
    },
    desktopComplaint () {
      const complaint = this.activeComplaint
      const work = this.getWork(complaint.movement.work)
      if (work) {
        this.openPages(complaint)
        if (this.$route.name !== 'Schreibtisch' || this.workId !== work.id) {
          console.log(this.$router.name, this.workId, work.id)
          this.$router.push({ name: 'Schreibtisch', params: { id: work.id } }).then(() => {
            this.$store.dispatch(n.actions.activateComplaint, complaint['@id'])
          })
        }
      }
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
  z-index: 10;
  background-color: rgba(0,0,0,.3);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.inactive {
  display: none;
}

.dialog {
  position: fixed;
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
          // font-weight: 700;
          color: rgb(44, 62, 80);
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

.iconBtn i {
  position: relative;
  left: -2px;
}

</style>
