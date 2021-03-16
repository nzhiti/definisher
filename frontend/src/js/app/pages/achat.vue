<template>
  <div>
    <Header></Header>
    <section class="section section--achat wrapper">
      <h1 class="section-title section-title--stylish" id="titre">
        <span>Votre commande</span>
      </h1>
      <p v-if="error">
        Vous êtes déjà inscrit(e) à ce défi.
        <br />Consultez votre
        <router-link to="/espace-membre#titre" class="link"
          >espace membre</router-link
        >!
      </p>
      <p v-else-if="empty">
        Vous n'avez rien dans votre panier.
        <br />Consultez
        <router-link to="/#les-defis" class="link"
          >la liste de nos défis !</router-link
        >
      </p>
      <div v-else>
        <h2>Résumé de votre commande</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Produit acheté</th>
              <th>Quantité</th>
              <th class="total">Total TTC</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="challenge in panier" v-bind:key="challenge.id">
              <td>{{ challenge.nom }}</td>
              <td>1</td>
              <td class="total">{{ challenge.prix }} €</td>
            </tr>
          </tbody>
        </table>

        <table class="table table--additional">
          <tbody>
            <tr>
              <th>Code de réduction</th>
              <td class="total">
                <FormulateInput
                  type="text"
                  name="code"
                  class="input input--code"
                  v-model="code.typed"
                  :error="code.error"
                  :disabled="code.pending || code.applied !== null"
                ></FormulateInput>
                <button
                  class="button"
                  @click="applyOffer"
                  :disabled="code.pending"
                  v-if="code.applied === null"
                >
                  <img
                    src="/img/spinner.gif"
                    alt="Chargement en cours..."
                    v-if="code.pending"
                  />
                  <span v-else>Appliquer</span>
                </button>
                <span v-else>
                  <font-awesome-icon icon="check"></font-awesome-icon>
                  <em>
                    Réduction "{{ code.applied.nom }}" appliquée
                    <br />
                    ( - {{ code.applied.pourcentage }}% )
                  </em>
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <table class="table table--additional">
          <tbody>
            <tr>
              <th>Total à régler</th>
              <td class="total">{{ total }} €</td>
            </tr>
          </tbody>
        </table>

        <h2 style="clear: both">Adresse de livraison</h2>
        <p>
          Remplissez le formulaire ci-dessous avec l'adresse à laquelle vous
          souhaitez recevoir votre médaille.
        </p>
        <FormulateForm
          class="form--adresse"
          @submit="submit"
          :form-errors="formErrors"
          v-model="formValues"
        >
          <FormulateInput
            type="select"
            name="pays"
            label="Pays"
            placeholder="Votre pays"
            validation="required"
            :options="pays"
            :error="inputErrors.pays"
            :disabled="pending"
          ></FormulateInput>
          <FormulateInput
            type="text"
            name="adresse"
            label="Adresse"
            placeholder="Votre adresse"
            validation-name="L'adresse"
            validation="required"
            :error="inputErrors.adresse"
            :disabled="pending"
          ></FormulateInput>
          <FormulateInput
            type="text"
            name="code_postal"
            label="Code postal"
            placeholder="Votre code postal"
            validation="required"
            validation-name="Le code postal"
            :error="inputErrors.code_postal"
            :disabled="pending"
          ></FormulateInput>
          <FormulateInput
            type="text"
            name="region"
            v-if="formValues.pays !== 'FRA'"
            label="Région / Province"
            placeholder="Votre région / province"
            validation-name="La région / province"
            :error="inputErrors.region"
            :disabled="pending"
          ></FormulateInput>
          <FormulateInput
            type="text"
            name="ville"
            label="Ville"
            placeholder="Votre ville"
            validation="required"
            validation-name="La ville"
            :error="inputErrors.ville"
            :disabled="pending"
          ></FormulateInput>

          <p>
            En cliquant sur "Procéder au paiement", j'autorise Définisher à
            partager les données relatives à mon défi à ses partenaires.
          </p>
          <FormulateInput
            type="submit"
            label="Procéder au paiement"
            :disabled="pending"
          >
            <img
              src="/img/spinner.gif"
              alt="Chargement en cours..."
              v-if="pending"
            />
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
import axios from "axios";
import routes from "#app/api";
import { get as getStripe } from "#app/stripe";

