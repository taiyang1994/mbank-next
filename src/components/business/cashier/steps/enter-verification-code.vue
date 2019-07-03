<template>
  <div v-if="active" class="cashier-main">
    <div class="cashier-title-bar">
      <div class="cashier-title-bar-left">
        <md-button type="link" inline @click="close">关闭</md-button>
      </div>
      <div class="cashier-title-bar-right">
        <md-button type="primary-flat" inline :disabled="code.length !== 6" @click="confirm">确认</md-button>
      </div>
      <div class="cashier-title-bar-content">输入验证码</div>
    </div>
    <div class="cashier-content cashier-content-native-keyboard">
      <div class="cashier-verification-mobile">
        已发送至手机 <span>{{mobile | phoneNumberMask}}</span>
      </div>
      <div class="cashier-verification-main">
        <input ref="input" v-model="code" type="tel" maxlength="6">
        <div ref="fakeInput" class="cashier-fake-input-contaier" @click="$_handleInClick">
          <div v-show="code.length === 0" class="cashier-fake-input-placeholder">请输入验证码</div>
          <span v-for="i in 6" :key="i"
            :class="{
              'is-active': focused && i - 1 === code.length,
              'is-filled': i <= code.length
            }">
            {{code.charAt(i - 1)}}
          </span>
          <span :class="{'fake-cursor': code.length === 6 && focused}"></span>
        </div>
        <md-button type="primary-flat" :disabled="cooldown > 0" @click="sendCodeRequest" inline>
          {{cooldown ? `重新获取(${cooldown}s)` : '获取短信'}}
        </md-button>
      </div>
      <div class="cashier-verification-help">
        收不到验证码？
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import base from './base';
import filters from '../../../../filters';
Vue.filter('phoneNumberMask', filters.phoneNumberMask);

const openSoftKeyboard = function (input) {
  if (window.plus) {
    if (plus.os.name === 'iOS') {
      var webView = plus.webview.currentWebview().nativeInstanceObject();
      webView.plusCallMethod({
        'setKeyboardDisplayRequiresUserAction': false
      });
    }
    else {
      var Context = plus.android.importClass('android.content.Context');
      var InputMethodManager = plus.android.importClass('android.view.inputmethod.InputMethodManager');
      var main = plus.android.runtimeMainActivity();
      var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
      imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
    }
  }

  input.focus();
};

export default {
  name: 'EnterVerificationCode',
  components: {
    //
  },
  mixins: [base],
  data() {
    return {
      mobile: '13754024286',
      cooldown: 0,
      cooldownTimer: 0,
      code: '',
      focused: false
    };
  },
  watch: {
    //
  },
  mounted: async function () {
    const input = this.$refs.input;
    input.addEventListener('focus', () => {
      this.focused = true;
    }, false);
    input.addEventListener('blur', () => {
      this.focused = false;
    }, false);
    document.addEventListener('click', this.$_handleOutClick);

    await this.sendCodeRequest();
    openSoftKeyboard(this.$refs.input);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.$_handleOutClick);
  },
  methods: {
    confirm() {
      this.$emit('confirm', this.code);
    },
    setFocus() {
      this.$refs.input.focus();
    },
    setBlur() {
      this.$refs.input.blur();
    },
    $_handleInClick() {
      this.setFocus();
    },
    $_handleOutClick(e) {
      if (e.target !== this.$refs.fakeInput && !this.$refs.fakeInput.contains(e.target)) {
        this.setBlur();
      }
    },
    sendCodeRequest: async function () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.startCountingDown();
          return resolve([1, 2, 3]);
        }, 1000);
      });
    },
    startCountingDown() {
      this.cooldown = 60;
      this.cooldownTimer = setInterval(() => {
        this.cooldown--;
        if (this.cooldown === 0) {
          clearInterval(this.cooldownTimer);
        }
      }, 1000);
    }
  }
};
</script>

<style lang="stylus">
  .cashier-verification-mobile
    font-size 12px
    margin-bottom 10px
    color #898989
    & > span
      color #333
  .cashier-verification-main
    border 1px solid #eaeaea;
    border-radius 4px
    height 56px
    padding 12px 15px
    box-sizing border-box
    position relative
    input
      opacity 0
      position fixed
      top 0
      left -9999px
    .md-button
      height 30px
      line-height 30px
      position absolute
      right 10px
      top 12px
      padding 0
  .cashier-verification-help
    font-size 12px
    text-align right
    color #898989
    margin-top 10px
  .cashier-fake-input-contaier
    height 30px
    width 120px
    font-size 18px
    position relative
    .cashier-fake-input-placeholder
      position absolute
      height 30px
      line-height 30px
      top 0
      left 0
      color: #c9c9c9
    span
      display inline-block
      float left
      font-size 18px
      height 30px
      line-height 30px
      &.is-active,
      &.fake-cursor
        &:after
          content ""
          display block
          width 2px
          height 100%
          background #3264CC
          animation blink steps(1, start) 1s infinite
  @keyframes blink
    0%
      opacity 0
    50%
      opacity 1
    100%
      opacity 0
</style>
