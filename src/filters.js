import Enum from './enum';
export default {
  stringUtil: {
    trim(s) {
      if (!s) {
        return '';
      }
      return s.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    },
    pascalize(s) {
      if (!s) {
        return '';
      }

      s = s + '';
      if (/^[A-Z\s-\/_]+$/.test(s)) {
        s = s.toLowerCase();
      }
      s = s.replace(/[\s-\/_]+(.)/g, function (w, c) {
        return c.toUpperCase();
      });
      s = s.charAt(0).toUpperCase() + s.slice(1);
      return s;
    },
    camelize(s) {
      if (!s) {
        return '';
      }

      s = this.pascalize(s);
      return s.charAt(0).toLowerCase() + s.slice(1);
    },
    dasherize(s) {
      if (!s) {
        return '';
      }

      s = this.pascalize(s);

      s = s.replace(/[A-Z]{2,}$/g, function (match) {
        return match.charAt(0) + match.slice(1).toLowerCase();
      });
      s = s.replace(/[A-Z]{2,}/g, function (match) {
        return match.charAt(0) + match.slice(1, -1).toLowerCase() + match.charAt(match.length - 1);
      });

      s = s.replace(/[A-Z]/g, function (match) {
        return '-' + match.toLowerCase();
      });
      if (s.charAt(0) === '-') {
        s = s.substring(1);
      }
      return s;
    },
    constlize(s) {
      if (!s) {
        return '';
      }

      s = this.dasherize(s).replace(/-/g, '_');
      return s.toUpperCase();
    },
    pluralize(s) {
      if (!s) {
        return '';
      }

      return s.replace(/y$/, 'ie') + 's';
    },
    pad(s, padding, length) {
      s = (!s ? '' : s) + '';
      const padLength = length - s.length;
      if (padLength > 0) {
        const left = new Array(padLength + 1).join(padding);
        return left + s;
      }

      return s;
    },
    padRight(s, padding, length) {
      s = (!s ? '' : s) + '';
      const padLength = length - s.length;
      if (padLength > 0) {
        var right = new Array(padLength + 1).join(padding);
        return s + right;
      }

      return s;
    }
  },
  formatNumber(number, decimals = 2, emptyValue = '', prefix = '') {
    if (typeof number === 'undefined') {
      return prefix + emptyValue;
    }
    if (isNaN(number)) {
      return number;
    }

    number = parseFloat(number).toFixed(decimals);

    const parts = number.split('.');
    let integer = parts[0];
    const decimal = parts[1];

    integer = integer.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');

    let result = prefix + integer;
    if (decimal) {
      result += '.' + decimal;
    }
    return result;
  },
  cardTypeText(value) {
    const CARD_TYPE = Enum.CARD_TYPE;
    const type = CARD_TYPE.find(item => (item.value + '' === value + ''));
    if (type) {
      return type.text;
    }
    return '未知';
  },
  cardSuffix4(cardNo) {
    return cardNo ? cardNo.substring(cardNo.length - 4) : '';
  },
  cardNumberSplit(cardNo) {
    if (/\s/.test(cardNo)) {
      return cardNo;
    }
    return cardNo.replace(/(\d{4})/g, '$1 ');
  },
  cardNumberMask(cardNo) {
    if (!cardNo || cardNo.length <= 8) {
      return cardNo;
    }

    const mask = ' **** **** ';
    return cardNo.replace(/^\d{4}(\d+)\d{4}$/g, (match, segment, offset, string) => {
      return string.replace(segment, mask);
    });
  },
  phoneNumberMask(number) {
    if (!number || number.length <= 7) {
      return number;
    }
    number = number.replace(/^\+86/g, '');

    const mask = '****';
    return number.replace(/^\d{3}(\d+)\d{4}$/g, (match, segment, offset, string) => {
      return string.replace(segment, mask);
    });
  }
};
