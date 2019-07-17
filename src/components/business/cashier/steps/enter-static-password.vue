<template>
  <div v-if="active" class="cashier-main">
    <div class="cashier-title-bar">
      <div class="cashier-title-bar-left">
        <md-button type="link" inline @click="close">关闭</md-button>
      </div>
      <div class="cashier-title-bar-content">请输入<b>{{passwordTypeName}}</b>密码</div>
    </div>
    <div class="cashier-content cashier-content-bottom-keyboard">
      <div id="hiddenSafeKeyboard" style="display: none;" />
      <keyboard ref="keyboard" @dial-done="keyboardDialDone" @forget="forget" />
    </div>
  </div>
</template>

<script>
import enterPasswordBase from './enter-password-base';
import Enum from '@/enum';

export default {
  name: 'EnterStaticPassword',
  mixins: [enterPasswordBase],
  data() {
    return {
      enterEventIdPrefix: '00900020'
    };
  },
  computed: {
    passwordTypeName() {
      const card = this.options.card;
      const cardTypeConfig = Enum.CARD_TYPE.find(item => (item.value + '' === card.type + ''));
      if (cardTypeConfig && cardTypeConfig.alias === 'CreditCard') {
        const passwordTypeConfig = Enum.CREDIT_CARD_PASSWORD_TYPE.find(
          item => (item.value + '' === card.creditCardPasswordType + '')
        );
        return passwordTypeConfig ? passwordTypeConfig.text : Enum.CREDIT_CARD_PASSWORD_TYPE[0].text;
      }
      const cardPasswordTypeConfig = Enum.CARD_PASSWORD_TYPE.find(item => (item.value + '' === card.type + ''));
      return cardPasswordTypeConfig ? cardPasswordTypeConfig.text : Enum.CARD_PASSWORD_TYPE[0].text;
    }
  },
  mounted() {
    //
  },
  methods: {
    keyboardDialDone(password) {
      this.track('00900005');
      const encrypted = this.hiddenSafeKeyboard.getEncrypt(this.hiddenSafeKeyboardId, password).replace(/=/g, '') + '=';
      const {transaction, card, context, carries, steps} = this.options;
      const params = {
        OrderNo: transaction.id,
        security: steps.path,
        CHECKPASS: card.creditCardPasswordType,
        pass_type: '2',
        accountNo: card.cardNo,
        accountType: card.type,
        bp_id_flag: '1',
        pass_word: encrypted,
        srand_sid: transaction.randomId,
        currentBusinessCode: card.type === 'X' ? '20000267' : '00900002',
        session_customerId: carries.customerNo,
        certNo: carries.certNo || '',
        certType: carries.certType || '',
        PWDTYPE: carries.payPwdType,
        MOBILE: carries.MOBILE,
        flag: carries.flag,
        bsnCode: carries.bsnCode
      };
      context.acctInfo.checkPWD(params, this.onCheckPasswordSuccess, this.onCheckPasswordFail);
    },
    onCheckPasswordSuccess() {
      this.track('00900022');
      this.$refs.keyboard.clear();
      this.accomplish();
    },
    onCheckPasswordFail(err) {
      this.$refs.keyboard.clear();
      this.getServerRandom();

      const {carries, context, card} = this.options;
      if (err.ec === 'E009001') {
        this.track('00900025');
        if (carries.bsnCode === '00000002') {
          context.mui.alert('您尚未设置信用卡查询密码，请通过我行柜面、网银或95352电话客服设置后注册。');
        }
        else {
          context.mui.alert('未设置查询密码，请先设置', () => {
            context.mbank.openWindowByLoad('_www/views/creditCard/activationRate.html', 'activationRate', 'pop-in', {
              cardNo: card.cardNo,
              accountNo: carries.account,
              form: 'add'
            });
          });
        }
        return;
      }
      this.track('00900004');
      context.mui.alert(err.em);
    },
    getServerRandom() {
      const {transaction, context} = this.options;
      context.common.getSrandNumber(true, data => {
        transaction.randomId = data.split('|')[0];
        transaction.random = data.split('|')[1];

        this.hiddenSafeKeyboard.updateServerRandom(this.hiddenSafeKeyboardId, transaction.random);
      });
    },
    forget() {
      const alertMsg = typeof this.options.context.mui === 'object' ? this.options.context.mui.alert : window.alert;
      const cardTypeConfig = Enum.CARD_TYPE.find(item => (item.value + '' === this.options.card.type + ''));
      if (!cardTypeConfig) {
        alertMsg('如果您忘记卡片密码，请至我行柜面重置');
        return;
      }
      switch (cardTypeConfig.alias) {
        case 'IClassCard':
          alertMsg('忘记储蓄卡交易密码，请至我行柜面重置');
          return;
        case 'CreditCard':
          alertMsg('忘记信用卡交易密码或查询密码，可通过网银、95352或至我行柜面重置');
          return;
        case 'EleCard':
        case 'IIClassCard':
        case 'IIIClassCard':
          if (this.options.card.isVerified) {
            alertMsg('如果您忘记卡片密码，请至我行柜面重置');
          }
          // TODO 电子账户和二三类户未核身忘记密码，需要调用验证工具进行验证
          return;
        case 'QRCard':
          // TODO 二维码下挂卡需要调用人脸验证
          return;
      }
    }
  }
};
</script>
