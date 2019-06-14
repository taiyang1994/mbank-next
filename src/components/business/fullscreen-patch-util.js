export default {
  createNativeViewPatches(patchStyle = {}, nativeTitleHeight) {
    if (!this.isCurrentWebviewOnTop()) {
      return [];
    }
    const patches = [
      {
        name: 'offsetTopPatch',
        style: {
          top: '0px',
          left: '0px',
          width: '100%',
          height: this.getCurrentWebviewOffsetTop() + 'px'
        }
      },
      {
        name: 'titleSpacePatch',
        style: {
          top: this.getCurrentWebviewOffsetTop() + 'px',
          left: '0px',
          width: '100%',
          height: this.getCurrentWebviewTitleTop(true, nativeTitleHeight) + 'px'
        }
      },
      {
        name: 'offsetBottomPatch',
        style: {
          bottom: '0px',
          left: '0px',
          width: '100%',
          height: this.getCurrentWebviewOffsetBottom() + 'px'
        }
      }
    ];

    this.webviewSwipeSwitcher.start();
    window.addEventListener('swiperight', this.preventSwipeRightDefaultFunc, true);

    return patches.map(patch => new window.plus.nativeObj.View(patch.name, Object.assign(patch.style, patchStyle)));
  },

  destoryNativeViewPatches(patches) {
    this.webviewSwipeSwitcher.stop();
    window.removeEventListener('swiperight', this.preventSwipeRightDefaultFunc, true);
    patches.forEach(patch => {
      patch && patch.close();
    });
  },

  isCurrentWebviewOnTop() {
    try {
      const currentWebview = window.plus.webview.currentWebview();
      const topWebview = window.plus.webview.getTopWebview();
      return currentWebview.id === topWebview.id || currentWebview.parent().id === topWebview.id;
    }
    catch (err) {
      return false;
    }
  },

  webviewSwipeSwitcher: {
    popGesture: '',
    start() {
      const webview = window.plus.webview.currentWebview();
      this.popGesture = webview.getStyle().popGesture;
      webview.setStyle({
        popGesture: 'none'
      });
    },
    stop() {
      window.plus.webview.currentWebview().setStyle({
        popGesture: this.popGesture
      });
    }
  },

  /**
   * @function 获取当前webview中原生头、h5头、状态栏高度总和
   * title缺失=原生头高度+分割线高度+statusbar高度
   * 无原生头时，title缺失=状态栏高度+header元素高度
   */
  getCurrentWebviewTitleTop(isIncludingH5Header, nativeTitleHeight) {
    const nativeTitleStyle = window.plus.webview.currentWebview().getStyle().titleNView;

    let titleTotalHeight = 0;

    // hbuilder有个bug，子页面的statusbar不显示，所以子页面不加statusbar的高度
    const statusbarHeight = this.getStatusBarHeight();
    if (!window.plus.webview.currentWebview().parent()) {
      titleTotalHeight += statusbarHeight;
    }

    if (nativeTitleHeight > 0) {

      titleTotalHeight += nativeTitleHeight;

      // 坑，ios下变成了splitline，l小写，不知为啥。
      const splitLine = nativeTitleStyle.splitLine || nativeTitleStyle.splitline;
      if (splitLine && splitLine.height) {
        // 原生头的splitLine是向内的，算在titleView总高度内，所以不需要加splitLine的高度
        // titleTotalHeight += parseFloat(splitLine.height);
      }
    }

    // 没有原生头，h5的header+statusbar
    else if (isIncludingH5Header) {
      let headerElementHeight = 0;
      const headerElement = document.querySelector('header');
      if (headerElement) {
        headerElementHeight = parseFloat(getComputedStyle(headerElement).height || 0);
      }
      titleTotalHeight += headerElementHeight;
    }

    return titleTotalHeight;
  },

  /**
   * @function 获取当前webview距离屏幕顶部距离
   *
   */
  getCurrentWebviewOffsetTop() {
    const style = window.plus.webview.currentWebview().getStyle();
    return parseFloat(style.top || 0);
  },

  /**
   * @function 获取当前webview距离屏幕底部距离
   *
   */
  getCurrentWebviewOffsetBottom() {
    const style = window.plus.webview.currentWebview().getStyle();
    return parseFloat(style.bottom || 0);
  },

  preventSwipeRightDefaultFunc(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  },

  getNativeTitle() {
    if (window.plus) {
      return window.plus.webview.currentWebview().getTitleNView();
    }
    return null;
  },

  getStatusBarHeight() {
    const immersedRegExp = /Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi;
    const execResult = immersedRegExp.exec(window.navigator.userAgent);

    if (execResult && execResult.length === 3) {
      return parseFloat(execResult[2]);
    }
    return window.plus.navigator.getStatusbarHeight();
  },

  isNativeTitleDocking() {
    return window.plus.webview.currentWebview().getStyle().titleNView.type === 'transparent';
  }
};
