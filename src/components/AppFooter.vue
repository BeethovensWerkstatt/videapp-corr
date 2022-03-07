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
@import "@/scss/variables.scss";

.app-footer {
  text-align: right;
  padding: 0 1rem;
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 15pt;
  font-size: .6rem;
  font-weight: 100;
  color: darken($background-flat, 20%);
  box-shadow: 0 3px 5px rgba(0,0,0,0.5) inset;
  background-color: #333333;
  background-image: -webkit-linear-gradient(top, #333333, #151515);
  background-image: linear-gradient(to bottom, #333333, #151515);
}
</style>
