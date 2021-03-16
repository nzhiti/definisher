<template>
  <div>
    <Header></Header>

    <section class="myChallenge">
      <!-- stats -->
      <aside class="myChallenge-aside" v-if="challenge">
        <h1 class="section-title section-title--stylish" id="titre">
          <span>{{ challenge ? challenge.nom : "..." }}</span>
        </h1>
        <h2 v-if="tempsRestant !== null">
          Temps restant pour compléter le défi
        </h2>
        <p v-if="tempsRestant !== null">
          Il ne vous reste plus que
          <strong class="red">{{ tempsRestant }} minutes</strong> pour terminer
          le défi !
        </p>
        <h2>Vos activités</h2>
        <p>
          Voici un résumé de toutes les activités qui ont été comptabilisées
          pour ce défi :
        </p>
        <section
          v-for="(etape, index) in challenge.etapes"
          v-bind:key="etape.id"
        >
          <h3 v-if="challenge.etapes.length > 1">
            {{ etape.nom }}
            <span
              v-if="isTermine || index < indexEtapeEnCours"
              class="tag tag--green"
              >terminé</span
            >
            <span v-else-if="index === indexEtapeEnCours" class="tag"
              >en cours</span
            >
          </h3>
          <ul>
            <li>
              Nombre d'activités :
              <strong>{{ etape.activites.all.number }}</strong>
              <span v-if="isTeamChallenge">
                <br />(dont <strong>{{ etape.activites.mine.number }}</strong> à
                vous)
                <br />
              </span>
            </li>
            <li>
              Distance parcourue :
              <strong
                >{{
                  Math.round(etape.activites.all.distance / 10) / 100
                }}km</strong
              >
              <span v-if="isTeamChallenge">
                <br />(dont
                <strong>{{
                  Math.round(etape.activites.mine.distance / 10) / 100
                }}</strong>
                à vous)
                <br />
              </span>
            </li>
            <li>
              Dénivelé positif parcouru :
              <strong>{{ etape.activites.all.denivele }}m</strong>
              <span v-if="isTeamChallenge">
                <br />(dont
                <strong>{{ etape.activites.mine.denivele }}</strong> à vous)
                <br />
              </span>
            </li>
          </ul>
        </section>
        <h2 v-if="parcoursRestant > 0">Ce qui vous attend</h2>
        <p v-if="parcoursRestant > 0">
          Il vous reste donc
          <strong class="red"
            >{{ Math.round(parcoursRestant) }}{{ typeDeParcours }}</strong
          >
          à faire pour terminer {{ wording.ce_defi }} !
        </p>
        <p v-if="etapeEstimable">
          À ce rythme là, il vous reste encore
          <strong class="red">{{ activitesRestantes }} activités</strong> pour
          compléter {{ wording.le_defi }} !
        </p>
      </aside>

      <!-- map -->
      <div
        v-if="showMap"
        id="map"
        class="myChallenge-map myChallenge-map--loaded"
        v-bind:class="{
          [`myChallenge--${challenge ? challenge.slug : ''}`]: true,
        }"
      >
        <div class="myChallenge-progress">
          <span class="start"></span>
          <span class="path">
            <span ref="completed"></span>
          </span>
          <span class="end"></span>
        </div>
      </div>
      <div class="myChallenge-singleActivityStatus" v-else>
        <span v-if="challenge.pas_encore_debute"
          >Ce défi n'a pas encore débuté</span
        >
        <span v-else-if="parcoursRestant === 0"
          >Bravo ! Vous avez terminé ce défi !</span
        >
        <span v-else-if="challenge.est_expire">Ce défi est terminé...</span>
        <span v-else>Le défi est en cours ! Enfilez vos baskets !</span>
      </div>
    </section>

    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "#app/layout/footer.vue";
import Header from "#app/layout/header.vue";
import L from "leaflet";
import "leaflet-gpx";
import "leaflet-providers";
import routes from "#app/api";

