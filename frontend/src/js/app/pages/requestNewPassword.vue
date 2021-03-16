<template>
  <div>
    <Header></Header>
    <section class="section wrapper">
      <h1 class="section-title section-title--stylish" id="titre">
        <span>Mot de passe perdu ?</span>
      </h1>

      <p
        class="formulate-description"
      >Si vous n'arrivez plus à vous connecter ou que vous avez perdu votre mot de passe, remplissez le formulaire ci-dessous pour définir un nouveau mot de passe :</p>

      <FormulateForm @submit="submit" :form-errors="formErrors">
        <FormulateInput
          type="email"
          name="email"
          label="Votre email"
          placeholder="Saisissez ici l'email de votre compte Definisher"
          class="input"
          validation="email"
          :error="inputErrors.email"
          :disabled="pending"
        ></FormulateInput>
        <FormulateInput type="submit" label="Demander un nouveau mot de passe" :disabled="pending">
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
    Header,
    Footer
  },

  data() {
    return {
      pending: false,
      inputErrors: {},
      formErrors: []
    };
  },

  methods: {
    async submit(data) {
      this.inputErrors = {};
      this.formErrors = [];
      this.pending = true;

      try {
        await this.$store.dispatch(
          "settings/utilisateur/requestNewPassword",
          data
        );
        this.$toasted.success(
          "Un email vient de vous être envoyé avec les instructions à suivre",
          {
            position: "top-center",
            duration: 3000,
            fitToScreen: true,
            icon: "fa-check"
          }
        );
        this.$router.push("/");
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