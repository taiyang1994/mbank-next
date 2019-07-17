export default {
  CARD_TYPE: [
    {value: '0', alias: 'EleCard', text: '包投钱包'},
    {value: '1', alias: 'IClassCard', text: '储蓄卡'},
    {value: '2', alias: 'IIClassCard', text: 'II类户'},
    {value: '3', alias: 'IIIClassCard', text: 'III类户'},
    {value: 'A', alias: 'CreditCard', text: '信用卡'},
    {value: 'X', alias: 'QRCard', text: '二维码下挂卡'}
  ],
  CARD_PASSWORD_TYPE: [
    {value: '0', alias: 'Trade', text: '交易'},
    {value: '1', alias: 'IClassCard', text: '卡片取款'},
    {value: '2', alias: 'IIClassCard', text: '交易'},
    {value: '3', alias: 'IIIClassCard', text: '交易'},
    {value: 'X', alias: 'QRCard', text: '账户支付'}
  ],
  CREDIT_CARD_PASSWORD_TYPE: [
    {value: '1', alias: 'Query', text: '信用卡查询'},
    {value: '2', alias: 'Trade', text: '信用卡交易'}
  ]
};
