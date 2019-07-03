<template>
  <div id="accountBox" :class="['card-cell', {'single-line': singleLineLayout, interactive: switchable}]"
    @click="showPicker">
    <div class="card-cell-logo">
      <template v-if="selectedCard.bankLogoSrc">
        <img id="imageLogo" :src="selectedCard.bankLogoSrc" alt="">
      </template>
      <template v-else>
        <md-icon name="bsb-logo" :size="singleLineLayout ? 'sm' : 'lg'" />
      </template>
    </div>
    <div class="card-cell-content">
      <!--layout 1-->
      <template v-if="layout === 'full'">
        <div class="content-row">
          <div class="content-cell">{{accountTitle}}</div>
          <div class="content-cell">
            <span id="bankName">{{selectedCard.cardTypeName || getCardTypeText(selectedCard.cardType)}}
            </span>&nbsp;尾号<span id="accountTail4">{{selectedCard.cardNo | cardSuffix4}}</span>
          </div>
        </div>
        <div class="content-row">
          <template v-if="isIncomeAmountView">
            <div class="content-cell">{{incomeAmountTitle}}</div>
            <div class="content-cell">
              <span class="card-cell-amount">{{incomeAmount}}</span><span>
                {{incomeAmountUnit || defaultAmoutUnit}}</span>
            </div>
          </template>
          <template v-else>
            <div class="content-cell">{{isAvailableBalanceView ? availableBalanceText : balanceText}}</div>
            <div class="content-cell">
              <span id="accountBalance" class="card-cell-amount">
                {{(isAvailableBalanceView
                    ? selectedCard.availableBalance
                    : selectedCard.balance
                  ) | formatNumber(2, '--')}}
              </span><span>{{selectedCard.unit || defaultAmoutUnit}}</span>
            </div>
          </template>
        </div>
      </template>

      <!--layout 2-->
      <template v-if="layout === 'compact-display'">
        <div class="content-row"><div class="content-cell">
          <span id="bankName">{{selectedCard.cardTypeName || getCardTypeText(selectedCard.cardType)}}</span>
        </div></div>
        <div class="content-row"><div class="content-cell">{{selectedCard.cardNo | cardNumberMask}}</div></div>
      </template>

      <!--layout 3-->
      <template v-if="layout === 'compact-action'">
        <div class="content-row"><div class="content-cell">{{actionTitle}}</div></div>
        <div class="content-row">
          <div class="content-cell">
            <span id="bankName">{{selectedCard.cardTypeName || getCardTypeText(selectedCard.cardType)}}
            </span> 尾号<span id="accountTail4">{{selectedCard.cardNo | cardSuffix4}}</span>
          </div>
        </div>
      </template>

      <!--layout 4-->
      <template v-if="layout === 'simple'">
        <div class="content-row spacing-between">
          <div class="content-cell">
            {{selectedCard.bankName || defaultBankName}}<span id="bankName">
              {{selectedCard.cardTypeName || getCardTypeText(selectedCard.cardType)}}
          </span>
          </div>
          <div class="content-cell">
            尾号<span id="accountTail4">{{selectedCard.cardNo | cardSuffix4}}</span>
          </div>
        </div>
      </template>

      <!--layout 5-->
      <template v-if="layout === 'simple-display'">
        <div class="content-row spacing-between">
          <div class="content-cell">
            <span id="bankName">{{selectedCard.cardTypeName || getCardTypeText(selectedCard.cardType)}}</span>
          </div>
          <div class="content-cell">
            {{selectedCard.cardNo | cardNumberMask}}
          </div>
        </div>
      </template>

      <!--layout 6-->
      <template v-if="layout === 'mini'">
        <div class="content-row">
          <div class="content-cell">
            <span id="bankName">{{selectedCard.cardTypeName || getCardTypeText(selectedCard.cardType)}}
            </span> 尾号<span id="accountTail4">{{selectedCard.cardNo | cardSuffix4}}</span>
          </div>
        </div>
      </template>
    </div>
    <div v-if="switchable" class="card-cell-arrow">
      <md-icon name="arrow-right" size="xs" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import MdIcon from '@mand-mobile/icon/index';
import Picker from '../picker/picker';
import Marquee from '../marquee';
import filters from '../../../filters';

Object.entries(filters).forEach(([key, filter]) => {
  Vue.filter(key, filter);
});

const defaultBankName = '包商银行';
const defaultAmoutUnit = '元';

