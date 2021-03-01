<template>
  <div class="complaint-container">
    <complaint-dialog />
    <div class="complaint-list">
      <div class="complaint-caption">
        Monita
      </div>
      <div
        :key="complaint['@id']"
        v-for="(complaint, ci) in complaints"
      >
        <div class="complaint-movement" v-if="checkMvt(complaint.movement.n)">{{ complaint.movement.n + '. ' + complaint.movement.label }}</div>
        <complaint-item
          :complaint="complaint"
          :index="ci"
        />
      </div>
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
  data () {
    return {
    }
  },
  name: 'ComplaintsList',
  computed: {
    ...mapGetters(['complaints'])
  },
  methods: {
    checkMvt (mvt) {
      const t = mvt !== this.mvt
      this.mvt = mvt
      return t
    }
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
.complaint-movement {
  display: table-row-group table-caption;
  font-weight: bold;
  text-align: center;
}
</style>
