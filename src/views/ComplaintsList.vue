<template>
  <div>
    <complaint-dialog />
    <h1>{{ title }}</h1>
    <complaints-list />
  </div>
</template>

<script>
import n from '@/store/names'
import { mapGetters } from 'vuex'
import ComplaintsList from '@/components/ComplaintsList.vue'
import ComplaintDialog from '@/components/ComplaintDialog.vue'

export default {
  name: 'ComplaintsListView',
  components: {
    ComplaintsList,
    ComplaintDialog
  },
  computed: {
    ...mapGetters([n.getters.getWork]),
    workId () {
      return this.$route.params.id
    },
    workTitle () {
      const work = this.getWork(this.workId)
      return work?.label[0].title || work?.title[0].title
    },
    title () {
      const workTitle = this.workTitle
      const spidx = workTitle?.indexOf(' ')
      return this.$t('terms.complaints') + (spidx >= 0 ? ': ' + workTitle.substring(spidx + 1) : '')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
