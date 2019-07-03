<template>
  <div class="safe-password">
    <div class="password-cell-container">
      <div v-for="i in 6" :key="i" class="password-cell">
        <div v-show="password[i - 1]" class="password-mask-dot"></div>
      </div>
    </div>
    <div class="password-forget">
      <a @click="$emit('forget')">忘记密码?</a>
    </div>
    <div class="safe-keyboard">
      <div class="safe-keyboard-banner">
        <div class="safe-keyboard-banner-inner">
          <div class="safe-keyboard-logo">
            <md-icon name="bsb-logo" size="lg" />
          </div><div class="safe-keyboard-banner-title">包商安全键盘</div>
        </div>
      </div>
      <div class="safe-keyboard-button-grid">
        <table>
          <tr v-for="i in 3" :key="'row' + i">
            <td v-for="j in 3" :key="'col' + j" @click="dial((i - 1) * 3 + j)">{{(i - 1) * 3 + j}}</td>
          </tr>
          <tr>
            <td> </td>
            <td @click="dial(0)">0</td>
            <td class="safe-keyboard-backspace" @click="backspace"><md-icon name="back-space" size="sm" /></td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import MdIcon from '@mand-mobile/icon/index';
export default {
  name: 'Keyboard',
  components: {
    [MdIcon.name]: MdIcon
  },
  data() {
    return {
      password: []
    };
  },
  methods: {
    dial(digit) {
      if (this.password.length === 6) {
        return;
      }
      this.password.push(digit + '');
      if (this.password.length === 6) {
        this.$emit('dial-done', this.password.join(''));
      }
    },
    backspace() {
      if (this.password.length === 0) {
        return;
      }
      this.password.pop();
    }
  }
};
</script>

<style lang="stylus">
  .safe-password
    *
      box-sizing border-box
  .password-cell-container
    margin 0 17px
    height 56px
    .password-cell
      position relative
      display inline-block
      border 1px solid #eaeaea
      width 16.66%
      height 56px
      &:not(:last-child)
        border-right 0
      &:first-child
        border-radius 4px 0 0 4px
      &:last-child
        border-radius 0 4px 4px 0
      .password-mask-dot
        width 10px
        height 10px
        border-radius 50%
        background #333
        position relative
        margin-left -5px
        margin-top -5px
        top 50%
        left 50%
  .password-forget
    margin 10px 17px 25px
    text-align right
    a
      &, &:hover, &:active, &:visited
        color #898989
        font-size 12px
        text-decoration none
  .safe-keyboard
    height 262px
    border-top 1px solid #eaeaea
    background #fff
  .safe-keyboard-banner
    height 42px
    color #551F0A
    padding-top: 1px
    .safe-keyboard-banner-inner
      height 28px
      width 146px
      margin 0 auto
      white-space nowrap
    .safe-keyboard-logo
      width 50px
      height 28px
      overflow hidden
      position relative
      float left
      .md-icon.icon-svg.lg
        width 50px
        height 50px
        position absolute
        left 0
        top -6px
    .safe-keyboard-banner-title
      float left
      height 28px
      font-size 16px
      line-height 16px
      padding-top 12px
  .safe-keyboard-button-grid
    table
      width 100%
      border-collapse collapse
      td
        width 33%
        border 1px solid #eaeaea
        font-size 28px
        line-height 40px
        padding 5px 0 6px
        color #333
        text-align center
        cursor pointer
        &:active
          background #eaeaea
        &:first-child
          border-left 0
        &:last-child
          border-right 0
        &.safe-keyboard-backspace
          .md-icon
            width 22px
            height 22px
            line-height 22px
            margin-top 9px
      tr:last-child
        td
          border-bottom 0
</style>