export default {
  components: {
    Footer,
    Header,
  },

  data() {
    return {
      challenge: null,
      map: null,
    };
  },

  computed: {
    tempsRestant() {
      if (!this.challenge) {
        return null;
      }

      if (this.challenge.delai_maximum === null) {
        return null;
      }

      if (this.challenge.etapes[0].premiere_activite_le === null) {
        return null;
      }

      const today = new Date();
      const refMax =
        new Date(this.challenge.etapes[0].premiere_activite_le).getTime() +
        this.challenge.delai_maximum * 60000;
      return Math.max(
        0,
        Math.round(((refMax - today) / (1000 * 60)) * 100) / 100
      );
    },
    wording() {
      return {
        ce_defi: this.isLastEtape ? "ce défi" : "cette étape",
        le_defi: this.isLastEtape ? "le défi" : "cette étape",
      };
    },
    isLastEtape() {
      return this.indexEtapeEnCours === this.challenge.etapes.length - 1;
    },
    indexEtapeEnCours() {
      if (!this.challenge) {
        return 0;
      }

      return this.challenge.etapes.findIndex(
        ({ distance_restante, denivele_restant }) => {
          return distance_restante > 0 || denivele_restant > 0;
        }
      );
    },
    isTermine() {
      return this.indexEtapeEnCours === -1;
    },
    etapeEnCours() {
      if (!this.challenge) {
        return null;
      }

      return this.challenge.etapes.find(
        ({ distance_restante, denivele_restant }) => {
          return distance_restante > 0 || denivele_restant > 0;
        }
      );
    },
    isTeamChallenge() {
      return this.challenge && this.challenge.par_equipe;
    },
    etapeEstimable() {
      if (!this.etapeEnCours) {
        return false;
      }

      return (
        this.etapeEnCours.en_une_activite !== true &&
        !this.isTeamChallenge &&
        this.etapeEnCours.activites.mine.number > 0
      );
    },
    distanceParcourue() {
      if (!this.etapeEnCours) {
        return 0;
      }

      return (
        Math.round(
          (this.etapeEnCours.distance - this.etapeEnCours.distance_restante) * 2
        ) / 2
      );
    },
    deniveleParcouru() {
      if (!this.etapeEnCours) {
        return 0;
      }

      return (
        Math.round(
          (this.etapeEnCours.denivele - this.etapeEnCours.denivele_restant) * 2
        ) / 2
      );
    },
    activitesRestantes() {
      if (!this.etapeEnCours) {
        return 0;
      }

      // @todo: gérer les activités à double objectif
      let parcouru;
      let restant;
      if (this.etapeEnCours.distance > 0) {
        parcouru = this.distanceParcourue;
        restant = this.etapeEnCours.distance_restante;
      } else {
        parcouru = this.deniveleParcouru;
        restant = this.etapeEnCours.denivele_restant;
      }

      const moyenneParActivite =
        parcouru / this.etapeEnCours.activites.all.number;
      return Math.ceil(restant / moyenneParActivite);
    },
    parcoursRestant() {
      if (!this.etapeEnCours) {
        return 0;
      }

      if (this.etapeEnCours.distance > 0) {
        return this.etapeEnCours.distance_restante / 1000;
      }

      return this.etapeEnCours.denivele_restant;
    },
    typeDeParcours() {
      // @todo: gérer les activités à double objectif
      if (!this.etapeEnCours || this.etapeEnCours.distance > 0) {
        return "km";
      }

      return "m de D+";
    },
    showMap() {
      if (!this.challenge) {
        return true;
      }

      return (
        [
          "la-traversee-des-pyrenees",
          "la-traversee-de-la-corse",
          "l-ascension-du-mont-blanc",
          "un-ticket-pour-la-lune",
          "un-ticket-pour-la-lune-prive",
        ].indexOf(this.challenge.slug) >= 0
      );
    },
  },

  mounted() {
    window.addEventListener("resize", this.onResize);

    this.challenge = Object.assign(
      this.$store.state.settings.utilisateur.utilisateur.challenges.find(
        ({ slug }) => {
          return slug === this.$route.params.id;
        }
      ),
      this.$store.getters["settings/challenges"].find(
        ({ slug }) => slug === this.$route.params.id
      )
    );

    if (this.challenge === undefined) {
      this.$router.replace("/connexion-gps-perdue");
      return;
    }

    if (/^un-ticket-pour-la-lune/i.test(this.challenge.slug)) {
      this.drawMoon();
    } else if (this.challenge.slug === "l-ascension-du-mont-blanc") {
      this.drawMontBlanc();
    } else if (this.challenge.slug === "djogdei-2020") {
      this.drawDjogdei();
    } else if (/^decathlon-triathlon/.test(this.challenge.slug) === true) {
      this.drawDecathlon();
    } else {
      this.drawMap();
    }
  },

  destroyed() {
    window.removeEventListener("resize", this.onResize);
  },

  methods: {
    drawMap() {
      const layers = this.getMapLayers();
      this.map = L.map("map", {
        zoom: 13,
        layers: [layers.Dessin],
        scrollWheelZoom: false,
        dragging: !L.Browser.mobile,
        tap: !L.Browser.mobile,
      });
      this.map.zoomControl.setPosition("bottomright");
      L.control.layers(layers, undefined, { collapsed: false }).addTo(this.map);

      this.addGpx(
        "full",
        `${Definisher.API_URL}/assets/gpx/${this.challenge.slug}.gpx`,
        "blue",
        "Voir tout le tracé",
        true
      );
      this.addGpx(
        "partial",
        routes.utilisateur.gpx(
          this.$store.state.settings.utilisateur.utilisateur.id,
          this.challenge.id
        ),
        "#CF1717",
        "Voir mon parcours"
      );
    },
    drawMoon() {
      setTimeout(() => {
        const completed = this.challenge.pourcentage_completion * 100;
        this.$refs.completed.style.width = `${completed}%`;
      }, 100);
    },
    drawDecathlon() {},
    drawMontBlanc() {
      setTimeout(() => {
        const completed = this.challenge.pourcentage_completion;
        this.$refs.completed.style.paddingTop = `${completed * 30.9}%`;
      }, 100);
    },
    drawDjogdei() {},
    getMapLayers() {
      return {
        Satellite: L.tileLayer.provider("Esri.WorldImagery"),
        Dessin: L.tileLayer.provider("CartoDB.Positron"),
      };
    },
    onResize() {
      this.map.invalidateSize(true);
    },
    addGpx(name, url, color, zoomButtonLabel, autoFit = false) {
      return new L.GPX(url, {
        async: true,
        polyline_options: {
          color,
          opacity: 0.5,
          weight: 3,
          lineCap: "round",
        },
        marker_options: {
          startIconUrl: null,
          endIconUrl: null,
          shadowUrl: null,
        },
      })
        .on("loaded", (e) => {
          const bounds = e.target.getBounds();
          const fit = () => {
            this.map.fitBounds(bounds);
          };

          if (autoFit === true) {
            fit();
          }

          L.control.fit = L.Control.extend({
            onAdd: function (map) {
              const button = L.DomUtil.create("button", "map--action");
              button.appendChild(document.createTextNode(zoomButtonLabel));
              button.addEventListener("click", fit);
              return button;
            },
          });

          new L.control.fit({ position: "topright" }).addTo(this.map);
        })
        .addTo(this.map);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "/css/config/colors.scss";
@import "/css/config/vars.scss";

.myChallenge {
  display: flex;
  width: 100%;
  flex-direction: column;
}

.myChallenge-aside {
  padding: 3rem 3rem 2rem;
  border-bottom: 2rem solid $blue_dark;

  p {
    margin: 1rem 0;
  }

  h2:not(:first-of-type) {
    margin: 2rem 0 0;
    padding: 0;
  }

  strong.red {
    color: $red;
    text-decoration: underline;
  }
}

.myChallenge-map {
  flex-grow: 1;
  height: 100vh;
  overflow: hidden;
}

.myChallenge--un-ticket-pour-la-lune,
.myChallenge--un-ticket-pour-la-lune-prive {
  position: relative;
  background-image: url("/img/defis/terre_lune.jpg");
  background-repeat: no-repeat;
  background-size: 200%;
  background-position: 30% center;
  background-color: black;

  > .myChallenge-progress {
    position: absolute;
    top: 49.5%;
    width: 100%;

    > span {
      position: absolute;
      display: block;
      background: white;

      &.start,
      &.end {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;
        box-shadow: 0 0 0.5rem rgba(255, 255, 255, 1);
      }

      &.start {
        left: 2%;
      }

      &.end {
        right: 5%;
      }

      &.path {
        margin-top: 0.25rem;
        left: 3%;
        right: 6%;
        height: 0.25rem;
        background: rgba(255, 255, 255, 0.5);

        > span {
          float: right;
          display: block;
          transition: width 5s ease-in-out;
          background: white;
          height: 100%;
          width: 0;
        }
      }
    }
  }
}

.myChallenge--l-ascension-du-mont-blanc {
  position: relative;
  background-image: url("/img/defis/mont_blanc.jpg");
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: right bottom;
  background-color: #ff2f3c;
  max-height: 68vh;

  > .myChallenge-progress {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;

    > .path {
      display: block;
      width: 100%;

      > span {
        display: block;
        width: 100%;
        padding-top: 0%; // 100% = 30.9%
        background-image: url("/img/defis/mont_blanc_progress.png");
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: right bottom;
      }
    }
  }
}

.myChallenge-singleActivityStatus {
  position: relative;
  display: flex;
  flex-grow: 1;
  min-height: 50vh;
  background: #eee;
  align-items: center;
  justify-content: center;

  > span {
    text-align: center;
    font-size: 2rem;
  }
}

@media screen and (min-width: $BREAK_1) {
  .myChallenge {
    flex-direction: row;
  }

  .myChallenge-aside {
    max-width: 20rem;
    border-bottom: none;

    h2 {
      text-align: center;
    }

    h2:not(:first-of-type) {
      margin-top: 3rem;
    }
  }

  .myChallenge--un-ticket-pour-la-lune,
  .myChallenge--un-ticket-pour-la-lune-prive {
    > .myChallenge-progress {
      top: 48.5%;

      > span {
        &.start,
        &.end {
          width: 2rem;
          height: 2rem;
        }

        &.path {
          margin-top: 0.75rem;
          height: 0.5rem;
        }
      }
    }
  }

  .myChallenge--l-ascension-du-mont-blanc {
    max-height: 100vh;
  }
}
</style>

<style lang="scss">
@import "/css/config/colors.scss";

.leaflet-control.map--action {
  font-family: Poppins;
  background: $red;
  border: none;
  padding: 0.5rem 1rem;
  color: $white;
  cursor: pointer;
  border-radius: 0.5rem;
}
</style>