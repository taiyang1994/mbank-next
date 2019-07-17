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
    sourceType: 'unset',
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
    if (!options.list || !options.list.length) {
      if (!options.sourceType && !sourceTypes.includes(options.sourceType)) {
        throw new Error(`When list is empty, parameter {sourceType} must be in [${sourceTypes.join(', ')}]`);
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
          switchable: this.options.switchable && !this.options.specific,
          layout: this.options.layout,
          accountTitle: this.options.accountTitle,
          balanceText: this.options.balanceText,
          list: this.list,
          selectedCardNo: this.options.cardNo,
          isAccountBalanceView: this.options.isAccountBalanceView,
          pendingSelection: this.options.pendingSelection,
          pickerOptions: this.options.pickerOptions
        }
      });
      if (this.options.$el && document.querySelector(this.options.$el)) {
        cell.$mount(this.options.$el);
      }

      cell.$on('charge', this.charge.bind(this));

      let currentCard = this.list[0];
      if (this.options.cardNo) {
        currentCard = this.list.find(item => (item.cardNo === this.options.cardNo));
      }
      callback(cell, currentCard);
    });
  }
  getList() {
    if (this.options.list && this.options.list.length) {
      this.list = this.options.list;
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
        fetch = Promise.all(
          [this.fetchEleAccount(), this.fetchNormalAccount()]
        ).then(([eleAccounts, normalAccounts]) => {
          return [...eleAccounts, ...normalAccounts];
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
          currentBusinessCode: sessionId ? '20000269' : '20000279',
          phone: getInfo('accountPhone'),
          flag: sessionId ? 'on' : 'off',
          transFlag: ''
        },
        data => {
          const list = data.UPCodeCardList;
          list.forEach(item => {
            item.availableBalance = item.acct_balance;
            item.oriCardType = item.cardType;
            switch (item.oriCardType) {
              case '0':
                // 电子账户
                item.cardType = '0';
                break;
              default:
              case '1':
                // 本行123类户
                item.cardType = item.cardLevel;
                break;
              case 'A':
                // 本行信用卡
                item.cardType = 'A';
                break;
            }
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
          resolve(data.ET_MASTER_LIST.map(item => {
            item.cardNo = item.accountNo;
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
  fillCardInfo(card) {
    const result = {...card};
    const cardPropertyMap = [
      {
        key: 'accountNo',
        alias: ['oriAccountNo', 'E_ACCT_NO']
      },
      {
        key: 'cardNo',
        alias: ['E_CARD_NO']
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

    result.oriCardType = result.cardType;
    if (result.cardType === 'S') {
      result.cardType = '2';
    }
    if (result.cardType === 'T') {
      result.cardType = '3';
    }

    const cardType = Enum.CARD_TYPE.find(config => (config.value + '' === result.cardType + ''));
    result.cardTypeName = cardType ? cardType.text : (result.cardTypeName || '');
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
  charge(card) {
    const mbank = this.options.mbank;
    mbank.apiSend(
      'post',
      'newEleMessageQuery.do',
      {
        accountNo: card.cardNo,
        currentBusinessCode: '00002023'
      },
      data => {
        const bondCard = data.bingAccountList[0];
        let cardType = card.oriCardType;
        if (cardType === '2') {
          cardType = 'S';
        }
        if (cardType === '3') {
          cardType = 'T';
        }
        const params = {
          accountNo: card.cardNo,
          cardType: cardType,
          cardNo: bondCard.LK_CARD_NO,
          telephoneNumber: bondCard.LK_MOBILE,
          bankName: bondCard.LK_BANK_NAME
        };
        this.options.mbank.openWindowByLoad(
          '_www/views/account/eleRechagerNew.html', 'eleRechagerNew', 'pop-in', params
        );
      },
      null,
      true
    );
  }
}
