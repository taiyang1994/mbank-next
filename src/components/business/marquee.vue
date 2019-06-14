<template>
  <div ref="wrapper" class="marquee-wrapper">
    <div ref="content" class="marquee-content" :style="{position: 'relative', right: animateWidth + 'px'}">
      {{text}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Marquee',
  props: {
    text: {
      type: String,
      default: ''
    },
    loop: {
      type: Boolean,
      default: true
    },
    leading: {
      type: Number,
      default: 1000
    },
    trailing: {
      type: Number,
      default: 1000
    },
    fps: {
      type: Number,
      default: 60
    }
  },
  data() {
    return {
      timer: 0,
      animateWidth: 0,
      overflowWidth: 0,
      overflow: false
    };
  },
  computed: {
    /**
     * @return {number}
     */
    TIMEOUT() {
      return 1 / this.fps * 1000;
    }
  },
  updated() {
    this.measureText();
    if (!this.timer) {
      this.startAnimate();
    }
  },
  mounted() {
    this.measureText();
    this.startAnimate();
  },
  methods: {
    startAnimate() {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      const isLeading = this.animateWidth === 0;
      const timeout = isLeading ? this.leading : this.TIMEOUT;

      if (this.overflowWidth !== 0) {
        this.timer = window.setTimeout(this.animate, timeout);
      }
    },
    animate() {
      const overflowWidth = this.overflowWidth;
      let animateWidth = this.animateWidth + 1;
      const isRoundOver = animateWidth > overflowWidth;

      if (isRoundOver) {
        if (!this.loop) {
          return;
        }
        animateWidth = 0;
      }

      if (isRoundOver && this.trailing) {
        this.timer = window.setTimeout(() => {
          this.animateWidth = animateWidth;

          this.timer = window.setTimeout(this.animate, this.leading || this.TIMEOUT);
        }, this.trailing);
      }
      else {
        this.animateWidth = animateWidth;
        this.timer = window.setTimeout(this.animate, this.TIMEOUT);
      }
    },
    measureText() {
      const {wrapper, content} = this.$refs;
      if (!wrapper || !content) {
        return;
      }
      this.overflowWidth = content.clientWidth - wrapper.clientWidth;
    }
  }
};
</script>

<style scoped lang="stylus">
  .marquee-wrapper
    overflow hidden
  .marquee-content
    display inline-block
    white-space nowrap
</style>
