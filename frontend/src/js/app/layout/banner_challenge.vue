<template>
  <section
    class="banner"
    v-bind:class="{ [`banner--${challenge.theme}`]: true }"
    :id="challenge.slug"
    ref="banner"
  >
    <h1 class="banner-title">
      <span>{{ challenge.nom }}</span>
    </h1>
    <p class="banner-cta">
      <ChallengeCta
        :challenge="challenge"
        :destination="`${this.$route.path}#offre`"
        label="Je veux le faire !"
      ></ChallengeCta>
    </p>
  </section>
</template>

<script>
import ChallengeCta from "#app/components/challengeCta.vue";

export default {
  components: {
    ChallengeCta
  },

  props: {
    challenge: {
      type: Object,
      required: true
    }
  },

  mounted() {
    this.$refs.banner.style.backgroundImage = `url(${this.challenge.images.banner})`;
  }
};
</script>