<template>
  <div v-if="active" class="cashier-main">
    <div class="cashier-title-bar">
      <div class="cashier-title-bar-left">
        <md-button type="link" inline @click="close">关闭</md-button>
      </div>
      <div class="cashier-title-bar-content">{{options.steps.confirm.title || '确认信息'}}</div>
    </div>
    <div class="cashier-content cashier-content-bottom-button">
      <div class="cashier-confirm-information-content">
        <div v-for="(item, index) in infos" :key="index" class="cashier-confirm-information-row">
          <div>{{item[0]}}</div><div>{{item[1]}}</div>
        </div>
      </div>
      <md-button type="primary" class="cashier-title-confirm-button" @click="confirm">
        {{options.steps.confirm.btnText || '确&#12288;认'}}
      </md-button>
    </div>
  </div>
</template>

<script>
import base from './base';
export default {
  name: 'ConfirmInformation',
  mixins: [base],
  data() {
    return {
      enterEventIdPrefix: '00900015'
    };
  },
  computed: {
    infos() {
      return Object.entries(JSON.parse(this.options.steps.confirm.content));
    }
  },
  methods: {
    confirm() {
      this.track('00900002');
      this.accomplish();
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
