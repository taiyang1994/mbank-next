import fullScreenPatchUtil from './../fullscreen-patch-util';
var readyRE = /complete|loaded|interactive/;
var idSelectorRE = /^#([\w-]+)$/;
var classSelectorRE = /^\.([\w-]+)$/;
var tagSelectorRE = /^[\w-]+$/;
var translateRE = /translate(?:3d)?\((.+?)\)/;
var translateMatrixRE = /matrix(3d)?\((.+?)\)/;

var wrap = function (dom, selector) {
  dom = dom || [];
  Object.setPrototypeOf(dom, diesel.fn);
  dom.selector = selector || '';
  return dom;
};

var diesel = function (selector, context) {
  context = context || document;
  if (!selector) {
    return wrap();
  }
  if (typeof selector === 'object') {
    if (diesel.isArrayLike(selector)) {
      return wrap(diesel.slice.call(selector), null);
    }
    return wrap([selector], null);
  }
  if (typeof selector === 'function') {
    return diesel.ready(selector);
  }
  if (typeof selector === 'string') {
    try {
      selector = selector.trim();
      if (idSelectorRE.test(selector)) {
        var found = document.getElementById(RegExp.$1);
        return wrap(found ? [found] : []);
      }
      return wrap(diesel.qsa(selector, context), selector);
    }
    catch (e) {}
  }
  return wrap();
};

/**
 * diesel noop(function)
 */
diesel.noop = function () {};
/**
 * diesel slice(array)
 */
diesel.slice = [].slice;
/**
 * diesel filter(array)
 */
diesel.filter = [].filter;

diesel.type = function (obj) {
  return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || 'object';
};
/**
 * diesel isArray
 */
diesel.isArray = Array.isArray
  || function (object) {
    return object instanceof Array;
  };
/**
 * diesel isArrayLike
 * @param {Object} obj
 */
diesel.isArrayLike = function (obj) {
  var length = !!obj && 'length' in obj && obj.length;
  var type = diesel.type(obj);
  if (type === 'function' || diesel.isWindow(obj)) {
    return false;
  }
  return type === 'array' || length === 0
    || typeof length === 'number' && length > 0 && (length - 1) in obj;
};
/**
 * diesel isWindow(需考虑obj为undefined的情况)
 */
diesel.isWindow = function (obj) {
  return obj != null && obj === obj.window;
};
/**
 * diesel isObject
 */
diesel.isObject = function (obj) {
  return diesel.type(obj) === 'object';
};
/**
 * diesel isPlainObject
 */
diesel.isPlainObject = function (obj) {
  return diesel.isObject(obj) && !diesel.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
};
/**
 * diesel isEmptyObject
 * @param {Object} o
 */
diesel.isEmptyObject = function (o) {
  for (var p in o) {
    if (p !== undefined) {
      return false;
    }
  }
  return true;
};
/**
 * diesel isFunction
 */
diesel.isFunction = function (value) {
  return diesel.type(value) === 'function';
};
/**
 * diesel querySelectorAll
 * @param {type} selector
 * @param {type} context
 * @returns {Array}
 */
diesel.qsa = function (selector, context) {
  context = context || document;
  return diesel.slice.call(classSelectorRE.test(selector) ? context.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
};
/**
 * ready(DOMContentLoaded)
 * @param {type} callback
 * @returns {_L6.$}
 */
diesel.ready = function (callback) {
  if (readyRE.test(document.readyState)) {
    callback(diesel);
  }
  else {
    document.addEventListener('DOMContentLoaded', function () {
      callback(diesel);
    }, false);
  }
  return this;
};

/**
 * setTimeout封装
 * @param {Object} fn
 * @param {Object} when
 * @param {Object} context
 * @param {Object} data
 */
diesel.later = function (fn, when, context, data) {
  when = when || 0;
  var m = fn;
  var d = data;
  var f;
  var r;

  if (typeof fn === 'string') {
    m = context[fn];
  }

  f = function () {
    m.apply(context, diesel.isArray(d) ? d : [d]);
  };

  r = setTimeout(f, when);

  return {
    id: r,
    cancel: function () {
      clearTimeout(r);
    }
  };
};

function CustomEvent(event, params) {
  params = params || {
    bubbles: false,
    cancelable: false,
    detail: undefined
  };
  var evt = document.createEvent('Events');
  var bubbles = true;
  for (var name in params) {
    if (name === 'bubbles') {
      bubbles = !!params[name]
    }
    else {
      Object.defineProperty(evt, name, {
        writable: true
      });
      evt[name] = params[name]
    }
  }
  evt.initEvent(event, bubbles, true);
  return evt;
}
CustomEvent.prototype = window.Event.prototype;

/**
 * trigger event
 * @param {type} element
 * @param {type} eventType
 * @param {type} eventData
 * @returns {_L8.$}
 */
diesel.trigger = function(element, eventType, eventData) {
  element.dispatchEvent(new CustomEvent(eventType, {
    detail: eventData,
    bubbles: true,
    cancelable: true
  }));
  return this;
};

/**
 * each
 * @param {type} elements
 * @param {type} callback
 * @returns {_L8.$}
 */
diesel.each = function (elements, callback, hasOwnProperty) {
  if (!elements) {
    return this;
  }
  if (typeof elements.length === 'number') {
    [].every.call(elements, function (el, idx) {
      return callback.call(el, idx, el) !== false;
    });
  }
  else {
    for (var key in elements) {
      if (hasOwnProperty) {
        if (elements.hasOwnProperty(key)) {
          if (callback.call(elements[key], key, elements[key]) === false) {
            return elements;
          }
        }
      }
      else {
        if (callback.call(elements[key], key, elements[key]) === false) {
          return elements;
        }
      }
    }
  }
  return this;
};

var class2type = {};
diesel.each(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'], function (i, name) {
  class2type['[object ' + name + ']'] = name.toLowerCase();
});

