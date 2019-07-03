import 'core-js/es6/set';
import mand from './mand-mobile/modules/index';

import CardCell from './business/card-cell/index';
import marquee from './business/marquee';
import picker from './business/picker/picker';
import tag from './business/tag';

import fastclick from 'fastclick';

if (document.body) {
  fastclick(document.body);
}
else if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    fastclick(document.body);
  }, false);
}

window.nextUI = Object.assign(
  {
    CardCell,
    marquee,
    picker,
    tag
  },
  mand
);

export default window.nextUI;
