<template>
  <div class="connexion_gps_perdue">
    <section class="wrapper">
      <div class="content" ref="content">
        <h1 class="logo">
          <router-link to="/"></router-link>
        </h1>
        <p>Il semblerait que vous vous soyiez perdu(e) !</p>
        <p>
          Mais pas de panique, vous pouvez toujours revenir à l'accueil en
          <router-link to="/entrypoint" class="link">cliquant ici</router-link>.
        </p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeout: null
    };
  },

  mounted() {
    this.timeout = setTimeout(() => {
      this.$refs.content.classList.add("content--visible");
    }, 100);
  },

  destroyed() {
    clearTimeout(this.timeout);
  }
};
</script>

<style lang="scss" scoped>
@import "/css/config/vars.scss";

.connexion_gps_perdue {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image: url("/img/404.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  > .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .logo {
    margin-bottom: 2rem;
  }

  .content {
    opacity: 0;
    text-align: center;
    padding: 1rem 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.5);
    transition: opacity 0.25s ease-in-out;

    > p {
      margin: 1rem 0;
    }

    &.content--visible {
      opacity: 1;
    }
  }
}

@media screen and (min-width: $BREAK_1) {
  .connexion_gps_perdue {
    .content {
      max-width: 30vw;
      padding-left: 5rem;
      padding-right: 5rem;
    }
  }
}
</style>