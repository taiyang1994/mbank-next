<template />

<script>
import Button from '@mand-mobile/button';
export default {
  name: 'Base',
  components: {
    [Button.name]: Button
  },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    accomplish() {
      this.$emit('accomplish');
    }
  }
};
</script>
