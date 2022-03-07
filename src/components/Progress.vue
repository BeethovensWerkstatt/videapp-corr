<template>
  <!--<div :class="{ 'progress': working }">🕛</div>-->
  <div :class="{ 'loading': working }"></div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Progress',
  computed: {
    ...mapGetters(['working'])
  },
  watch: {
    working () {
      // console.log('working: ' + this.working)
    }
  }
}
</script>

<style scoped>
.progress {
    display: inline-block;
    -webkit-animation-name: rotate;
    -webkit-animation-duration: 2s;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
    -moz-animation-name: rotate;
    -moz-animation-duration: 2s;
    -moz-animation-iteration-count: infinite;
    -moz-animation-timing-function: linear;
    animation-name: rotate;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}
@-webkit-keyframes rotate {
    from {-webkit-transform: rotate(0deg);}
    to {-webkit-transform: rotate(360deg);}
}

@-moz-keyframes rotate {
    from {-moz-transform: rotate(0deg);}
    to {-moz-transform: rotate(360deg);}
}

@keyframes rotate {
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
}
</style>
