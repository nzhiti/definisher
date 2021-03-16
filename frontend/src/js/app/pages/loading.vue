<template>
  <transition>
    <div class="loading" ref="container">
      <div class="splashscreen"></div>
      <span class="loading-title" v-if="status === 'pending'">
        <img src="/img/spinner.gif" alt="Chargement en cours..." />
      </span>
      <span
        class="loading-title"
        v-if="status === 'error'"
      >Le chargement du site a échoué, veuillez réessayer dans quelques instants.</span>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      timeouts: {
        splash: null,
        spinner: null
      },
      status: "loading"
    };
  },

  async mounted() {
    // animate the splashscreen and spinner
    this.timeouts.splash = setTimeout(() => {
      this.$refs.container.classList.add("loading--shown");

      if (this.status !== "error") {
        this.timeouts.spinner = setTimeout(() => {
          this.status = "pending";
        }, 3000);
      }
    }, 500);

    // request the settings
    try {
      await this.$store.dispatch("settings/load");
      this.status = "success";
      this.$router.push("/entrypoint");
    } catch (error) {
      this.status = "error";
      clearTimeout(this.timeouts.spinner);
    }
  },

  destroyed() {
    clearTimeout(this.timeouts.splash);
    clearTimeout(this.timeouts.spinner);
  }
};
</script>

<style lang="scss" scoped>
@import "/css/config/colors.scss";

.loading {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease-out;

  &.v-leave-to {
    opacity: 0;
  }

  .splashscreen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    background: url("/img/definisher.png") no-repeat center;
    background-color: #fff;
    background-size: contain;
    transition: opacity 3s ease-out;
  }

  &.loading--shown {
    &.v-leave {
      transition: opacity 0s linear;
    }

    .splashscreen {
      opacity: 1;
    }
  }

  .loading-title {
    position: absolute;
    z-index: 2;
    bottom: 10%;
    left: 5%;
    width: 90%;
    text-align: center;
    color: $red;
  }
}
</style>