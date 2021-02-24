<template>
  <div class="complaint-container">
    <complaint-dialog />
    <div class="complaint-list">
      <div class="complaint-caption">
        Monita
      </div>
      <complaint-item
        :key="complaint['@id']"
        v-for="(complaint, ci) in complaints"
        :complaint="complaint"
        :index="ci"
      />
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import ComplaintItem from '@/components/ComplaintItem.vue'
import ComplaintDialog from '@/components/ComplaintDialog.vue'

/**
 * component to display list of complaints
 *
 * @module components/ComplaintsList
 * @vue-computed {Object[]} complaints
 */
export default {
  components: { ComplaintItem, ComplaintDialog },
  name: 'ComplaintsList',
  computed: {
    ...mapGetters(['complaints'])
  }
}
</script>

<style lang="scss" scoped>
.complaint-container {
  max-height: 450px;
  overflow: scroll;
}
.complaint-list {
  display: table;
}
.complaint-caption {
  display: table-caption;
  font-weight: bold;
}
</style>
