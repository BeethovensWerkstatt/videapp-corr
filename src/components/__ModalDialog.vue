<template>
  <div class="dialogBack" :class="{ 'inactive': !this.active }">
    <div class="dialog" :style="styles">
      <div class="head" v-if="active">
        <div class="title">
          <div class="titletext" v-html="title" />
          <div class="subtitletext" v-html="subtitle" />
        </div>
      </div>
      <div class="body" v-if="active">
      </div>
    </div>
  </div>
</template>

<script>
// Maybe later ...
export default {
  name: 'ModalDialog'
}
</script>

<style lang="scss" scoped>

.dialogBack {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
  background-color: rgba(0,0,0,.3);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.inactive {
  display: none;
}

.dialog {
  position: absolute;
  left: 1rem;
  top: 1rem;
  // TODO ??
  width: calc(100% - 2rem);
  height: calc(100% - 2rem);
  border-radius: 5px;
  background-color: white;
  border: .5px solid #666666;
  box-shadow: 0 0 .8rem #00000066;
  border-radius: .3rem;

  .head {
    height: 3rem;
    border-bottom: 1px solid gray;
    padding-left: 1em;
    text-align: left;
    background: linear-gradient(180deg, #cccccc 0%, #f5f5f5 100%);
    border-radius: .3rem .3rem 0 0;
    .title {
      display: inline-block;
      width: 50%;
      .titletext {
        font-weight: bold;
        font-size: 110%;
        margin-top: 3pt;
      }
    }
  }

  .body {
    width: 100%;
    height: calc(100% - 80px);
    overflow: scroll;
  }
  .close {
    position: absolute;
    top: 1em;
    right: 1em;
  }
}

</style>
