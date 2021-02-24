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
    this.loadMEI()
  },
  watch: {
    url () {
      this.loadMEI()
    }
  },
  computed: {
    ...mapGetters(['vrvRender']),
    options () {
      const opts = {}
      opts.scale = 30
      return opts
    }
  },
  methods: {
    loadMEI () {
      if (this.url && this.url.length > 0) {
        axios.get(this.url).then(({ data }) => {
          this.svg = this.vrvRender(data, this.options)
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
