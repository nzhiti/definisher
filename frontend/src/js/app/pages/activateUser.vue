<template>
  <div>
    <Header></Header>
    <section class="section wrapper" id="content">
      <h1 class="section-title section-title--stylish" id="titre">
        <span>Finalisation de votre inscription</span>
      </h1>
      <span v-if="status === 'pending'">
        <img src="/img/spinner.gif" alt="Chargement en cours..." />
      </span>
      <p v-else-if="status === 'error'">
        <span class="activateUser-error">
          <font-awesome-icon icon="exclamation-triangle"></font-awesome-icon>
          <strong>Échec</strong>
        </span>
        <br />
        <br />
        <span>{{ error }}.</span>
      </p>
      <p v-else-if="status === 'success'">
        <span>Félicitations, votre compte est désormais activé !</span>
        <br />
        <br />
        <span>
          Vous pouvez dès à présent vous connecter à l'
          <router-link to="/authentification#connexion" class="link">espace membre</router-link>&nbsp;et rejoindre l'un de nos nombreux défis.
        </span>
        <br />
        <br />
        <router-link
          tag="button"
          to="/authentification#connexion"
          class="button"
        >Rejoindre l'espace membre</router-link>
      </p>
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
    Footer,
    Header
  },

  data() {
    return {
      status: "pending",
      error: null
    };
  },

  async mounted() {
    try {
      await axios.post(routes.utilisateur.activate(this.$route.params.id), {
        token: this.$route.params.token
      });
      this.status = "success";
    } catch (error) {
      this.error = error.response.data.user_message;
      this.status = "error";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "/css/config/colors.scss";

#content {
  text-align: center;
}

.activateUser-error {
  color: $red;
  font-weight: bold;
}
</style>