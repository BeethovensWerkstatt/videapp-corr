<template>
  <div class="complaint-details">
    <i id="closeInfobox" class="icon icon-cross" @click="closeDetails"></i>
    <div class="infobox-content" v-if="hasCurrentItem">
      <strong>
         <span v-if="currentItem.bravura !== ''" class="bravura">{{currentItem.bravura}}</span>
         {{currentItemDesc}}
         <span v-if="currentItem.measure !== ''" class="measureInfo">, {{currentItem.measure}}</span>
      </strong>
      <div class="divider"></div>
      <editor v-model="currentItemXml" @init="editorInit" lang="xml" theme="textmate" width="90%" height="50"></editor>
      <div class="divider"></div>
      <div>
         Bestandteil des Monitums T.{{ activeComplaint.affects[0].measures.label }}.
      </div>
      <div class="compBtn" @click="displayComplaint">
         <i class="icon icon-copy"></i> Komparative Ansicht öffnen.
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import n from '@/store/names'

export default {
  name: 'ComplaintDetails',
  components: {
    editor: require('vue2-ace-editor')
  },
  computed: {
    ...mapGetters([n.getters.activeComplaintId, n.getters.activeComplaint, n.getters.hasCurrentItem]),
    currentItem () {
      const currentItems = this.$store.getters[n.getters.currentItem]
      return currentItems[0]
    },
    currentItemDesc () {
      const currentItems = this.$store.getters[n.getters.currentItem]
      if (currentItems.length > 0 && currentItems[0].desc) {
        return currentItems[0].desc
      } else {
        return '–'
      }
    },
    currentItemXml: {
      get: function () {
        const currentItems = this.$store.getters[n.getters.currentItem]
        if (currentItems.length > 0 && currentItems[0].xml) {
          return currentItems[0].xml
        } else {
          return ''
        }
      },
      // setter
      set: function (newValue) {
        console.log('ignoring ' + newValue)
      }
    }
  },
  methods: {
    displayComplaint () {
      console.log()
      this.$store.commit(n.mutations.DISPLAY_COMPLAINT, true)
    },
    closeDetails () {
      this.$store.commit(n.mutations.ACTIVATE_COMPLAINT, null)
    },
    editorInit: function (editor) {
      require('brace/ext/language_tools') // language extension prerequsite...
      require('brace/mode/xml')
      require('brace/theme/ambiance')
      require('brace/snippets/javascript') // snippet

      editor.setOption('showGutter', false)
      editor.setOption('readOnly', true)
      editor.setOption('highlightActiveLine', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.complaint-details {
   position: relative;
   #closeInfobox {
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
      font-size: .7rem;
   }

   .infobox-content {
      text-align: left;
   }

   .bravura {
      font-family: BravuraText;
      margin: 0 .5rem 0 0;
      font-size: 1.2rem;
      line-height: 1.2;
      position: relative;;
      top: 8px;
   }

  .divider {
    height: 1.5px;
    // background-color: #ffffff;
    margin: .5rem 0;
  }

  .compBtn {
    font-weight: bold;
    cursor: pointer;
    margin: .5rem 0 0 0;
  }

}
</style>
