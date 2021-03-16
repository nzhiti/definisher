<template>
  <article class="produit">
    <header class="produit-header">
      <a
        class="produit-thumbnail"
        :href="lien"
      >
        <figure><img :src="image" :alt="nom" /></figure>
      </a>
      <a
        class="produit-title"
        :href="lien"
        ><h1>{{ nom }}</h1></a>
    </header>
    <p class="produit-description">{{ description }}</p>
    <p class="produit-cta">
      <a class="button" :href="lien">Acheter</a>
    </p>
  </article>
</template>

<script>
export default {
  props: {
    produit: {
      type: Object,
      required: true,
    },
  },

  data() {
    return Object.assign({}, this.produit);
  },
};
</script>