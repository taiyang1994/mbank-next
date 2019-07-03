<template>
  <div id="app">
    <div class="section">
      <div @click="showCashier">点我显示收银台</div>
    </div>
    <div class="section no-padding">
      <div id="card1" />
    </div>
    <div class="section">
      <div @click="showFullDatePicker">显示年月日picker</div>
    </div>
    <div class="section">
      <div @click="showMonthDatePicker">显示月日picker</div>
    </div>
    <div class="section">
      <div @click="showDatePicker">显示日picker</div>
    </div>
    <div class="section">
      <div @click="showPicker">显示picker</div>
    </div>
    <div class="section">
      <div @click="showCascadePicker">显示CascadePicker</div>
    </div>
    <div class="section">
      <div>
        <tag text="我是内容一" />
        <tag text="我是文字内容" type="warn" style="margin-left: 10px;" />
      </div>
      <br>
      <tag text="我是文字内容" flat />
    </div>
    <div class="section">
      <md-button type="primary" size="large">我是PRIMARY large</md-button>
    </div>
    <div class="section">
      <md-button type="primary">我是PRIMARY</md-button>
    </div>
    <div class="section">
      <md-button>我是DEFAULT</md-button>
    </div>
    <div class="section">
      <md-button type="primary" round>我是PRIMARY round</md-button>
    </div>
    <div class="section">
      <div @click="showCompactLandscape=true;">简体内容弹窗(无header和footer)</div>
      <md-landscape ref="dialog"
        v-model="showCompactLandscape" compact mask-closable @close-icon-click="eventHandler" @mask-click="eventHandler"
>
        <div slot="content" style="position: relative; height: 100%;">
          <img width="100%" src="https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=b372bd3285d4b31cf03c93bdbfed4042/2cf5e0fe9925bc31a5ffa7e950df8db1cb137025.jpg" alt="">
          <div class="zm-dz">100000</div>
        </div>
      </md-landscape>
    </div>
    <div class="section">
      <div @click="showLandscape=true">弹窗</div>
      <md-landscape v-model="showLandscape" mask-closable
        @confirm="confirmDialog" @close-icon-click="eventHandler" @mask-click="eventHandler">
        <template slot="content">
          <div>版本3.5.8</div>
          <div>1、【优化】登录时刷脸通不过提供了短信验证码备用认证，在此对因刷脸识别老不通过的客户致以诚挚的歉意；</div>
          <div>2、【优化】更新版本时因苹果本身机制问题需要删除App后重新安装进行了优化，在此对因新版本不能登录卡住的客户致以诚挚的歉意；</div>
          <div>3、【优化】修正了一些已知的问题。</div>
        </template>
      </md-landscape>
    </div>
    <div class="section">
      <div @click="showFullScreenLandscape=true">全屏压屏</div>
      <md-landscape v-model="showFullScreenLandscape" full-screen title="我是标题">
        <div slot="content">
          <div style="line-height: 26px;">
            预授予额度是针对优质客户专门匹配的信用贷款额度，您可通过手机银行直接在线办理、签约、提款。
            <br>
            1、预授信额度在通知您之日起30天内有效，请及时办理审批及提款；
            <br>
            2、预授信额度以实际审批为准；
            <br>
            3、预授信额度期限最长1年。
          </div>
        </div>
      </md-landscape>
    </div>
    <div class="section">
      <marquee text="你有一条新短消息请注意查收你有一条新短消息请注意查收" />
    </div>
    <div class="section">
      <timeline
        :steps="steps"
        direction="vertical"
      />
    </div>
    <div class="section">
      <timeline
        :steps="stepsHorn"
        transition
      />
      <button
        style="margin-top: 10px;"
        @click="stepsHorn[2].SysNo = '0'; stepsHorn[4].SysNo = '1'"
      >
        go step 5
      </button>
    </div>
    <div class="section no-padding">
      <card-cell :list="cardList" />
    </div>
    <div class="section no-padding">
      <card-cell :list="cardList" layout="compact-display" :selected-index="4" />
    </div>
    <div class="section no-padding">
      <card-cell :list="cardList" layout="compact-action" action-title="基金赎回至" />
    </div>
    <div class="section no-padding">
      <card-cell :list="cardList" layout="simple" />
    </div>
    <div class="section no-padding">
      <card-cell :list="cardList" layout="mini" />
    </div>
    <div class="section no-padding">
      <card-cell :list="cardList" layout="mini" :is-switchable="false" :selected-index="4" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import timeline from '@mand-mobile/timeline';
