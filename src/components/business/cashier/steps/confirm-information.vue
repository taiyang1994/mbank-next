<template>
  <div v-if="active" class="cashier-main">
    <div class="cashier-title-bar">
      <div class="cashier-title-bar-left">
        <md-button type="link" inline @click="close">关闭</md-button>
      </div>
      <div class="cashier-title-bar-content">确认信息</div>
    </div>
    <div class="cashier-content cashier-content-bottom-button">
      <div class="cashier-confirm-information-content">
        <div v-for="item in infos" class="cashier-confirm-information-row">
          <div>{{item.key}}</div>
          <div>{{item.value}}</div>
        </div>
      </div>
      <md-button type="primary" class="cashier-title-confirm-button" @click="accomplish">确&#12288认</md-button>
    </div>
  </div>
</template>

<script>
import base from './base';
export default {
  name: 'ConfirmInformation',
  mixins: [base],
  props: {
    infos: {
      type: Array,
      default: Array
    }
  }
};
</script>

<style lang="stylus">
  .cashier-content.cashier-content-bottom-button
    padding-bottom 60px
  .cashier-title-confirm-button
    position absolute
    bottom 0
    left 0
    right 0
    &.md-button.primary
      height 40px
      line-height 40px
  .cashier-confirm-information-row
    height 36px
    line-height 36px
    font-size 14px
    clearfix()
    div:first-child
      float left
      color #898989
    div:last-child
      float right
      color #333
</style>
