<template>
  <div>
    <Header></Header>
    <section class="section wrapper">
      <h1 class="section-title section-title--stylish" id="titre">
        <span>Statistiques</span>
      </h1>
      <div v-if="pending" class="section--loading">
        <img src="/img/spinner.gif" alt="Chargement en cours..." />
      </div>
      <div v-else-if="error !== null" class="section--loading">
        <p>{{ error }}</p>
      </div>
      <div v-else>
        <ul class="toggler">
          <li
            class="toggler-item"
            v-bind:class="{ 'toggler-item--active': currentFilter === 'commandes' }"
            @click="setFilter('commandes')"
          >Challenges</li>
          <li
            class="toggler-item"
            v-bind:class="{ 'toggler-item--active': currentFilter === 'codes' }"
            @click="setFilter('codes')"
          >Offres</li>
        </ul>
        <ul v-if="totals.length > 0">
          <li v-for="(total, id) in totals" v-bind:key="id">{{ total.nom }} : {{ total.total }}</li>
        </ul>
        <VueGoodTable
          :columns="columns"
          :rows="rows"
          :search-options="searchOptions"
          :pagination-options="paginationOptions"
          :selectOptions="selectOptions"
        >
          <div slot="emptystate">Aucun élément correspondant à ces critères</div>
        </VueGoodTable>
      </div>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "#app/layout/footer.vue";
import Header from "#app/layout/header.vue";
import { VueGoodTable } from "vue-good-table";

export default {
  components: {
    Header,
    Footer,
    VueGoodTable
  },

  data() {
    return {
      error: null,
      pending: true,
      currentFilter: "commandes"
    };
  },

  computed: {
    sectionData() {
      if (this.currentFilter === "codes") {
        return this.$store.state.statistiques.codes;
      }

      return this.$store.state.statistiques.commandes;
    },

    totals() {
      if (this.currentFilter !== "commandes") {
        return [];
      }

      return [
        {
          nom: "Total de commandes",
          total: this.sectionData.total
        },
        {
          nom: "Total de commandes payantes",
          total: this.sectionData.total_payantes
        }
      ];
    },

    paginationOptions() {
      return {
        enabled: true,
        perPage: 40,
        mode: "pages",
        nextLabel: "Page suivante",
        prevLabel: "Page précédente",
        rowsPerPageLabel: "Nombre de lignes par page :",
        ofLabel: "/",
        pageLabel: "page",
        allLabel: "Tout"
      };
    },

    searchOptions() {
      return {
        enabled: true,
        placeholder: "Taper ici un texte à rechercher"
      };
    },

    selectOptions() {
      return {
        enabled: true,
        selectionText: "lignes sélectionnées",
        clearSelectionText: "Annuler"
      };
    },

    columns() {
      if (this.currentFilter === "commandes") {
        return [
          {
            label: "Nom du challenge",
            field: "nom",
            type: "text"
          },
          {
            label: "Total de commandes payées",
            field: "count",
            type: "number"
          }
        ];
      }

      return [
        {
          label: "Code de réduction",
          field: "code",
          type: "text"
        },
        {
          label: "Stock initial",
          field: "quantite_initiale",
          type: "number"
        },
        {
          label: "Stock restant",
          field: "quantite_restante",
          type: "number"
        }
      ];
    },

    rows() {
      if (this.currentFilter === "codes") {
        return this.sectionData;
      }

      return this.sectionData.par_challenge;
    }
  },

  async mounted() {
    this.pending = true;
    this.error = null;

    try {
      await this.$store.dispatch("statistiques/fetch");
      this.pending = false;
    } catch (error) {
      if (!error.response || !error.response.data.user_message) {
        this.error = "Une erreur inconnue est survenue";
      } else {
        this.error = error.response.data.user_message;
      }

      this.pending = false;
    }
  },

  methods: {
    setFilter(filter) {
      this.currentFilter = filter;
    }
  }
};
</script>

<style lang="scss" scoped>
.toggler {
  margin-bottom: 1rem;
}

.section--loading {
  text-align: center;
}

ul {
  margin: 1.5rem 0;
}
</style>