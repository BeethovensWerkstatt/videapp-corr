<template>
  <div class="dialog" :class="{ 'inactive': !this.active }">
    <div id="body">
      <pre style="text-align: left;">{{ JSON.stringify(this.complaint, null, 2) }}</pre>
    </div>
    <div id="close">
      <btn @click.prevent="closeDialog">close</btn>
    </div>
  </div>
</template>

<script>
import { mutations } from '@/store/names'

export default {
  name: 'ComplaintDialog',
  props: {
    complaint: {
      required: true
    }
  },
  computed: {
    active () {
      return this.$store.getters.activeComplaintId
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
  }
  #close {
    position: absolute;
    top: 1em;
    right: 1em;
  }
}

</style>
