<template>
  <div class="app-footer">
    &copy; {{ (new Date().getFullYear()) }} Beethovens Werkstatt
  </div>
</template>

<script>
export default {
  name: 'AppFooter',
  mounted () {
    console.log('footer')
  }
}
</script>

<style lang="scss" scoped>
.app-footer {
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 15pt;
  font-size: 12pt;
  color: gray;
  background-color: black;
}
</style>
