<template>
  <footer class="footer section">
    <div class="wrapper">
      <section class="footer-section">
        <h1 class="logo logo--light">
          <router-link to="/"></router-link>
        </h1>
      </section>

      <section class="footer-section">
        <h1 class="footer-title">Produit</h1>
        <ul class="footer-items">
          <li>
            <router-link
              to="/authentification#connexion"
              v-if="$store.state.settings.utilisateur.utilisateur === null"
            >Me connecter</router-link>
            <router-link to="/espace-membre" v-else>Espace membre</router-link>
          </li>
          <li>
            <router-link to="/#les-defis">Les défis</router-link>
          </li>
          <li>
            <router-link to="/#en-savoir-plus">En savoir plus</router-link>
          </li>
        </ul>
      </section>

      <section class="footer-section">
        <h1 class="footer-title">Contact</h1>
        <ul class="footer-items">
          <li>
            <router-link to="/mentions-legales#titre">Mentions légales</router-link>
          </li>
          <li>
            <router-link to="/aide#titre">Aide</router-link>
          </li>
          <li>
            <a :href="cgurl">CGU</a>
          </li>
        </ul>
      </section>

      <section class="footer-section">
        <h1 class="footer-title">Nous suivre</h1>
        <ul class="footer-items">
          <li>
            <a href="https://www.instagram.com/defi_nisher/" title="Instagram">
              <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'instagram' }"></font-awesome-icon>
            </a>
          </li>
          <li>
            <a href="https://discord.gg/FckpTeV" title="Discord">
              <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'discord' }"></font-awesome-icon>
            </a>
          </li>
        </ul>
      </section>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      cgurl: `${Definisher.API_URL}/assets/cgu/conditions_generales_utilisation_definisher_2020_01.pdf`
    };
  }
};
</script>