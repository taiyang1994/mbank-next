<template>
  <div class="tag tag-wrapper">
    <div v-if="flat" class="tag-flat">
      <div :class="{'is-android': isAndroid}">{{text}}</div>
    </div>
    <div v-else :class="['tag-bordered', `tag-${type}`]" :style="{width: getTextWidth(text, 10, 10)}">
      <div>{{text}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tag',
  props: {
    // 扁平，无边框
    flat: {
      type: Boolean,
      default: false
    },

    // 类型，info-蓝，warn-红
    type: {
      type: String,
      default: 'info'
    },

    // 文本
    text: {
      type: String,
      default: ''
    }
  },
  computed: {
    isAndroid() {
      return /Android/.test(navigator.userAgent) || window.plus && window.plus.os.name === 'Android';
    }
  },
  methods: {
    getTextWidth(text, textWidth, padding) {
      return text.length * textWidth + padding * 2 + 'px';
    }
  }
};
</script>

<style scoped lang="stylus">
  .tag.tag-wrapper
    display inline-block
    .tag-flat
      border 0
      height 21px
      line-height 21px
      font-size 13px
      background rgba(239, 125, 0, 0.1)
      color #EF7D00
      display inline-block
      padding 0 8px
      max-width 100%
      white-space nowrap
      & > div
        display inline-block
        line-height 21px
        max-width 100%
        overflow hidden
        text-overflow ellipsis
        &.is-android
          border-color rgba(0, 0, 0, 0)
          border-style solid
          border-width 1px 0
    .tag-bordered
      position relative
      white-space nowrap
      height 17px
      line-height 17px
      box-sizing border-box
      &:before
        content ""
        position absolute
        box-sizing border-box
        width 200%
        height 200%
        transform scale(0.5)
        transform-origin 0 0
      & > div
        font-size 20px
        transform scale(0.5)
        transform-origin 0 0
        position absolute
        margin 0 10px
        height 34px
        line-height 34px
      &.tag-info
        color #4A90E2
        &:before
          border 1px solid #4A90E2
      &.tag-warn
        color #F43F3F
        &:before
          border 1px solid #F43F3F
</style>
