<template />

<script>
import Button from '@mand-mobile/button/index';
export default {
  name: 'Base',
  components: {
    [Button.name]: Button
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: Object
    }
  },
  mounted() {
    this.track(this.enterEventIdPrefix);
  },
  methods: {
    track(prefix) {
      let type = this.options.transaction.type;
      if (['313', '315'].includes(type)) {
        type = '312';
      }
      if (typeof this.options.context.mbank === 'object' && typeof this.options.context.mbank.onEvent === 'function') {
        this.options.context.mbank.onEvent(`${prefix}-${type}`);
      }
    },
    close() {
      this.$emit('close');
    },
    accomplish() {
      this.$emit('accomplish');
    }
  }
};
</script>
