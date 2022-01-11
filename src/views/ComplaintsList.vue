<template>
  <div>
    <complaint-dialog />
    <h1>{{ $t('terms.complaints') }}</h1>
    <complaints-list />
  </div>
</template>

<script>
import ComplaintsList from '@/components/ComplaintsList.vue'
import ComplaintDialog from '@/components/ComplaintDialog.vue'

export default {
  name: 'ComplaintsListView',
  components: {
    ComplaintsList,
    ComplaintDialog
  }
}
</script>

<style lang="scss" scoped>

</style>
