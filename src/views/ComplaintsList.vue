<template>
  <div>
    <complaint-dialog />
    <h1>{{ $t('terms.complaints') }}</h1>
    <complaints-list />
  </div>
</template>

<script>
import ComplaintsList from '@/components/ComplaintsList.vue'

export default {
  name: 'ComplaintsListView',
  components: {
    ComplaintsList
  }
}
</script>

<style lang="scss" scoped>

</style>
