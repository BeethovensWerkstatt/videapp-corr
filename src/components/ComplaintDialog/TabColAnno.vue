<template>
  <div class="annotext">
    <h2>{{ $t("terms.complaint.description") }}</h2>
    <div v-html="anno"/>
  </div>
</template>

<script>
/**
 * @module components/ComplaintDialog/TabColAnno
 * @vue-prop {String} anno - text/html of annotation
 */
export default {
  name: 'ComplaintDialogTabColAnno',
  props: {
    anno: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.annotext {
  resize: vertical;
  overflow: auto;

  h2 {
      text-align: left;
      font-size: 1rem;
      font-weight: 400;
      margin: 0.5rem 0rem .2rem;
      padding: 0;
      background-color: #f5f5f5;
  }
}
</style>
