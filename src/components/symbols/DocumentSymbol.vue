<template>
  <div class="symbol-document" height="100%">
    <svg viewBox="0 0 150 145" :height="height">
      <path
        :fill="color"
        d="M89.632,142.298c-1.1,0-2,0.1-2-1v-13c0-3.7-3.8-7-8.2-7h-9.6v-4h9.5c6.6,0,12.2,5,12.2,11v13C91.632,142.398,90.732,142.298,89.632,142.298z"
      />
      <path
        :fill="color"
        d="M119.532,143.298h-30.9c-0.5,0-1-0.2-1.4-0.6l-20.3-20.3c-0.4-0.3-0.6-0.8-0.6-1.4v-50.1c0-8.2,6.6-14.8,14.8-14.8h38.4c8.2,0,14.8,6.6,14.8,14.8v57.6C134.332,136.698,127.732,143.298,119.532,143.298z M89.432,139.298h30.1c6,0,10.8-4.8,10.8-10.8v-57.6c0-6-4.8-10.8-10.8-10.8h-38.4c-6,0-10.8,4.8-10.8,10.8v49.3L89.432,139.298z"
      />
      <path
        :fill="color"
        d="M115.732,83.598h-32c-1.1,0-2-0.9-2-2s0.9-2,2-2h32c1.1,0,2,0.9,2,2S116.832,83.598,115.732,83.598z"
      />
      <path
        :fill="color"
        d="M115.732,95.598h-32c-1.1,0-2-0.9-2-2s0.9-2,2-2h32c1.1,0,2,0.9,2,2S116.832,95.598,115.732,95.598z"
      />
      <path
        :fill="color"
        d="M115.732,107.598h-32c-1.1,0-2-0.9-2-2s0.9-2,2-2h32c1.1,0,2,0.9,2,2S116.832,107.598,115.732,107.598z"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'DocumentSymbol',
  props: {
    height: {
      type: String,
      default: '1.2em'
    },
    color: {
      type: String,
      default: 'black'
    }
  }
}
</script>

<style lang="scss" scoped>
.symbol-document {
  display: inline-block;
}
</style>