export default {
  name: 'CardCell',
  components: {
    [MdIcon.name]: MdIcon,
    [Marquee.name]: Marquee
  },
  props: {

    resource: {
      type: Function,
      default: new Function()
    },

    // 是否可切卡
    switchable: {
      type: Boolean,
      default: true
    },

    // 切卡选中时只fire事件不选中
    pendingSelection: {
      type: Boolean,
      default: false
    },

    /**
     * 布局样式，可选full|compact-display|compact-action|simple|mini
     * full
     * ---------------------------
     * | 签约账户  储蓄卡 尾号8888 |
     * | 可用额度  123456789012元 |
     * ---------------------------
     *
     * compact-display
     * ---------------------------
     * | 储蓄卡                   |
     * | 8888 **** **** 8888     |
     * ---------------------------
     *
     * compact-action
     * ---------------------------
     * | 赎回至                   |
     * | 储蓄卡 尾号8888          |
     * ---------------------------
     *
     * simple
     * ---------------------------
     * | 包商银行储蓄卡   尾号8888 |
     * ---------------------------
     *
     * simple-display
     * -------------------------------
     * | 储蓄卡   8888 **** **** 8888 |
     * -------------------------------
     *
     * mini
     * ---------------------------
     * | 储蓄卡 尾号8888          |
     * ---------------------------
     */
    layout: {
      type: String,
      default: 'full'
    },

    // full模式下账户类型的名称
    accountTitle: {
      type: String,
      default: '交易账户'
    },

    // 余额显示为可用余额，默认账户余额
    isAvailableBalanceView: {
      type: Boolean,
      default: true
    },

    // 资金流入时使用，不显示卡相关金额，显示外部传入金额
    isIncomeAmountView: {
      type: Boolean,
      default: false
    },

    // 账户余额显示文案
    balanceText: {
      type: String,
      default: '账户余额'
    },

    // 可用余额显示文案
    availableBalanceText: {
      type: String,
      default: '可用余额'
    },

    // 资金流入时金额标题
    incomeAmountTitle: {
      type: String,
      default: '可提现金额'
    },

    // 资金流入时的金额
    incomeAmount: {
      type: String,
      default: '--'
    },

    // 资金流入时的金额单元
    incomeAmountUnit: {
      type: String,
      default: defaultAmoutUnit
    },

    // compact-action时的操作标题
    actionTitle: {
      type: String,
      default: '赎回至'
    },

    /**
     * 数据
     * @type string cardNo 卡号
     * @type string balance 账户余额
     * @type string availableBalance 可用余额
     * @type number cardType 1储蓄卡 2II类卡 3III类卡
     * @type string unit 金额单元默认元
     * @type string bankName 银行名称默认包商银行
     * @type string bankLogoSrc 银行logo src地址
     */
    list: {
      type: Array,
      default: Array
    },

    // 选中的索引
    selectedCardNo: {
      type: String,
      default: ''
    },

    // picker压屏背景原生头高度
    pickerOptions: {
      type: Object,
      default: Object
    }
  },
  data() {
    return {
      cardNo: this.selectedCardNo,
      picker: null
    };
  },
  computed: {
    defaultBankName() {
      return defaultBankName;
    },
    defaultAmoutUnit() {
      return defaultAmoutUnit;
    },
    singleLineLayout() {
      return ['simple', 'simple-display', 'mini'].includes(this.layout);
    },
    selectedCard() {
      if (!this.cardNo) {
        return this.list[0];
      }
      return this.list.find(card => (card.cardNo === this.cardNo));
    }
  },
  methods: {
    showPicker() {
      if (!this.switchable) {
        return;
      }
      if (!this.picker) {
        this.picker = new Picker.PopPicker();
        this.picker.setData(
          this.list.map(item => ({
            value: item.cardNo,
            text: filters.cardNumberMask(item.cardNo)
          }))
        );
        this.picker.setSelectedValues([this.cardNo]);
      }
      this.$emit('select');
      this.picker.show(selected => {
        const card = this.list.find(card => (card.cardNo === selected[0].value));
        if (!this.pendingSelection) {
          this.cardNo = selected[0].value;
        }
        const data = {
          payload: card
        };
        if (this.pendingSelection) {
          data.callback = () => {
            this.cardNo = selected[0].value;
          };
        }
        this.$emit('selected', data);
      }, {
        ...this.pickerOptions,
        hideCallback: () => {
          this.$emit('cancel');
        }
      });
    },
    setAvailableBalance(cardNo, amount) {
      const index = this.list.findIndex(card => (card.cardNo === cardNo));
      this.$set(this.list, index, {...this.list[index], availableBalance: amount});
    },
    getCardTypeText(cardType) {
      return filters.cardTypeText(cardType);
    }
  }
};
</script>

<style scoped lang="stylus">
  @require "../../theme.variables.styl"
  .card-cell
    color #333
    font-size 16px
    line-height 1
    background #fff
    padding 22px 17px
    display flex
    align-items center
    justify-content space-between
    &.interactive:active
      background #f4f4f4
    .card-cell-logo
      width 40px
      height 40px
      border-radius 50%
      border 1px solid #e8e8e8
      background #f9f9f9
      box-sizing border-box
    .card-cell-content
      flex 1
      margin-left 12px
      height 40px
    &.single-line
      padding 10px 17px
      .card-cell-logo
        width 28px
        height 28px
      .card-cell-content
        height 28px
        margin-left 7px
      .content-row
        height 28px
        align-items center
        &.spacing-between
          justify-content space-between

    .content-row
      display flex
      & + .content-row
        margin-top 8px
      .content-cell
        display flex
        .card-cell-amount
          color color-money
        & + .content-cell
          margin-left 15px

    .card-cell-arrow
      width 20px
      height 20px
      color #c8c8c8
</style>
