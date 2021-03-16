<template>
  <div>
    <Header></Header>
    <section class="section wrapper">
      <h1 class="section-title section-title--stylish" id="titre">
        <span>Réinitialisation de votre mot de passe</span>
      </h1>
      <p
        class="formulate-description"
      >Veuillez remplir le formulaire ci-dessous pour choisir un nouveau mot de passe :</p>
      <FormulateForm @submit="submit" :form-errors="formErrors">
        <FormulateInput
          type="myPassword"
          name="mot_de_passe"
          label="Votre nouveau mot de passe"
          :validation="['required', ['min', 10]]"
          validation-name="Le mot de passe"
          :error="inputErrors.mot_de_passe"
          :disabled="pending"
        ></FormulateInput>
        <FormulateInput type="submit" label="Réinitialiser mon mot de passe" :disabled="pending">
          <img src="/img/spinner.gif" alt="Chargement en cours..." v-if="pending" />
        </FormulateInput>
      </FormulateForm>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "#app/layout/footer.vue";
import Header from "#app/layout/header.vue";

export default {
  components: {
    Footer,
    Header
  },

  data() {
    return {
      pending: false,
      formErrors: [],
      inputErrors: {}
    };
  },

  methods: {
    async submit(data) {
      this.inputErrors = {};
      this.formErrors = [];
      this.pending = true;

      try {
        await this.$store.dispatch(
          "settings/utilisateur/resetPassword",
          Object.assign(data, {
            utilisateur_id: this.$route.params.id,
            token: this.$route.params.token
          })
        );

        this.$toasted.success(
          "Votre nouveau mot de passe a bien été enregistré !",
          {
            position: "top-center",
            duration: 3000,
            fitToScreen: true,
            icon: "fa-check"
          }
        );
        this.$router.push("/authentification#connexion");
      } catch (error) {
        this.pending = false;
        if (!error.response) {
          this.formErrors = ["Une erreur inconnue est survenue"];
          return;
        }

        this.formErrors = [error.response.data.user_message];
        this.inputErrors = error.response.data.details || {};
      }
    }
  }
};
</script>