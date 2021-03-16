<template>
  <div
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
  >
    <input
      :type="show ? 'text': 'password'"
      v-model="context.model"
      v-bind="context.attributes"
      @blur="context.blurHandler"
    />
    <font-awesome-icon :icon="show ? 'eye-slash' : 'eye'" @click="toggle" class="toggler"></font-awesome-icon>
  </div>
</template>

<script>
export default {
  props: {
    context: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      show: false
    };
  },

  methods: {
    toggle() {
      this.show = !this.show;
    }
  }
};
</script>

<style lang="scss" scoped>
.formulate-input-element {
  position: relative;
  display: flex;
  align-items: center;
}

.toggler {
  cursor: pointer;
  padding-left: 0.5rem;
  width: 1.5rem;
}
</style>
