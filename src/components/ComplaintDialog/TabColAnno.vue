<template>
  <div class="annotext" :class="{ ['anno-' + state]: true, anno: true, [state]: true }">
    <h2>{{ $t("terms.complaint.description") }}</h2>
    <div class="tags" v-if="tags">
      <!-- objects, classes, context, operation -->
      <div class="objects" v-if="tags['objects'].length > 0">
        <span class="title">{{ $t('terms.complaint.revision-object') }}: </span>
        <span v-for="(o,i) in tags['objects']" :key="o + '_' + i"><span v-if="i > 0">, </span>{{ $t('taxonomy.' + o) }}</span>
      </div>
      <div class="operation" v-if="tags['operation'].length > 0">
        <span class="title">{{ $t('terms.complaint.text-operation') }}: </span>
        <span v-for="(o,i) in tags['operation']" :key="o + '_' + i"><span v-if="i > 0">, </span>{{ $t('taxonomy.' + o) }}</span>
      </div>
      <div class="classes" v-if="tags['classes'].length > 0">
        <span class="title">{{ $t('terms.complaint.classification') }}: </span>
        <span v-for="(o,i) in tags['classes']" :key="o + '_' + i"><span v-if="i > 0">, </span>{{ $t('taxonomy.' + o) }}</span>
      </div>
      <div class="context" v-if="tags['context'].length > 0">
        <span class="title">{{ $t('terms.complaint.context') }}: </span>
        <span v-for="(o,i) in tags['context']" :key="o + '_' + i"><span v-if="i > 0">, </span>{{ $t('taxonomy.' + o) }}</span>
      </div>
    </div>
    <div class="comment" v-html="anno"/>
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
    tags: {
      type: Object,
      default: () => undefined
    },
    anno: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },
  watch: {
    tags () {
      console.log(this.tags)
    }
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
.annotext {
  overflow: auto;

  h2 {
      text-align: left;
      font-size: 1rem;
      font-weight: 400;
      margin: 0.5rem 0rem .2rem;
      padding: 0;
      background-color: #f5f5f5;
  }
  .comment {
    margin-top: 1rem;
    text-align: left;
  }
  .tags {
    text-align: left;
    background-color: #f5f5f5;
    .title {
      font-weight: bold;
    }
  }
}
</style>