export default {
  components: {
    Header,
    Footer,
  },

  data() {
    return {
      error: false,
      code: {
        typed: "",
        applied: null,
        pending: false,
        error: null,
      },
      pending: false,
      formErrors: [],
      formValues: {
        pays: "FRA",
        challenge: null,
        code: null,
      },
      inputErrors: {},
    };
  },

  computed: {
    empty() {
      return this.$store.state.panier.challenges.length === 0;
    },

    panier() {
      return this.$store.state.panier.challenges
        .map((id1) => {
          return this.$store.getters["settings/challenges"].find(
            ({ id: id2 }) => id1 === id2
          );
        })
        .filter((challenge) => challenge !== undefined && challenge !== null);
    },

    total() {
      const total = this.panier.reduce((t, { prix }) => {
        return t + prix;
      }, 0);

      if (this.code.applied === null) {
        return total;
      }

      return Math.max(0, total * ((100 - this.code.applied.pourcentage) / 100));
    },

    pays() {
      return this.$store.getters["settings/pays"].reduce(
        (acc, pays) =>
          Object.assign({}, acc, {
            [pays.code]: pays.nom,
          }),
        {}
      );
    },
  },

  mounted() {
    const boughtIds = this.$store.state.settings.utilisateur.utilisateur.challenges.map(
      ({ challenge_id }) => challenge_id
    );

    if (
      this.$store.state.panier.challenges.some(
        (id) => boughtIds.indexOf(id) !== -1
      )
    ) {
      this.error = true;
    }
  },

  methods: {
    async applyOffer() {
      if (this.code.applied !== null) {
        throw new Error("Un code de réduction est déjà appliqué");
      }

      this.code.error = null;
      this.code.pending = true;

      try {
        const { data } = await axios.get(
          routes.offres.get(this.code.typed) + "?challenge=" + this.panier[0].id
        );
        this.code.pending = false;
        this.code.applied = data;
      } catch (error) {
        this.code.pending = false;
        if (!error.response || !error.response.data.user_message) {
          this.code.error = "Erreur inconnue";
          return;
        }

        this.code.error = error.response.data.user_message;
      }
    },

    async submit(data) {
      try {
        this.pending = true;
        this.formErrors = [];
        this.inputErrors = {};

        const commande = await this.$store.dispatch(
          "settings/utilisateur/sendCommande",
          Object.assign(data, {
            code:
              this.code.applied !== null ? this.code.applied.code : undefined,
            challenge: this.panier[0].id,
          })
        );

        if (commande.session.substr(0, 5) === "free_") {
          this.$router.replace(
            `/finalisation-achat?session_id=${commande.session}`
          );
        } else {
          const stripe = getStripe();

          stripe
            .redirectToCheckout({
              sessionId: commande.session,
            })
            .then((result) => {
              this.formErrors = [result.error.message];
              this.pending = false;
            });
        }
      } catch (error) {
        this.pending = false;

        if (!error.response || !error.response.data.user_message) {
          this.formErrors = ["Une erreur inconnue est survenue"];
          return;
        }

        this.formErrors = [error.response.data.user_message];
        this.inputErrors = error.response.data.details || {};
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.section--achat {
  max-width: 70rem;
}

.table--additional {
  float: right;
  max-width: 30rem;
  margin-top: 2rem;

  text-align: center;
  clear: both;

  &:last-of-type {
    margin-bottom: 4rem;
  }
}

.input--code {
  margin: 0 auto 1rem;
  max-width: 10rem;
}

.total {
  width: 15rem;
}

.form--adresse {
  margin-top: 2rem;
  align-items: flex-start;
}
</style>