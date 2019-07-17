<template>
  <div />
</template>

<script>
import base from './base';
import Keyboard from './../../keyboard';

export default {
  name: 'EnterPasswordBase',
  components: {
    [Keyboard.name]: Keyboard
  },
  mixins: [base],
  data() {
    return {
      enterEventIdPrefix: '',
      hiddenSafeKeyboard: this.options.context.safeKeyboard,
      hiddenSafeKeyboardId: 'hiddenSafeKeyboard'
    };
  },
  mounted() {
    this.hiddenSafeKeyboard.initCompleteKeyboard(this.hiddenSafeKeyboardId, this.options.transaction.random);
  }
};
</script>

<style lang="stylus">
  .cashier-content.cashier-content-bottom-keyboard
    margin 0
    padding 0 17px
    padding-bottom 406px
    .safe-password
      position absolute
      bottom 0
      left 0
      right 0
</style>
