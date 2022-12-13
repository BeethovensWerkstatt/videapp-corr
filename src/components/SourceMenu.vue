<template>
  <div class="dropdown">
    <a class="dropdown-toggle" href="#" tabindex="0" @click.prevent="toggleMenu">
      &#x2630;
    </a>
    <ul class="menu srcMenu">
      <li class="menu-item">
        <button class="customBtn btn btn-link" @click="showOverview()">
          Document Overview
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SourceMenu',
  props: {
  },
  computed: {
  },
  methods: {
    toggleMenu () {
      console.log('toggleMenu')
    },
    showOverview () {
      console.log('display page overview ...')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// @import '@/css/_variables.scss';

// This will determine the width of the menu
$srcMenuOffset: -200px;

.customBtn.btn.btn-link {
   text-align: left;
   margin: 0;
   padding: 0;
   border: none;
}

.btn.dropdown-toggle, .btn.dropdown-toggle:active, .btn.dropdown-toggle:hover, .btn.dropdown-toggle:focus {
  // color: $lightFontColor;
  border: none;
  box-shadow: none;
  font-size: 100%;
}

.srcMenu {
  width: calc(abs($srcMenuOffset) + 100px);
  left: $srcMenuOffset !important;

  // color: $darkFontColor;
  font-weight: 300;

  .icon {
    font-size: .7rem;
    position: relative;
    top: -1px;
    padding-right: 5px;
  }
}
</style>
