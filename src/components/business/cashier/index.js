import panel from './panel';
import Vue from 'vue';

export default {
  init(options) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const cashier = new Vue(panel);
    cashier.$mount(container);

    return cashier;
  }
};
