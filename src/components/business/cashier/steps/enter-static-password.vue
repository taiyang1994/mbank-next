<template>
  <div v-if="active" class="cashier-main">
    <div class="cashier-title-bar">
      <div class="cashier-title-bar-left">
        <md-button type="link" inline @click="close">关闭</md-button>
      </div>
      <div class="cashier-title-bar-content">请输入<b>{{passwordTypeName}}</b>密码</div>
    </div>
    <div class="cashier-content cashier-content-bottom-keyboard">
      <keyboard @dial-done="verifyPassword"></keyboard>
    </div>
  </div>
</template>

<script>
import base from './base';
import Keyboard from './../../keyboard';
export default {
  name: 'EnterStaticPassword',
  components: {
    [Keyboard.name]: Keyboard
  },
  mixins: [base],
  props: {
    passwordTypeName: {
      type: String,
      default: ''
    }
  },
  methods: {
    verifyPassword() {
      setTimeout(() => {
        this.accomplish();
      }, 500);
    }
  }
};
</script>

<style lang="stylus">
  .cashier-content.cashier-content-bottom-keyboard
    margin 10px 0 0
    padding 0 17px
    padding-bottom 406px
    .safe-password
      position absolute
      bottom 0
      left 0
      right 0
</style>
