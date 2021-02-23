<template>
  <div :id="id" v-html="svg">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'VerovioComponent',
  props: {
    id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      svg: '<span>...|||III|||...</span>'
    }
  },
  mounted () {
    if (this.url && this.url.length > 0) {
      axios.get(this.url).then(({ data }) => {
        this.svg = this.vrvRender(data)
      })
    }
  },
  computed: {
    ...mapGetters(['vrvRender'])
  }
}
</script>

<style scoped>

</style>
