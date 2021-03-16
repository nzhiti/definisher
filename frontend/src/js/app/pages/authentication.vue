<template>
  <div>
    <Header></Header>
    <section class="section wrapper" id="sign-forms">
      <div class="form">
        <h1 class="section-title section-title--stylish" id="connexion">
          <span>Connexion</span>
        </h1>
        <FormulateForm @submit="submitSignin" :form-errors="signin.formErrors">
          <FormulateInput
            type="email"
            name="email"
            label="Votre email"
            placeholder="Saisissez votre email ici"
            class="input"
            validation="email"
            :error="signin.inputErrors.email"
            :disabled="signin.pending"
          ></FormulateInput>
          <FormulateInput
            type="myPassword"
            name="mot_de_passe"
            label="Votre mot de passe"
            placeholder="Saisissez votre mot de passe ici"
            :error="signin.inputErrors.mot_de_passe"
            :disabled="signin.pending"
          ></FormulateInput>
          <p class="link">
            <router-link to="/mot-de-passe-perdu#titre" class="link">J'ai oublié mon mot de passe</router-link>
          </p>
          <FormulateInput type="submit" label="Me connecter" :disabled="signin.pending">
            <img src="/img/spinner.gif" alt="Chargement en cours..." v-if="signin.pending" />
          </FormulateInput>
        </FormulateForm>
      </div>

      <div class="form">
        <h1 class="section-title section-title--stylish" id="inscription">
          <span>Je n'ai pas de compte</span>
        </h1>
        <FormulateForm @submit="submitSignup" :form-errors="signup.formErrors">
          <FormulateInput
            type="email"
            name="email"
            label="Votre email"
            placeholder="Votre email"
            validation="email"
            :error="signup.inputErrors.email"
            :disabled="signup.pending"
          ></FormulateInput>
          <FormulateInput
            type="myPassword"
            name="mot_de_passe"
            label="Votre mot de passe"
            placeholder="Votre mot de passe"
            :validation="[['min', 10]]"
            validation-name="Le mot de passe"
            :error="signup.inputErrors.mot_de_passe"
            :disabled="signup.pending"
          ></FormulateInput>
          <FormulateInput
            type="text"
            name="prenom"
            label="Votre prénom"
            placeholder="Votre prénom"
            validation="required"
            validation-name="Le prénom"
            :error="signup.inputErrors.prenom"
            :disabled="signup.pending"
          ></FormulateInput>
          <FormulateInput
            type="text"
            name="nom_de_famille"
            label="Votre nom"
            placeholder="Votre nom"
            validation="required"
            validation-name="Le nom"
            :error="signup.inputErrors.nom_de_famille"
            :disabled="signup.pending"
          ></FormulateInput>

          <FormulateInput
            type="checkbox"
            name="cgu"
            :label="'{}'"
            validation="required"
            validation-name="Accepter les CGU"
            :error="signup.inputErrors.cgu"
            :disabled="signup.pending"
          >
            <div slot="label" class="formulate-input-label">
              J'accepte les
              <a :href="cgurl" class="link">conditions générales d'utilisation</a>
            </div>
          </FormulateInput>

          <FormulateInput type="submit" label="M'inscrire" :disabled="signup.pending">
            <img src="/img/spinner.gif" alt="Chargement en cours..." v-if="signup.pending" />
          </FormulateInput>
        </FormulateForm>
      </div>
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
      cgurl: `${Definisher.API_URL}/assets/cgu/conditions_generales_utilisation_definisher_2020_01.pdf`,

      signin: {
        pending: false,
        inputErrors: {},
        formErrors: []
      },

      signup: {
        pending: false,
        inputErrors: {},
        formErrors: []
      }
    };
  },

  methods: {
    async submitSignin(data) {
      this.signin.inputErrors = {};
      this.signin.formErrors = [];
      this.signin.pending = true;

      try {
        await this.$store.dispatch("settings/utilisateur/signin", data);
        this.$router.push("/entrypoint");
      } catch (error) {
        this.signin.pending = false;
        if (!error.response) {
          this.signin.formErrors = ["Une erreur inconnue est survenue"];
          return;
        }

        this.signin.formErrors = [error.response.data.user_message];
        this.signin.inputErrors = error.response.data.details || {};
      }
    },

    async submitSignup(data) {
      this.signup.inputErrors = {};
      this.signup.formErrors = [];
      this.signup.pending = true;

      try {
        await this.$store.dispatch("settings/utilisateur/signup", data);
        this.$toasted.success(
          "Un email vient de vous être envoyé pour activer votre compte",
          {
            position: "top-center",
            duration: 3000,
            fitToScreen: true,
            icon: "fa-check"
          }
        );
        this.$router.push("/");
      } catch (error) {
        this.signup.pending = false;
        if (!error.response) {
          this.signup.formErrors = ["Une erreur inconnue est survenue"];
          return;
        }

        this.signup.formErrors = [error.response.data.user_message];
        this.signup.inputErrors = error.response.data.details || {};
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "/css/config/vars.scss";

#sign-forms {
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;

  > .form:not(:last-child) {
    margin-bottom: 3rem;
  }
}

@media screen and (min-width: $BREAK_1) {
  #sign-forms {
    flex-direction: row;

    > .form:not(:last-child) {
      padding-right: 3rem;
    }
  }
}
</style>