/**
 * diesel.fn
 */
diesel.fn = {
  each: function (callback) {
    [].every.call(this, function (el, idx) {
      return callback.call(el, idx, el) !== false;
    });
    return this;
  }
};

if ('ontouchstart' in window) {
  diesel.isTouchable = true;
  diesel.EVENT_START = 'touchstart';
  diesel.EVENT_MOVE = 'touchmove';
  diesel.EVENT_END = 'touchend';
}
else {
  diesel.isTouchable = false;
  diesel.EVENT_START = 'mousedown';
  diesel.EVENT_MOVE = 'mousemove';
  diesel.EVENT_END = 'mouseup';
}
diesel.EVENT_CANCEL = 'touchcancel';
diesel.EVENT_CLICK = 'click';

var initializing = false;
var fnTest = /xyz/.test(function () {
  xyz;
}) ? /\b_super\b/ : /.*/;

var Class = function () {};
Class.extend = function f(prop) {
  var _super = this.prototype;
  initializing = true;
  var prototype = new this();
  initializing = false;
  for (var name in prop) {
    prototype[name] = typeof prop[name] === 'function'
    && typeof _super[name] === 'function' && fnTest.test(prop[name])
      ? (function (name, fn) {
        return function () {
          var tmp = this._super;

          this._super = _super[name];

          var ret = fn.apply(this, arguments);
          this._super = tmp;

          return ret;
        };
      })(name, prop[name])
      : prop[name];
  }
  function Class() {
    if (!initializing && this.init) {
      this.init.apply(this, arguments);
    }
  }
  Class.prototype = prototype;
  Class.prototype.constructor = Class;
  Class.extend = f;
  return Class;
};

diesel.Class = Class;

diesel.preventDefault = function (e) {
  e.preventDefault();
};

var CLASS_BACKDROP = 'diesel-backdrop';

diesel.createMask = function (callback) {
  var element = document.createElement('div');
  var mask = [element];
  element.classList.add(CLASS_BACKDROP);
  element.addEventListener(diesel.EVENT_MOVE, diesel.preventDefault);
  element.addEventListener('click', function () {
    mask.close();
  });
  mask._show = false;
  mask.show = function (config) {
    mask._show = true;
    const style = `opacity: 1; top: ${config.offsetTop || 0}px`;
    element.setAttribute('style', style);
    document.body.appendChild(element);
    return mask;
  };
  mask._remove = function () {
    if (mask._show) {
      mask._show = false;
      element.setAttribute('style', 'opacity:0');
      diesel.later(function () {
        var body = document.body;
        element.parentNode === body && body.removeChild(element);
      }, 350);
    }
    return mask;
  };
  mask.close = function () {
    if (callback) {
      if (callback() !== false) {
        mask._remove();
      }
    }
    else {
      mask._remove();
    }
  };
  return mask;
};

diesel.className = function (className) {
  return 'diesel-' + className;
};

diesel.isAndroidKeyboardShowing = function () {
  if (!window.plus || window.plus.os.name !== 'Android') {
    return false;
  }
  const webviewHeight = parseFloat(plus.android.invoke(plus.android.currentWebview(), 'getHeight'));
  const screenHeight = parseFloat(plus.screen.height);
  return webviewHeight + 100 <= screenHeight;
};

diesel.getStatusBarHeight = fullScreenPatchUtil.getStatusBarHeight;

diesel.isNativeTitleDocking = fullScreenPatchUtil.isNativeTitleDocking;

diesel.showNativeTitlePatch = function (ele, height) {
  if (!window.plus || height === 0) {
    return;
  }
  const patch = new window.plus.nativeObj.View('PickerPatch', {
    top: 0,
    left: 0,
    width: '100%',
    height: parseFloat(height) + 'px',
    backgroundColor: '#000000',
    opacity: 0.3
  });
  patch.show();
  fullScreenPatchUtil.webviewSwipeSwitcher.start();
  window.addEventListener('swiperight', fullScreenPatchUtil.preventSwipeRightDefaultFunc, false);
  ele.nativeTitlePatch = patch;
  window.addEventListener('beforeunload', () => {
    patch.close();
  }, false);
};

diesel.hideNativeTitlePatch = function (ele) {
  if (!window.plus || !ele.nativeTitlePatch) {
    return;
  }
  ele.nativeTitlePatch.close();
  ele.nativeTitlePatch = null;
  fullScreenPatchUtil.webviewSwipeSwitcher.stop();
  window.removeEventListener('swiperight', fullScreenPatchUtil.preventSwipeRightDefaultFunc, false);
};

diesel.preventAll = function (e) {
  typeof e.stopImmediatePropagation === 'function' && e.stopImmediatePropagation();
  e.stopPropagation();
  e.preventDefault();
  return false;
};

export default diesel;
