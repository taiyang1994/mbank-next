<template>
  <div class="cashier">
    <md-popup
      v-model="isShow"
      has-mask
      lighter-mask
      prevent-scroll
      :mask-closable="false"
      position="bottom"
    >
      <div id="cashier" class="cashier-container">
        <md-transition v-for="(name, index) in steps" :key="index" name="md-wheel-left">
          <confirm-information
            v-if="name === 'confirm-information' && stepName === name"
            :active="stepName === name"
            :infos="[
              {key: '转账金额', value: '50,001.00元'},
              {key: '金额大写', value: '伍万零壹元整'},
              {key: '收款户名', value: '王小石'},
              {key: '收款账户', value: '6214 8501 1872 2971'},
              {key: '开户行', value: '招商银行'},
              {key: '分支行', value: '招商银行股份有限公司北京东四环支行'},
              {key: '付款账号', value: '6217 **** **** 6049'},
              {key: '手续费', value: '0.00元'},
              {key: '转账用途', value: '手机银行转账'}
            ]"
            @accomplish="next"
            @close="close"
          />
          <enter-static-password
            v-if="name === 'enter-static-password' && stepName === name"
            :active="stepName === name"
            password-type-name="卡片取款"
            @accomplish="next"
            @close="close"
          />
          <enter-verification-code
            v-if="name === 'enter-verification-code' && stepName === name"
            :active="stepName === name"
            @confirm="verificationCodeConfirmed"
            @close="close"
          />
          <show-result
            v-if="name === 'show-result' && stepName === name"
            :active="stepName === name"
            @close="close"
          />
        </md-transition>
      </div>
    </md-popup>
  </div>
</template>

<script>
import Popup from '@mand-mobile/popup';
import Button from '@mand-mobile/button';
import Transition from '@mand-mobile/transition';
import ConfirmInformation from './steps/confirm-information';
import EnterStaticPassword from './steps/enter-static-password';
import EnterVerificationCode from './steps/enter-verification-code';
import ShowResult from './steps/show-result';
export default {
  name: 'Cashier',
  components: {
    EnterStaticPassword,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [Transition.name]: Transition,
    [ConfirmInformation.name]: ConfirmInformation,
    [EnterStaticPassword.name]: EnterStaticPassword,
    [EnterVerificationCode.name]: EnterVerificationCode,
    [ShowResult.name]: ShowResult
  },
  data() {
    return {
      step: 0,
      steps: [
        'confirm-information',
        'enter-static-password',
        'enter-verification-code',
        'show-result'
      ],
      isShow: false,

      verificationCode: ''
    };
  },
  computed: {
    stepName() {
      return this.steps[this.step];
    }
  },
  methods: {
    show() {
      this.isShow = true;
    },
    close() {
      this.isShow = false;
      this.$el.parentNode.removeChild(this.$el);
    },
    next() {
      this.step++;
    },
    verificationCodeConfirmed(code) {
      this.verificationCode = code;
      this.next();
    }
  }
};
</script>

<style lang="stylus">
  @import "./../../theme.variables.styl"
  .md-popup
    display block !important
    .md-popup-box.md-slide-up
      position fixed
      bottom 0
  .cashier-container
    background #fff
    height 464px
    position relative
  .cashier-main
    position absolute
    top 0
    left 0
    width 100%
    height 100%
  .cashier-title-bar
    border-bottom 1px solid #eaeaea
    box-sizing border-box
    font-size 18px
    color #333333
    font-weight 500
    height 58px
    b
      color color-primary
    .cashier-title-bar-left,
    .cashier-title-bar-right
      height 100%
      padding 14px 17px
      box-sizing border-box
      .md-button
        padding 0 3px
        font-size 16px
        height 30px
        line-height 30px
    .cashier-title-bar-left
      float left
      .md-button.link.inline
        padding-left 0
        color #898989
        .md-button-inner .md-button-content
          padding-left 0
    .cashier-title-bar-right
      float right
    .cashier-title-bar-content
      margin 0 80px
      text-align center
      line-height 58px
  .cashier-content
    margin 10px 17px 20px
    position absolute
    top 58px
    left 0
    right 0
    bottom 0
    box-sizing border-box
</style>
