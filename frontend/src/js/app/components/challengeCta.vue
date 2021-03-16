<template>
  <button v-if="alreadyBought" class="button">Déjà acheté !</button>
  <button v-else-if="challenge.est_complet" class="button">Défi complet !</button>
  <button v-else-if="challenge.est_expire" class="button">Défi terminé !</button>
  <router-link v-else-if="destination" tag="button" :to="destination" class="button">{{ label }}</router-link>
  <button v-else class="button" @click="onClick">{{ label }}</button>
</template>

<script>
export default {
  props: {
    challenge: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    destination: {
      type: String,
      required: false
    }
  },

  computed: {
    alreadyBought() {
      const { utilisateur } = this.$store.state.settings.utilisateur;
      if (utilisateur === null) {
        return false;
      }

      return utilisateur.commandes.some(({ lignes_achat }) => {
        return lignes_achat.some(
          ({ challenge: challengeId }) => challengeId === this.challenge.id
        );
      });
    }
  },

  methods: {
    onClick() {
      this.$emit("click");
    }
  }
};
</script>