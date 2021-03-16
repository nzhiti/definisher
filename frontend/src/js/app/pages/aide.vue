<template>
  <div>
    <Header></Header>
    <section class="section wrapper section--help">
      <h1 class="section-title section-title--stylish" id="titre">
        <span>Besoin d'aide ?</span>
      </h1>
      <p>
        Vous avez un doute, une question, un problème, une suggestion ?
        <br />Alors n'hésitez pas à nous contacter soit :
      </p>
      <ul>
        <li>
          par mail, à l'adresse
          <a
            href="mailto:support@definisher.fr"
            class="link"
          >support@definisher.fr</a>
        </li>
        <li>
          en discussion instantanée sur le channel #aide de
          <a
            href="https://discord.gg/gAv4cZG"
            class="link"
          >notre Discord</a>
        </li>
      </ul>
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
  }
};
</script>

<style lang="scss" scoped>
.section--help {
  max-width: 40rem;

  p {
    margin: 1rem 0;
  }
}
</style>