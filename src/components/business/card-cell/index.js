import Vue from 'vue';
import Enum from './../../../enum';
import CardCell from './card-cell';

const sourceTypes = ['electric', 'normal', 'qrcode', 'saving', 'ebank'];
const scopes = ['I', 'I,VerifiedII', 'I,II', 'I,II,III'];

export default class {
  list = [];
  options = {
    mbank: {},
    userInfo: {},

    list: [],
    cardNo: '',
    specific: false,
    sourceType: 'normal',
    scope: 'I,II',
    loadingWhileFetching: true,

    switchable: true,
    layout: 'full',
    accountTitle: '交易账户',
    balanceText: '可用余额',
    isAccountBalanceView: false,
    pendingSelection: false,
    pickerOptions: {}
  };
  constructor(options) {
    if (!options.list || !options.length) {
      if (options.sourceType && !sourceTypes.includes(options.sourceType)) {
        throw new Error(`Parameter {sourceType} must be in [${sourceTypes.join(', ')}]`);
      }
      if (options.scope && !scopes.includes(options.scope)) {
        throw new Error(`Parameter {scope} must be in [${scopes.join(', ')}]`);
      }
    }
    this.options = {...this.options, ...options};
  }
  init(callback) {
    this.getList().then(() => {
      const Cell = Vue.extend(CardCell);
      const cell = new Cell({
        propsData: {
          switchable: this.options.switchable,
          layout: this.options.layout,
          accountTitle: this.options.accountTitle,
          balanceText: this.options.balanceText,
          list: this.list,
          selectedCardNo: this.options.cardNo,
          isAvailableBalanceView: !this.options.isAccountBalanceView,
          pendingSelection: this.options.pendingSelection,
          pickerOptions: this.options.pickerOptions
        }
      });
      if (this.options.$el && document.querySelector(this.options.$el)) {
        cell.$mount(this.options.$el);
      }

      let currentCard = this.list[0];
      if (this.options.cardNo) {
        currentCard = this.list.find(item => (item.cardNo === this.options.cardNo));
      }
      callback(cell, currentCard);
    });
  }
  getList() {
    if (this.options.list && this.options.list.length) {
      this.list = this.options.list.map(item => this.fillCardInfo(item));
      return Promise.resolve();
    }
    let fetch = null;
    switch (this.options.sourceType) {
      case 'electric':
        fetch = this.fetchEleAccount();
        break;
      case 'normal':
        fetch = this.fetchNormalAccount();
        break;
      case 'qrcode':
        fetch = this.fetchQRAccount();
        break;
      case 'saving':
        fetch = Promise.all(this.fetchEleAccount(), this.fetchPhysicalAccount());
        fetch.then(results => {
          return [...results[0], ...results[1]];
        });
        break;
      case 'ebank':
        fetch = this.fetchEbankAccount();
        break;
    }

    return fetch.then(list => {
      if (this.options.cardNo && this.options.specific) {
        const specificCard = list.find(item => (item.cardNo === this.options.cardNo));
        if (!specificCard) {
          throw new Error('Cannot find specific cardNo in card list');
        }
        this.list = [specificCard];
      }
      else {
        this.list = list;
      }
    });
  }
  fetchEleAccount = () => {
    return new Promise((resolve, reject) => {
      this.options.mbank.apiSend('post', 'eleAccountQuery.do', {currentBusinessCode: '00001001'},
        data => {
          resolve(data.eleAccountQueryList.map(item => {
            item.cardType = '0';
            item.availableBalance = item.balance;
            return this.fillCardInfo(item);
          }));
        },
        error => {
          reject(error);
        },
        this.options.loadingWhileFetching
      );
    });
  };
  fetchNormalAccount = () => {
    return new Promise((resolve, reject) => {
      this.options.mbank.apiSend('post', 'queryallCardNumber.do', {currentBusinessCode: '20000226'},
        data => {
          const list = this.filterByScope(data.getAllCardList.map(item => (this.fillCardInfo(item))));
          resolve(list);
        },
        error => {
          reject(error);
        },
        this.options.loadingWhileFetching
      );
    });
  };
  fetchQRAccount = () => {
    return new Promise((resolve, reject) => {
      const getInfo = this.options.userInfo.getItem;
      const sessionId = getInfo('sessionId');
      this.options.mbank.apiSend('post', sessionId ? 'QRCodeCardSeqQuery.do' : 'QRCodeCardSeqQueryNoSession.do',
        {
          currentBusinessCode: '20000269',
          phone: getInfo('accountPhone'),
          flag: sessionId ? 'on' : 'off',
          transFlag: ''
        },
        data => {
          const list = data.UPCodeCardList;
          list.forEach(item => {
            // TODO: 完善二维码切卡
          });
          resolve(list);
        },
        error => {
          reject(error);
        },
        this.options.loadingWhileFetching
      );
    });
  };
  fetchEbankAccount = () => {
    return new Promise((resolve, reject) => {
      this.options.mbank.apiSend('post', 'queryAccountInEbankNEW.do', {currentBusinessCode: '20000224'},
        data => {
          resolve(data.ET_MASTER_LIST.map(item => (this.fillCardInfo(item))));
        },
        error => {
          reject(error);
        },
        this.options.loadingWhileFetching
      );
    });
  };
  fillCardInfo(card) {
    const result = {...card};
    const cardPropertyMap = [
      {
        key: 'cardNo',
        alias: ['accountNo', 'E_CARD_NO']
      },
      {
        key: 'cardType',
        alias: ['accountType', 'RESERVE_2', 'E_ACTP_FLAG']
      },
      {
        key: 'cardTypeName',
        alias: ['CHRD_PRODUCT']
      },
      {
        key: 'balance',
        alias: ['E_ACCOUNT_BALANCE']
      },
      {
        key: 'availableBalance',
        alias: ['E_AVAILABLEAMOUNT']
      },
      {
        key: 'accountMark',
        alias: ['E_ISSUE_BRANCH']
      },
      {
        key: 'isVerified',
        alias: ['E_ID_VERFIED', 'ID_VERFIED']
      }
    ];

    cardPropertyMap.forEach(map => {
      map.alias.forEach(alias => {
        if (card.hasOwnProperty(alias)) {
          result[map.key] = card[alias];
        }
      });
    });

    const cardType = Enum.CARD_TYPE.find(config => (config.value + '' === result.cardType + ''));
    result.cardTypeName = cardType ? cardType.text : (result.cardTypeName || '未知类型卡');
    return result;
  }
  filterByScope(list) {
    return list.filter(item => {
      const cardType = item.cardType + '';
      switch (this.options.scope) {
        case 'I':
          return cardType === '1';
        case 'I,VerifiedII':
          return cardType === '1' || (cardType === '2' && item.isVerified === 'Y');
        case 'I,II':
          return cardType === '1' || cardType === '2';
        case 'I,II,III':
          return cardType === '1' || cardType === '2' || cardType === '3';
      }
    });
  }
};
