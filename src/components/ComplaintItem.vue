<template>
  <div
    :title="complaint.movement.id"
    class="complaint-item"
  >
    <div class="complaint-attribute">{{ complaint.movement.n }}</div>
    <div class="complaint-attribute">{{ complaint.movement.label }}</div>
  </div>
</template>

<script>
export default {
  name: 'ComplaintItem',
  props: {
    complaint: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

.complaint-item {
  display: table-row;
}

.complaint-attribute {
  display: table-cell;
}

</style>
