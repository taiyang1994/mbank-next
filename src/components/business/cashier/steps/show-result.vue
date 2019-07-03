<template>
  <div v-if="active" class="cashier-main">
    <div class="cashier-title-bar">
      <div class="cashier-title-bar-left">
        <md-button type="link" inline @click="close">关闭</md-button>
      </div>
      <div class="cashier-title-bar-right">
        <md-button type="primary-flat" inline @click="accomplish">确认</md-button>
      </div>
      <div class="cashier-title-bar-content">操作成功</div>
    </div>
    <div>Congratulations!!!</div>
  </div>
</template>

<script>
import base from './base';
export default {
  name: 'ShowResult',
  mixins: [base]
};
</script>

<style scoped>

</style>
