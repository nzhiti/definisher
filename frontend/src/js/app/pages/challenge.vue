<template>
  <div>
    <Header :challenge="challenge"></Header>

    <section class="section section--pChallenge pChallenge-profile" v-if="challenge">
      <h1 class="section-title section-title--stylish" id="titre">
        <span>{{ challenge.catch }}</span>
      </h1>
    </section>

    <section class="section section--pChallenge pChallenge-description" v-if="challenge">
      <Slider
        v-if="challenge.images.slideshow.length > 0"
        :images="challenge.images.slideshow"
        class="pChallenge-image"
      ></Slider>
      <div class="pChallenge-content">
        <h1>{{ challenge.sections.description.titre }}</h1>
        <p v-html="challenge.sections.description.contenu"></p>
        <p>
          <ChallengeCta
            :challenge="challenge"
            :destination="`${this.$route.path}#offre`"
            label="Je veux le faire !"
          ></ChallengeCta>
        </p>
      </div>
    </section>

    <section class="section section--pChallenge pChallenge-medal" v-if="challenge">
      <div class="pChallenge-content">
        <h1>{{ challenge.sections.medaille.titre }}</h1>
        <p v-html="challenge.sections.medaille.contenu"></p>
      </div>
      <p class="pChallenge-image">
        <img :src="challenge.images.medal" alt="Photo de la médaille" />
      </p>
    </section>

    <section class="section section--pChallenge pChallenge-cta" id="offre" v-if="challenge">
      <article class="offer">
        <header class="offer-header">
          <h1>{{ challenge.nom }}</h1>
        </header>

        <div class="offer-content">
          <ul class="offer-items fa-ul">
            <li v-for="(item, index) in items" v-bind:key="index">
              <span class="fa-li">
                <font-awesome-icon icon="check" />
              </span>
              {{ item }}
            </li>
          </ul>

          <p class="offer-price">{{ challenge.prix }} €</p>
        </div>

        <footer class="offer-footer">
          <ChallengeCta :challenge="challenge" @click="buy" label="Je m'inscris !"></ChallengeCta>
        </footer>
      </article>
    </section>

    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "#app/layout/footer.vue";
import Header from "#app/layout/header.vue";
import Slider from "#app/components/slider.vue";
import ChallengeCta from "#app/components/challengeCta.vue";

export default {
  components: {
    Footer,
    Header,
    Slider,
    ChallengeCta,
  },

  data() {
    return {
      challenge: null,
    };
  },

  computed: {
    items() {
      if (this.challenge !== null) {
        if (this.challenge.slug === "djogdei-2020") {
          return [
            "L'inscription à la course",
            "Minimum 1 euro reversé à l'association",
            "Une médaille unique de qualité",
            "L'envoi de la médaille",
            "Le plaisir de faire partie de la communauté de Djodei",
            "Participer à la 1ère course virtuelle de France pour la 3ème édition",
          ];
        }

        if (/^decathlon-triathlon/.test(this.challenge.slug) === true) {
          return [
            "L'inscription au défi",
            "L'inscription au tirage au sort pour des lots Aptonia",
            "Une superbe médaille virtuelle",
            "De la motivation pour de nombreuses heures d'effort !!",
            "La fierté d'être allé(e) au bout du défi !",
          ];
        }
      }

      return [
        "L'inscription au défi",
        "L'avancée sur une carte vers l'accomplissement de ton défi",
        "Une médaille unique de qualité",
        "L'envoi de la médaille",
        "De la motivation pour de nombreuses heures d'effort !!",
        "La fierté d'être allé(e) au bout du défi !",
      ];
    },
  },

  mounted() {
    this.challenge = this.$store.getters["settings/challenges"].find(
      ({ slug }) => slug === this.$route.params.id
    );

    if (this.challenge === undefined) {
      this.$router.replace("/connexion-gps-perdue");
    }
  },

  methods: {
    buy() {
      this.$store.commit("panier/add", this.challenge);
      this.$router.push("/achat");
    },
  },
};
</script>

<style lang="scss">
.pChallenge-description .pChallenge-content img {
  max-width: 300px;
}
</style>

<style lang="scss" scoped>
@import "/css/config/colors.scss";
@import "/css/config/vars.scss";
.slider {
  width: 100vw;
  height: 100vw;
  margin-bottom: 1rem;
}

.section--pChallenge {
  padding-left: 5vw;
  padding-right: 5vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.pChallenge-profile {
  padding-bottom: 0;

  > img {
    display: none;
    width: 100%;
    max-width: 1500px;
  }
}

.pChallenge-content {
  > p {
    margin: 1rem 0;
  }
}

.pChallenge-description {
  padding-top: 1rem;

  .pChallenge-content {
    padding-top: 2rem;
  }
}

.pChallenge-medal {
  padding-top: 3rem;
  padding-bottom: 2rem;
  background: $gray_light;

  .pChallenge-content {
    padding-bottom: 1rem;
  }
}

@media screen and (min-width: $BREAK_2) {
  .pChallenge-description {
    margin-right: auto;
    margin-left: auto;
    max-width: 90vw;
    flex-direction: row;
    align-items: center;
    text-align: center;
    justify-content: space-between;
    font-size: 1.3rem;

    .pChallenge-content {
      padding-left: 4rem;
    }
  }

  .slider {
    min-width: 18rem;
    min-height: 18rem;
    max-width: 30vw;
    max-height: 30vw;
    flex-shrink: 0;
  }

  .pChallenge-medal {
    padding-top: 0;
    flex-direction: row;
    align-items: center;
    text-align: center;
    justify-content: center;
    font-size: 1.5rem;

    .pChallenge-content {
      padding-right: 5rem;
      width: 25rem;
    }

    .pChallenge-image {
      align-self: flex-start;

      > img {
        width: 20rem;
      }
    }
  }
}

@media screen and (min-width: $BREAK_1) {
  .pChallenge-description {
    max-width: 90rem;
  }

  .pChallenge-medal {
    .pChallenge-content {
      padding-right: 15rem;
    }
  }
}
</style>