<template>
  <div class="slider">
    <transition-group name="fade" tag="div" class="slider">
      <div v-for="i in [currentIndex]" class="slider-slide" :key="i">
        <img :src="currentImg.src" :alt="currentImg.alt" />
      </div>
    </transition-group>

    <ul class="slider-bullets">
      <li
        v-for="(i, index) in images"
        :key="index"
        v-bind:class="{ 'slider-bullet--active': index === currentIndex }"
      ></li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      timer: null,
      currentIndex: 0
    };
  },

  mounted: function() {
    this.startSlide();
  },

  destroyed() {
    clearInterval(this.timer);
  },

  methods: {
    startSlide: function() {
      this.timer = setInterval(this.next, 5000);
    },

    next: function() {
      if (this.currentIndex === this.images.length - 1) {
        this.currentIndex = 0;
      } else {
        this.currentIndex += 1;
      }
    }
  },

  computed: {
    currentImg: function() {
      return this.images[this.currentIndex];
    }
  }
};
</script>