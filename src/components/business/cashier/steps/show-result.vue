<template>
  <div v-if="active" class="cashier-main">
    <div class="cashier-title-bar">
      <div class="cashier-title-bar-left"></div>
      <div class="cashier-title-bar-right"></div>
      <div class="cashier-title-bar-content">验证中</div>
    </div>
    <div class="cashier-content cashier-content-result">
      <div ref="canvas" class="cashier-result-animation-container"></div>
      <div class="cashier-result-message-title">
        <template v-if="status === 'success'">验证成功</template>
        <template v-if="status === 'fail'">验证失败</template>
      </div>
      <div class="cashier-result-error-message">
        {{errorMessage}}
      </div>
      <div class="cashier-slogan">
        -包商银行为您安全护航-
      </div>
    </div>
  </div>
</template>

<script>
import base from './base';
import lottie from 'lottie-web/build/player/lottie_light.min';
import loadingAnimationData from './animations/loading.json';
import successAnimationData from './animations/success.json';
import errorAnimationData from './animations/error.json';
import successWav from './assets/pay.mp3';
export default {
  name: 'ShowResult',
  mixins: [base],
  data() {
    return {
      status: 'loading',
      errorMessage: '',
      successAudio: new Audio(successWav)
    };
  },
  mounted() {
    const canvas = this.$refs.canvas;
    const loading = lottie.loadAnimation({
      container: canvas,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: loadingAnimationData
    });
    if (typeof this.options.callback !== 'function') {
      return;
    }
    this.options.callback(
      () => {
        loading.destroy();
        this.status = 'success';
        lottie.loadAnimation({
          container: canvas,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          animationData: successAnimationData
        });
        this.successAudio.play();
      },
      err => {
        loading.destroy();
        this.status = 'fail';
        this.errorMessage = err.em || '系统忙碌，交易结果未知。请您通过账户交易明细查询交易状态，避免重复交易。';
        lottie.loadAnimation({
          container: canvas,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          animationData: errorAnimationData
        });
      }
    );
  }
};
</script>

<style lang="stylus">
  .cashier-content.cashier-content-result
    margin 0
  .cashier-result-animation-container
    width 120px
    height 120px
    margin 13px auto 7px
  .cashier-result-message-title
    font-size 16px
    color #595959
    text-align center
  .cashier-result-error-message
    width 70%
    font-size 13px
    color #898989
    margin 10px auto 0
    text-align center
</style>
