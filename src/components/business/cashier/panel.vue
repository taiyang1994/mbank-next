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
            :options="options"
            @accomplish="stepAccomplish('confirm-information')"
            @close="close"
          />
          <enter-static-password
            v-if="name === 'enter-static-password' && stepName === name"
            :active="stepName === name"
            :options="options"
            @accomplish="stepAccomplish('enter-static-password')"
            @close="close"
          />
          <enter-verification-code
            v-if="name === 'enter-verification-code' && stepName === name"
            :active="stepName === name"
            :options="options"
            @accomplish="stepAccomplish('enter-verification-code')"
            @close="close"
          />
          <enter-static-password
            v-if="name === 'enter-certification-password' && stepName === name"
            :active="stepName === name"
            type="certification"
            :options="options"
            @accomplish="stepAccomplish('enter-certification-password')"
            @close="close"
          />
          <show-result
            v-if="name === 'show-result' && stepName === name"
            :active="stepName === name"
            :options="options"
            @close="close"
          />
        </md-transition>
      </div>
    </md-popup>
  </div>
</template>

<script>
import Popup from '@mand-mobile/popup/index';
import Button from '@mand-mobile/button/index';
import Transition from '@mand-mobile/transition/index';
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
  props: {
    options: {
      type: Object,
      default: Object
    }
  },
  data() {
    return {
      step: 0,
      isShow: false,
      verificationCode: ''
    };
  },
  computed: {
    steps() {
      const path = this.options.steps.path.split('');
      if (path.length === 5) {
        path.length = 4;
      }

      const steps = [];

      // 确认信息
      if (this.options.steps.confirm.show) {
        steps.push('confirm-information');
      }

      path.forEach((digit, index) => {
        switch (index) {
          case 0:
            if (parseInt(digit, 10)) {
              steps.push('enter-static-password');
            }
            break;
          case 1:
            if (parseInt(digit, 10)) {
              steps.push('enter-verification-code');
            }
            break;
          case 2:
            break; // token已废弃
          case 3:
            if (parseInt(digit, 10)) {
              steps.push('enter-certification-password');
            }
            break;
        }
      });

      // 展示结果
      if (this.options.steps.result.show) {
        steps.push('show-result');
      }

      return steps;
    },
    stepName() {
      return this.steps[this.step];
    }
  },
  mounted() {
    //
  },
  methods: {
    show() {
      this.isShow = true;
    },
    close() {
      this.isShow = false;
      this.$el.parentNode.removeChild(this.$el);
    },
    stepAccomplish(stepName) {
      if (stepName === this.steps[this.steps.length - 1]) {
        this.$emit('accomplish', this.options);
      }
      else {
        this.step++;
      }
    }
  }
};
</script>

<style lang="stylus">
  @import "./../../theme.variables.styl"
  .cashier .md-popup
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
    .cashier-slogan
      height 28px
      line-height 28px
      font-size 20px
      transform scale(0.5)
      transform-origin center bottom
      color #c9c9c9
      text-align center
      position absolute
      bottom 30px
      left 0
      right 0
</style>
