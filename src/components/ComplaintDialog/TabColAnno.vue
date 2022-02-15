<template>
  <div class="annotext" :class="{ ['anno-' + state]: true, anno: true, [state]: true }">
    <h2>{{ $t("terms.complaint.description") }}</h2>
    <div class="tags" v-if="tags && state === 'revision'">
      <!-- objects, classes, context, operation -->
      <!--
      <div class="objects" v-if="tags['objects'].length > 0">
        <span class="title">{{ $t('terms.complaint.revision-object') }}: </span>
        <span v-for="(o,i) in tags['objects']" :key="o + '_' + i"><span v-if="i > 0">, </span>{{ $t('taxonomy.' + o) }}</span>
      </div>
      -->
      <div class="operation" v-if="tags['operation'].length > 0">
        <span class="title">{{ $t('terms.complaint.text-operation') }} <a class="glossaryLink" target="_blank" rel="noopener noreferrer" href="https://beethovens-werkstatt.de/glossary/textoperation/"><i class="icon icon-link"></i></a>: </span>
        <span v-for="(o,i) in tags['operation']" :key="o + '_' + i"><span v-if="i > 0">, </span>{{ $t('taxonomy.' + o) }}</span>
      </div>
      <div class="classes" v-if="tags['classes'].length > 0">
        <span class="title">{{ $t('terms.complaint.classification') }} <a class="glossaryLink" target="_blank" rel="noopener noreferrer" href="https://beethovens-werkstatt.de/glossary/aenderungsmassnahmen-klassifizierung/"><i class="icon icon-link"></i></a>: </span>
        <span v-for="(o,i) in tags['classes']" :key="o + '_' + i"><span v-if="i > 0">, </span>{{ $t('taxonomy.' + o) }}</span>
      </div>
      <div class="context" v-if="tags['context'].length > 0">
        <span class="title">{{ $t('terms.complaint.context') }} <a class="glossaryLink" target="_blank" rel="noopener noreferrer" href="https://beethovens-werkstatt.de/glossary/kontextzitat/"><i class="icon icon-link"></i></a>: </span>
        <span v-for="(o,i) in tags['context']" :key="o + '_' + i"><span v-if="i > 0">, </span>{{ $t('taxonomy.' + o) }}</span>
      </div>
    </div>
    <div class="tags" v-if="tags && state === 'post'">
      <div class="implementation" v-if="tags['implementation'].length > 0">
        <span class="title">{{ $t('terms.complaint.implementation') }} <a class="glossaryLink" target="_blank" rel="noopener noreferrer" href="https://beethovens-werkstatt.de/glossary/aenderungsimperativ/"><i class="icon icon-link"></i></a>: </span>
        <span v-for="(o,i) in tags['implementation']" :key="o + '_' + i"><span v-if="i > 0">, </span>{{ $t('taxonomy.' + o) }}</span>
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
  cursor: default;

  h2 {
    text-align: left;
    font-size: .8rem;
    font-weight: 500;
    margin: 0.5rem 0rem .2rem;
    padding: .3rem;
    background-color: #ECB577;
    border: 1px solid #333333;
    cursor: default;
  }

  .glossaryLink {
     color: #666666;
     font-size: 100;
 }

  .comment {
    margin-top: 1rem;
    text-align: left;
  }
  .tags {
    text-align: left;
    background-color: #f5f5f5;
    padding: 0 .2rem;
    font-weight: 300;
    .title {
      font-weight: 700;
    }
  }
}
</style>
