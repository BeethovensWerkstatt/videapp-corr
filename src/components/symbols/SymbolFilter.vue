<template>
  <div class="symbol-filter" height="100%">
    <svg height="1.2em" viewBox="0 0 450 450" :class="SVGclass">
      <g transform="translate(0.000000,346.000000) scale(0.100000,-0.100000)"
        stroke="none">
        <path d="M197 3396 c-61 -22 -87 -47 -119 -115 -24 -52 -20 -125 9 -171 18
          -27 77 -96 822 -954 200 -230 370 -430 377 -445 11 -21 14 -131 14 -584 0
          -536 1 -559 20 -597 27 -53 560 -474 621 -490 78 -21 152 7 205 76 l29 37 5
          777 c4 670 7 780 20 796 17 22 757 876 900 1039 309 353 320 369 320 450 -1
          73 -73 164 -147 184 -26 8 -521 11 -1538 11 -1228 -1 -1507 -3 -1538 -14z
          m3013 -191 c0 -3 -262 -307 -582 -676 -368 -422 -594 -691 -613 -726 l-30 -57
          -5 -749 -5 -750 -237 187 -237 186 -3 563 -3 563 -30 57 c-19 35 -246 304
          -610 723 -319 367 -581 671 -583 675 -2 5 644 9 1467 9 809 0 1471 -2 1471 -5z" />
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'SymbolFilter',
  props: {
    SVGclass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.symbol-filter {
  svg {
    margin-top: .4em;
    fill: rgb(177, 177, 177);
  }
  svg.active {
    fill: blue !important;
  }
}
</style>
