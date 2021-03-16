<template>
  <article
    class="challenge"
    v-bind:class="{
      'challenge--expire': est_expire,
      'challenge--complet': est_complet,
    }"
  >
    <header class="challenge-header">
      <router-link
        tag="figure"
        class="challenge-thumbnail"
        :to="`/defi/${slug}#titre`"
      >
        <img :src="images.miniature" alt="Photo du défi" />
        <p v-if="starts_in !== null" class="challenge-timer">
          Départ dans {{ starts_in }}
        </p>
      </router-link>
      <router-link
        tag="h1"
        class="challenge-title"
        :to="`/defi/${slug}#titre`"
        >{{ nom }}</router-link
      >
    </header>
    <p class="challenge-description">{{ description }}</p>
    <p class="challenge-cta">
      <router-link tag="button" class="button" :to="`/defi/${slug}#titre`"
        >En savoir plus</router-link
      >
    </p>
  </article>
</template>

<script>
export default {
  props: {
    challenge: {
      type: Object,
      required: true,
    },
  },

  data() {
    return Object.assign({}, this.challenge, {
      now: Date.now(),
      interval: null,
    });
  },

  mounted() {
    this.interval = setInterval(() => {
      this.now = Date.now();
    }, 1000);
  },

  destroyed() {
    clearInterval(this.interval);
  },

  computed: {
    starts_in() {
      if (this.challenge.date_debut === null) {
        return null;
      }

      const diff = Math.round((this.challenge.date_debut - this.now) / 1000);
      if (diff <= 0) {
        return null;
      }

      //
      const jours = Math.floor(diff / (3600 * 24));
      const heures = Math.floor((diff % (3600 * 24)) / 3600);
      const minutes = Math.floor(((diff % (3600 * 24)) % 3600) / 60);
      const secondes = ((diff % (3600 * 24)) % 3600) % 60;

      return `${jours} jour${jours > 1 ? "s" : ""}, ${heures} heure${
        heures > 1 ? "s" : ""
      }, ${minutes} minute${minutes > 1 ? "s" : ""} et ${secondes} seconde${
        secondes > 1 ? "s" : ""
      }`;
    },
  },
};
</script>