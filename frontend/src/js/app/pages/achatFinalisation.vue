<template>
  <div>
    <Header></Header>
    <section class="section section--achatFinalisation wrapper">
      <h1 class="section-title section-title--stylish" id="titre">
        <span>Statut du paiement</span>
      </h1>
      <p v-if="pending">
        <img src="/img/spinner.gif" alt="Chargement en cours..." />
      </p>
      <div v-else-if="error !== null">
        <h2>Le paiement a échoué</h2>
        <p class="badge badge--error">
          <font-awesome-icon icon="times-circle"></font-awesome-icon>
        </p>
        <p>
          Votre commande n'a pas été validée au motif suivant :
          <br />
          <em>{{ error }}</em>
        </p>
        <p>
          <router-link to="/espace-membre" class="link">Retour à l'espace membre</router-link>
        </p>
      </div>
      <div v-else>
        <h2>Le paiement a réussi !</h2>
        <p class="badge badge--success">
          <font-awesome-icon icon="check-circle"></font-awesome-icon>
        </p>
        <p>Félicitations, votre commande est désormais validée !</p>
        <p>Et maintenant ?</p>
        <p>
          Nous vous invitons à rejoindre
          <router-link to="/espace-membre" class="link">votre espace membre</router-link>&nbsp;et lier votre compte Definisher à votre compte Strava pour commencer à compléter le défi.
        </p>
        <p>Il n'y a plus qu'à courir !</p>
      </div>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "#app/layout/footer.vue";
import Header from "#app/layout/header.vue";
import axios from "axios";
import routes from "#app/api";

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
    const { session_id } = this.$route.query;

    try {
      const { data: commande } = await axios.get(
        routes.utilisateur.getCommande(
          this.$store.state.settings.utilisateur.utilisateur.id,
          session_id
        )
      );

      if (!commande || commande.payee !== true) {
        this.setError("Le paiement de votre commande a échoué");
        return;
      }

      this.pending = false;
    } catch (error) {
      if (!error.response || !error.response.data.user_message) {
        this.setError("Une erreur inconnue est survenue");
      } else {
        this.setError(error.response.data.user_message);
      }

      return;
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
.section--achatFinalisation {
  text-align: center;

  p {
    max-width: 40rem;
    margin: 1rem auto;
  }
}
</style>