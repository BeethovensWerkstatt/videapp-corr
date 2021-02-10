<template>
  <div class="complaint-container">
    <div class="complaint-list">
      <div class="complaint-caption">
        Monita
      </div>
      <complaint-item
        :key="complaint['@id']"
        v-for="complaint in complaints"
        :complaint="complaint"
      />
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import ComplaintItem from '@/components/ComplaintItem.vue'

export default {
  components: { ComplaintItem },
  name: 'ComplaintsList',
  computed: {
    ...mapGetters(['complaints'])
  }
}
</script>

<style lang="scss" scoped>
.complaint-container {
  height: 450px;
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