import CardCell from './components/business/card-cell/card-cell';
import Marquee from './components/business/marquee';
import Landscape from '@mand-mobile/landscape';
import Button from '@mand-mobile/button';
import Tag from './components/business/tag';
import picker from './components/business/picker/picker';
import cashier from './components/business/cashier/index';
Vue.use(Landscape);
Vue.use(Button);
export default {
  name: 'App',
  components: {
    timeline,
    [CardCell.name]: CardCell,
    [Marquee.name]: Marquee,
    [Tag.name]: Tag
  },
  data() {
    return {
      list: '1234567'.split(''),
      picker: null,
      fullDatePicker: null,
      monthDatePicker: null,
      datePicker: null,
      cascadePicker: null,
      showLandscape: false,
      showFullScreenLandscape: false,
      showCompactLandscape: false,
      cashier: null,
      steps: [],
      stepsHorn: [
        {timeFlag: '01.07', timeFlagMsg: '购买日期'},
        {timeFlag: '02.07', timeFlagMsg: '确认中'},
        {timeFlag: '03.17', timeFlagMsg: '起息日', SysNo: '1'},
        {timeFlag: '06.12', timeFlagMsg: '下一起息日'},
        {timeFlag: '06.12', timeFlagMsg: '下一到期日'}
      ],
      cardList: [{
        'E_ACCOUNT_TYPE': '0004',
        'E_ACCT_NO': '50000000000000668655',
        'E_ACTP_FLAG': '2',
        'E_ACCOUNT_BALANCE': '0.00',
        'E_AVAILABLEAMOUNT': '132,123,123.3456',
        'E_CARD_NO': '62176027080005011',
        'E_ISSUE_BRANCH': '0002',
        'E_CARD_STATE': '01',
        'E_ID_VERFIED': 'N'
      }, {
        'E_ACCOUNT_TYPE': '0004',
        'E_ACCT_NO': '50000000000000663030',
        'E_ACTP_FLAG': '3',
        'E_ACCOUNT_BALANCE': '0.00',
        'E_AVAILABLEAMOUNT': '0.00',
        'E_CARD_NO': '62176022460000054',
        'E_ISSUE_BRANCH': '0101',
        'E_CARD_STATE': '01',
        'E_ID_VERFIED': 'N'
      }, {
        'E_ACCOUNT_TYPE': '0004',
        'E_ACCT_NO': '50000000000000668663',
        'E_ACTP_FLAG': '2',
        'E_ACCOUNT_BALANCE': '0.00',
        'E_AVAILABLEAMOUNT': '0.00',
        'E_CARD_NO': '62176027080005029',
        'E_ISSUE_BRANCH': '0002',
        'E_CARD_STATE': '01',
        'E_ID_VERFIED': 'N'
      }, {
        'E_ACCOUNT_TYPE': '0004',
        'E_ACCT_NO': '50000000000000667943',
        'E_ACTP_FLAG': '2',
        'E_ACCOUNT_BALANCE': '7962457.49',
        'E_AVAILABLEAMOUNT': '7952457.48',
        'E_CARD_NO': '62176056080010283',
        'E_ISSUE_BRANCH': '1401',
        'E_CARD_STATE': '01',
        'E_ID_VERFIED': 'N'
      }, {
        'E_ACCOUNT_TYPE': '0004',
        'E_ACCT_NO': '50000000000000650526',
        'E_ACTP_FLAG': '1',
        'E_ACCOUNT_BALANCE': '79355397.07',
        'E_AVAILABLEAMOUNT': '75593297.07',
        'E_CARD_NO': '62176022030539284',
        'E_ISSUE_BRANCH': '0101',
        'E_CARD_STATE': '01',
        'E_ID_VERFIED': 'Y'
      }, {
        'E_ACCOUNT_TYPE': '0004',
        'E_ACCT_NO': '50000000000000667357',
        'E_ACTP_FLAG': '2',
        'E_ACCOUNT_BALANCE': '30.00',
        'E_AVAILABLEAMOUNT': '30.00',
        'E_CARD_NO': '62176056080010085',
        'E_ISSUE_BRANCH': '1401',
        'E_CARD_STATE': '01',
        'E_ID_VERFIED': 'N'
      }].map(item => ({
        cardType: item.E_ACTP_FLAG,
        cardNo: item.E_CARD_NO,
        balance: item.E_ACCOUNT_BALANCE,
        availableBalance: item.E_AVAILABLEAMOUNT
      }))
    };
  },
  mounted() {
    const cardCell = new Vue(CardCell);
    cardCell.accountTitle = '我的账户';
    cardCell.list = this.cardList;
    cardCell.$on('selected', e => {
      typeof e.callback === 'function' && e.callback();
    });
    cardCell.$on('cancel', () => {
      //
    });
    cardCell.$mount('#card1');
  },
  methods: {
    eventHandler(e) {
      console.log(e);
    },
    handlePickerCancel(...args) {
      console.log(args);
    },
    handlePickerConfirm(...args) {
      console.log(args);
    },
    showFullDatePicker() {
      if (!this.fullDatePicker) {
        this.fullDatePicker = new picker.DtPicker({
          type: 'date',
          canBePermanent: true
        });
      }
      this.fullDatePicker.show(selected => {
        alert(JSON.stringify({text: selected.text, value: selected.value}));
        return true;
      });
    },
    showMonthDatePicker() {
      if (!this.monthDatePicker) {
        this.monthDatePicker = new picker.DtPicker({
          type: 'month',
          canBePermanent: true
        });
      }
      this.monthDatePicker.show(selected => {
        alert(JSON.stringify({text: selected.text, value: selected.value}));
        return true;
      });
    },
    showDatePicker() {
      if (!this.datePicker) {
        this.datePicker = new picker.DtPicker({
          type: 'date',
          canBePermanent: true
        });
      }
      this.datePicker.show(selected => {
        alert(JSON.stringify({text: selected.text, value: selected.value}));
        return true;
      });
    },
    showPicker() {
      if (!this.picker) {
        this.picker = new picker.PopPicker({
          layer: 2,
          isolated: true,
          title: '我是picker'
        });
        this.picker.setData([
          [
            {text: '包商银行', value: 1},
            {text: '招商银行西二旗支行', value: 2},
            {text: '中国工商银行包头东河区铁西支行', value: 3},
            {text: '建设银行', value: 4},
            {text: '中国农业银行', value: 5},
            {text: '交通银行', value: 6},
            {text: '包头市农行银行', value: 7},
            {text: '中国银行', value: 8}
          ],
          [
            {text: '包商银行', value: 1},
            {text: '招商银行西二旗支行', value: 2},
            {text: '中国工商银行包头东河区铁西支行', value: 3},
            {text: '建设银行', value: 4},
            {text: '中国农业银行', value: 5},
            {text: '交通银行', value: 6},
            {text: '包头市农行银行', value: 7},
            {text: '中国银行', value: 8}
          ]
        ]);
      }
      this.picker.show(selected => {
        alert(`选择的数据： ${JSON.stringify(selected)}`);
        return true;
      });
    },
    showCascadePicker() {
      if (!this.cascadePicker) {
        this.cascadePicker = new picker.PopPicker({
          layer: 3
        });
        this.cascadePicker.setData([
          {
            value: 1,
            text: '包商银行',
            children: [
              {
                value: 11,
                text: '北京',
                children: [
                  {value: 111, text: '小营路支行'},
                  {value: 112, text: '大屯路支行'}
                ]
              },
              {
                value: 12,
                text: '包头',
                children: [
                  {value: 121, text: '东河区西阁外支行'},
                  {value: 122, text: '青山区幸福路支行'},
                  {value: 123, text: '昆都仑区友谊大街支行'}
                ]
              },
              {
                value: 13,
                text: '呼和浩特',
                children: [
                  {value: 131, text: '赛罕区支行'},
                  {value: 132, text: '回民区支行'},
                  {value: 133, text: '新城区支行'}
                ]
              }
            ]
          },
          {
            value: 2,
            text: '中国工商银行-ICBC-95555',
            children: [
              {
                value: 21,
                text: '上海',
                children: [
                  {value: 211, text: '浦东支行'},
                  {value: 212, text: '浦西支行'}
                ]
              },
              {
                value: 22,
                text: '北京',
                children: [
                  {value: 221, text: '北京西二旗支行'},
                  {value: 222, text: '北京回龙观支行'},
                  {value: 223, text: '北京小营支行'}
                ]
              },
              {
                value: 23,
                text: '西安',
                children: [
                  {value: 231, text: '碑林区西大街支行'},
                  {value: 232, text: '雁塔区西安电子科技大学支行'},
                  {value: 233, text: '长安区郭杜镇支行'}
                ]
              }
            ]
          }
        ]);
      }
      this.cascadePicker.show(selected => {
        alert(`选择的数据： ${JSON.stringify(selected.map(item => ({text: item.text, value: item.value})))}`);
        return true;
      });
    },
    confirmDialog() {
      alert('点了确认升级');
    },
    showCashier() {
      this.cashier = cashier.init();
      this.cashier.show();
    }
  }
};
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }
  .section {
    background: #fff;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 15px;
    margin-bottom: 15px;
  }
  .section.no-padding {
    padding: 0;
  }
  .section:not(:last-child) {
    border-bottom: 1px solid #ececec;
  }
  body {
    background: #eaeaea;
  }
</style>
