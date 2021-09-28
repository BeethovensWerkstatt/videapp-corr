<template>
  <div class="dialogBack" :class="{ 'inactive': !this.select.dialog }">
    <div class="dialog">
      <div @click="toggle('ante')" :class="{ TSactive: select.ante }" class="TSbutton">ANTE</div>
      <div @click="toggle('rvsn')" :class="{ TSactive: select.rvsn }" class="TSbutton">RVSN</div>
      <div @click="toggle('post')" :class="{ TSactive: select.post }" class="TSbutton">POST</div>
      &nbsp;
      <div @click="toggle('facs')" :class="{ TSactive: select.facs }" class="TSbutton">FACS</div>
      <div @click="toggle('trns')" :class="{ TSactive: select.trns }" class="TSbutton">DIPL</div>
      <div @click="toggle('text')" :class="{ TSactive: select.text }" class="TSbutton">TEXT</div>
      <div @click="toggle('anno')" :class="{ TSactive: select.anno }" class="TSbutton">ANNO</div>
      <div class="close">
        <btn @click.prevent="closeDialog">{{ $t('terms.close') }}</btn>
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
  position: absolute;
  width: 800px;
  height: 300px;
  background-color: white;
  border-radius: 5px;

  .close {
    position: absolute;
    top: 1em;
    right: 1em;
  }

  .TSbutton {
    display: inline-block;
    width: 3em;
    border: 1px solid gray;
    background-color: rgb(146, 118, 118);
    border-radius: 5pt;
  }
  .TSactive {
    background-color: lightgreen;
  }
}

</style>
