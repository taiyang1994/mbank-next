import panel from './panel';
import Vue from 'vue';

export default {
  init(options) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const Cashier = Vue.extend(panel);
    const cashier = new Cashier({
      propsData: {
        options
      }
    });
    cashier.$mount(container);

    return cashier;
  }
};
