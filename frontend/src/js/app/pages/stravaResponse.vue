<template>
  <div>
    <Header></Header>
    <section class="section section--strava wrapper">
      <h1 class="section-title section-title--stylish" id="titre">
        <span>Synchronisation à Strava</span>
      </h1>
      <p v-if="pending">
        <img src="/img/spinner.gif" alt="Chargement en cours..." />
      </p>
      <p v-else-if="error !== null">
        {{ error }}
        <br />
        <router-link to="/espace-membre" class="link">Retour à l'espace membre</router-link>
      </p>
      <p v-else>
        Bravo ! Toutes vos futures activités Strava seront désormais comptées pour vos défis en cours.
        <br />
        <router-link to="/espace-membre" class="link">Retour à l'espace membre</router-link>
      </p>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "#app/layout/footer.vue";
import Header from "#app/layout/header.vue";

export default {
  components: {
    Header,
    Footer
  },

  data() {
    return {
      error: null,
      pending: true
    };
  },

  async mounted() {
    const { error, code, scope } = this.$route.query;
    if (error === "access_denied") {
      this.setError(
        "Vous avez refusé de lier votre compte Definisher et votre compte Strava"
      );
      return;
    }

    const allowed = scope.split(",");
    const required = ["read", "activity:read_all"];

    if (!required.every(name => allowed.indexOf(name) !== -1)) {
      this.setError(
        "Vous devez accepter de partager vos activités privées pour lier vos comptes Definisher et Strava"
      );
      return;
    }

    try {
      await this.$store.dispatch("settings/utilisateur/setStravaAccess", {
        code
      });
      this.pending = false;
    } catch (error) {
      if (!error.response) {
        this.setError("Une erreur inconnue est survenue");
        return;
      }

      this.setError(error.response.data.user_message);
    }
  },

  methods: {
    setError(error) {
      this.error = error;
      this.pending = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.section--strava {
  text-align: center;
}
</style>