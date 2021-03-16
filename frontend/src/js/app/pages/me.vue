<template>
  <div>
    <Header></Header>
    <section class="section wrapper">
      <h1 class="section-title section-title--stylish" id="titre">
        <span>Votre espace membre</span>
      </h1>

      <h2>Statut Strava</h2>
      <p v-if="utilisateur.strava_id !== null">
        <font-awesome-icon icon="check"></font-awesome-icon>&nbsp;Votre compte Strava est bien synchronisé !
      </p>
      <div v-else class="stravaStatus">
        <p>
          <font-awesome-icon icon="times"></font-awesome-icon>&nbsp;Votre compte Strava n'est pas encore synchronisé !
        </p>
        <p>Cliquez sur le bouton ci-dessous pour connecter votre Strava à Définisher</p>
        <p>
          <a class="link" :href="stravaUrl">
            <img src="/img/strava_connect.png" alt="Cliquez ici pour connecter Strava" />
          </a>
        </p>
      </div>

      <h2>Vos défis</h2>
      <div v-if="challenges.length > 0">
        <section class="challengeGrid">
          <article class="challenge" v-for="challenge in challenges" v-bind:key="challenge.id">
            <header class="challenge-header">
              <router-link
                tag="figure"
                class="challenge-thumbnail"
                :to="`/mon-defi/${challenge.slug}#map`"
              >
                <img :src="challenge.images.miniature" alt="Photo du défi" />
              </router-link>
              <router-link
                tag="h1"
                class="challenge-title"
                :to="`/mon-defi/${challenge.slug}#map`"
              >{{ challenge.nom }}</router-link>
            </header>
          </article>
        </section>
      </div>
      <p v-else>
        Vous n'avez pas encore de défi en cours !
        <br />
        <router-link to="/#les-defis" class="link">Consultez nos défis</router-link>
      </p>

      <h2>Actions</h2>
      <p>
        <router-link to="/deconnexion">Déconnexion</router-link>
      </p>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "#app/layout/footer.vue";
import Header from "#app/layout/header.vue";
import Challenge from "#app/components/challenge.vue";

export default {
  components: {
    Header,
    Footer,
    Challenge
  },

  computed: {
    stravaUrl() {
      return `https://www.strava.com/oauth/authorize?client_id=47961&response_type=code&redirect_uri=${Definisher.SELF_URL}/liaison-a-strava&approval_prompt=auto&scope=activity:read_all`;
    },
    utilisateur() {
      return this.$store.state.settings.utilisateur.utilisateur;
    },
    challenges() {
      return this.utilisateur.commandes
        .reduce((acc, { lignes_achat }) => {
          return [...acc, ...lignes_achat.map(({ challenge }) => challenge)];
        }, [])
        .map(id1 => {
          return this.$store.getters["settings/challenges"].find(
            ({ id: id2 }) => id1 === id2
          );
        });
    }
  }
};
</script>

<style lang="scss" scoped>
h2 {
  margin-top: 3rem;
}

.challengeGrid {
  align-items: flex-start;
  justify-content: start;
}

.stravaStatus p {
  margin: 1rem 0;
}
</style>
