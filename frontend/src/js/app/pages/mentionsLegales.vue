<template>
  <div>
    <Header></Header>
    <section class="section wrapper section--help">
      <h1 class="section-title section-title--stylish" id="titre">
        <span>Mentions légales</span>
      </h1>
      <h2>Responsables éditoriaux</h2>
      <p>
        <router-link to="/">Définisher.fr</router-link>&nbsp;est édité par Jonathan Denis.
      </p>
      <h2>Prestaire technique</h2>
      <p>
        <router-link to="/">Définisher.fr</router-link>&nbsp;est développé et administré par la Société
        <strong>POENSIS SARL</strong> :
      </p>
      <ul>
        <li>Code APE 6201Z</li>
        <li>N° TVA : FR83809806011</li>
        <li>Immatriculée au RCS de Versailles sous le numéro 809 806 011</li>
      </ul>
      <h2>Prestataire d'hébergement</h2>
      <p>
        <router-link to="/">Définisher.fr</router-link>&nbsp;est hébergé par la société
        <strong>OVH</strong> :
      </p>
      <ul>
        <li>Code APE 6202A</li>
        <li>N° TVA : FR22424761419</li>
        <li>Immatriculée au RCS de Roubaix - Tourcoing sous le numéro 42476141900045</li>
      </ul>
      <h2>Nous joindre</h2>
      <p>
        Vous pouvez nous contacter à tout moment à l'adresse mail
        <a
          href="mailto:support@definisher.fr"
        >support@definisher.fr</a>
      </p>
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
h2 {
  margin-top: 1rem;
  padding: 0;
}

.section--help {
  max-width: 40rem;

  p {
    margin: 1rem 0;
  }
}
</style>