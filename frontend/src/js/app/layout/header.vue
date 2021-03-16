<template>
  <div>
    <header class="topbar" v-bind:class="{ [`topbar--${theme}`]: true }">
      <div class="wrapper">
        <h1 class="logo">
          <router-link to="/"></router-link>
        </h1>

        <span class="topbar-hamburger" @click="toggleMenu">
          <font-awesome-icon :icon="menuIsExpanded ? 'times' : 'bars'"></font-awesome-icon>
        </span>

        <nav class="topbar-links" ref="links">
          <ul>
            <li>
              <router-link to="/#relevez-le-defi">Relevez le défi !</router-link>
            </li>
            <li>
              <router-link to="/#les-defis">Les défis</router-link>
            </li>
            <li>
              <router-link to="/#en-savoir-plus">En savoir plus</router-link>
            </li>
            <li>
              <router-link
                to="/authentification#connexion"
                v-if="$store.state.settings.utilisateur.utilisateur === null"
              >
                Me connecter&nbsp;
                <font-awesome-icon icon="user"></font-awesome-icon>
              </router-link>
              <router-link to="/espace-membre" v-else>
                Espace membre&nbsp;
                <font-awesome-icon icon="user"></font-awesome-icon>
              </router-link>
            </li>
            <li v-if="utilisateur !== null && utilisateur.est_administrateur === true">
              <router-link to="/administration/definishers#titre">Administration</router-link>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <BannerChallenge v-if="challenge !== null" :challenge="challenge"></BannerChallenge>
    <BannerDefault v-else></BannerDefault>
  </div>
</template>

<script>
import BannerChallenge from "#app/layout/banner_challenge.vue";
import BannerDefault from "#app/layout/banner_default.vue";

export default {
  props: {
    challenge: {
      type: Object,
      required: false,
      default() {
        return null;
      }
    }
  },

  components: {
    BannerChallenge,
    BannerDefault
  },

  data() {
    return {
      linksHeight: null, // in px
      menuIsExpanded: false
    };
  },

  computed: {
    theme() {
      return this.challenge !== null ? this.challenge.theme : "light";
    },
    utilisateur() {
      return this.$store.state.settings.utilisateur.utilisateur;
    }
  },

  mounted() {
    // when the menu finishes hiding on "mobile" mode, remove the maxHeight directive
    // this is necessary otherwise would be invisible if switching to "desktop" mode
    this.$refs.links.addEventListener("transitionend", () => {
      if (!this.menuIsExpanded) {
        this.$refs.links.removeAttribute("style");
      }
    });
  },

  methods: {
    toggleMenu() {
      this.menuIsExpanded = !this.menuIsExpanded;

      // calculate the height of the menu before transitioning
      if (this.menuIsExpanded && this.linksHeight === null) {
        this.linksHeight = this.$refs.links.offsetHeight;
        this.$refs.links.classList.add("topbar-links--measured");

        // we must timeout to let the browser reflow after adding the class
        setTimeout(this.syncMenuHeight.bind(this), 50);
      } else {
        this.syncMenuHeight();
      }
    },

    syncMenuHeight() {
      this.$refs.links.style.maxHeight = this.menuIsExpanded
        ? `${this.linksHeight}px`
        : 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "/css/config/vars.scss";

.topbar {
  margin-top: 1rem;
  margin-bottom: 0.75rem;
}

@media screen and (min-width: $BREAK_1) {
  .topbar {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
}
</style>