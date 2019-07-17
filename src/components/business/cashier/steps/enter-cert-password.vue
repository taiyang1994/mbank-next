<template>
  <div v-if="active" class="cashier-main">
    <div class="cashier-title-bar">
      <div class="cashier-title-bar-left">
        <md-button type="link" inline @click="close">关闭</md-button>
      </div>
      <div class="cashier-title-bar-content">请输入数字证书密码</div>
    </div>
    <div class="cashier-content cashier-content-bottom-keyboard">
      <div id="hiddenSafeKeyboard" style="display: none;" />
      <keyboard ref="keyboard" @dial-done="keyboardDialDone" @forget="forget" />
    </div>
  </div>
</template>

<script>
import enterPasswordBase from './enter-password-base';

export default {
  name: 'EnterStaticPassword',
  mixins: [enterPasswordBase],
  data() {
    return {
      enterEventIdPrefix: '00900021',
      hiddenSafeKeyboard: this.options.context.safeKeyboard,
      password: '',
      optionsQueryString: this.formatQueryString({...this.options, context: false})
    };
  },
  computed: {
    //
  },
  mounted() {
    //
  },
  methods: {
    keyboardDialDone(password) {
      this.track('00900005');
      this.password = password;

      // eslint-disable-next-line new-cap
      this.options.context.certificate.CFCAInquireCertificate(this.onInquireCertSuccess, this.onInquireCertFail);
    },
    onInquireCertSuccess(data) {
      const {mui, certificate, mbank} = this.options.context;
      const {pinState, pinServerRandom} = data;
      if (parseInt(pinState, 10) === 3) {
        this.password = '';
        mui.alert('密码输入错误次数达到或超过上限，今天不能使用密码业务');
        return;
      }

      const id = this.hiddenSafeKeyboardId;
      const sipHandle = new window.HKE.SIPHandle(id);
      sipHandle.setServerRandom(id, pinServerRandom);
      var password = sipHandle.getEncryptedValue(id, this.password);
      var passwordRandom = sipHandle.getEncryptedClientRandom(id);

      // eslint-disable-next-line new-cap
      certificate.CFCASignMessage(
        this.optionsQueryString, password, passwordRandom, mbank.getCfcaUrl(),
        this.onCertSignSuccess, this.onCertSignFail
      );
    },
    onInquireCertFail(data) {
      const {mui, mbank} = this.options.context;
      if (!data) {
        this.password = '';
        mui.alert('查询失败，请重新操作');
        return;
      }
      const {payload} = data;
      if (parseInt(payload, 10) === 1) {
        const {cfcaFlag, bsCode} = this.options.steps.cert;
        mbank.openWindowByLoad('_www/views/cfca/cfcavalidate3.html', 'cfcavalidate3', 'pop-in', {
          cfcaFlag,
          bsCode
        });
      }
      else {
        window.plus && plus.nativeUI.showWaiting('下载中...', {});

        // eslint-disable-next-line new-cap
        this.options.context.certificate.CFCADownloadCertificate(this.onDownloadCertSuccess, this.onDownloadCertFail);
      }
    },
    onDownloadCertSuccess(data) {
      window.plus && plus.nativeUI.closeWaiting();
      const {mbank, mui} = this.options.context;
      const {cfcaFlag, bsCode} = this.options.steps.cert;
      mui.toast('证书下载成功');
      mbank.openWindowByLoad('_www/views/cfca/cfcavalidate3.html', 'cfcavalidate3', 'pop-in', {
        serialNumber: data.serialNumber,
        issuerDN: data.issuerDN,
        notBefore: data.notBefore,
        notAfter: data.notAfter,
        subjectDN: data.subjectDN,
        subjectCN: data.subjectCN,
        UUID: window.localStorage.getItem('UUID'),
        certSn: data.certSn,
        businessCode: '',
        currentBusinessCode: '00300187',
        cfcaFlag,
        bsCode
      });
    },
    onDownloadCertFail(err) {
      window.plus && plus.nativeUI.closeWaiting();
      this.options.context.mui.alert(err.message);
    },
    onCertSignSuccess(data) {
      const {transaction, steps, context} = this.options;
      const {mbank} = context;
      mbank.apiSend('post', 'QueryHKEVerifySign.do', {
        orgContent: this.optionsQueryString,
        signContent: data.signResult,
        queryFlowNo: data.businessRunningNo,
        currentBusinessCode: '00300184',
        security: steps.path,
        OrderNo: transaction.id
      }, this.onCertPasswordCheckSuccess, this.onCertPasswordCheckFail, true);
    },
    onCertSignFail() {
      this.track('00900019');
      this.password = '';
    },
    onCertPasswordCheckSuccess(data) {
      this.track('00900013');

      const {context, carries} = this.options;
      if (carries.bsnCode && carries.bsnCode === '00900301') {
        if (!data.signResult || !data.businessRunningNo) {
          context.mui.alert('获取签名数据异常');
          return;
        }
        carries.signResultForECreditLoad = data.signResult;
        carries.businessRunningNoForECreditLoad = data.businessRunningNo;
      }

      this.accomplish();
    },
    onCertPasswordCheckFail(err) {
      this.password = '';
      this.options.context.mui.alert(err.em);
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
      this.options.context.mui.confirm(
        '如您忘记数字证书密码，可通过注销数字证书后重新申请数字证书重置，是否进入注销页面',
        '',
        ['确认', '取消'],
        e => {
          if (e.index === 0) {
            this.options.context.mbank.openWindowByLoad(
              '_www/views/identityAuth/cfcaStatus.html', 'cfcaStatus', 'pop-in', {
                'preId': this.options.page.id
              }
            );
          }
        }
      );
    },
    formatQueryString(obj) {
      const result = [];
      function walk(obj) {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (['string', 'number', 'boolean'].includes(typeof obj[key])) {
              result.push(`${key}=${obj[key]}`);
            }
            else if (typeof obj[key] === 'object') {
              walk(obj[key]);
            }
          }
        }
      }
      walk(obj);
      return result.join('&');
    }
  }
};
</script>
