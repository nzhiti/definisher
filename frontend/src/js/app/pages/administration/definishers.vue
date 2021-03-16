<template>
  <div>
    <Header></Header>
    <section class="section wrapper">
      <h1 class="section-title section-title--stylish" id="titre">
        <span>Suivi des Définishers</span>
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
            v-bind:class="{
              'toggler-item--active': currentFilter === 'notProcessed',
            }"
            @click="setFilter('notProcessed')"
          >
            Défis en cours ({{ totalNotProcessed }})
          </li>
          <li
            class="toggler-item"
            v-bind:class="{
              'toggler-item--active': currentFilter === 'processed',
            }"
            @click="setFilter('processed')"
          >
            Défis traités ({{ totalProcessed }})
          </li>
        </ul>
        <VueGoodTable
          :columns="columns"
          :rows="rows"
          :search-options="searchOptions"
          :pagination-options="paginationOptions"
          :selectOptions="selectOptions"
          :sort-options="sortOptions"
          ref="table"
        >
          <div slot="emptystate">
            Aucun Définisher correspondant à ces critères
          </div>
          <div slot="selected-row-actions">
            <button
              v-if="currentFilter === 'notProcessed'"
              @click="process"
              :disabled="processing.pending"
            >
              <span v-if="!processing.pending">Marquer comme traité</span>
              <img
                v-else
                src="/img/spinner.gif"
                alt="Chargement en cours..."
                style="width: 1em"
              />
            </button>
          </div>
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
    VueGoodTable,
  },

  data() {
    return {
      error: null,
      pending: true,
      currentFilter: "notProcessed",
      processing: {
        pending: false,
      },
    };
  },

  computed: {
    totalNotProcessed() {
      return this.$store.state.commandes.commandes.filter(
        (row) => row.est_traitee !== true
      ).length;
    },
    totalProcessed() {
      return this.$store.state.commandes.commandes.filter(
        (row) => row.est_traitee === true
      ).length;
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
        allLabel: "Tout",
      };
    },

    searchOptions() {
      return {
        enabled: true,
        placeholder: "Taper ici un texte à rechercher",
      };
    },

    selectOptions() {
      return {
        enabled: true,
        selectionText: "lignes sélectionnées",
        clearSelectionText: "Annuler",
      };
    },

    sortOptions() {
      return {
        initialSortBy: {
          field: "pourcentage_de_completion",
          type: "desc",
        },
      };
    },

    columns() {
      return [
        {
          label: "Prénom",
          field: "utilisateur.prenom",
          type: "text",
        },
        {
          label: "Nom",
          field: "utilisateur.nom_de_famille",
          type: "text",
        },
        {
          label: "Email",
          field: "utilisateur.email",
          type: "text",
        },
        {
          label: "Adresse",
          field: "utilisateur.adresse",
          type: "text",
        },
        {
          label: "Challenge",
          field: "challenge.nom",
          type: "text",
        },
        {
          label: "% de complétion",
          field: "pourcentage_de_completion",
          type: "percentage",
        },
        {
          label: "Débuté le",
          field: "commandee_le",
          type: "date",
          dateInputFormat: "yyyy-MM-dd",
          dateOutputFormat: "dd/MM/yyyy",
        },
      ];
    },

    rows() {
      const expectedTraitement =
        this.currentFilter === "processed" ? true : false;
      return this.$store.state.commandes.commandes.filter(
        (row) => row.est_traitee === expectedTraitement
      );
    },
  },

  async mounted() {
    this.pending = true;
    this.error = null;

    try {
      await this.$store.dispatch("commandes/fetch");
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
    },

    async process() {
      if (this.processing.pending) {
        return;
      }

      const unfinished = this.$refs.table.selectedRows.some(
        ({ pourcentage_de_completion }) => {
          return pourcentage_de_completion !== 1;
        }
      );

      if (unfinished) {
        alert(
          "Certaines lignes sélectionnées ne sont pas à 100%, impossible de continuer"
        );
        return;
      }

      try {
        this.processing.pending = true;
        await this.$store.dispatch(
          "commandes/process",
          this.$refs.table.selectedRows.map(({ id }) => id)
        );
        this.processing.pending = false;
      } catch (error) {
        this.processing.pending = false;

        if (
          !error.response ||
          !error.response.data ||
          !error.response.data.user_message
        ) {
          alert("Une erreur inconnue est survenue");
          return;
        }

        alert(error.response.data.user_message);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.toggler {
  margin-bottom: 1rem;
}

.section--loading {
  text-align: center;
}
</style>