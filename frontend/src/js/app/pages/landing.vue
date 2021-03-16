<template>
  <div>
    <Header></Header>

    <section class="section wrapper">
      <h1 class="section-title section-title--small" id="relevez-le-defi">
        Un nouvel objectif et une nouvelle motivation :
        <br />quand le réel rejoint le virtuel !
      </h1>
      <ul class="linear">
        <li class="linear-item" v-for="(item, id) in items" v-bind:key="id">
          <span class="linear-icon">
            <font-awesome-icon :icon="item.icon"></font-awesome-icon>
          </span>
          <h1 class="linear-title">
            <span>{{ item.title }}</span>
          </h1>
          <p class="linear-description" v-html="item.description"></p>
        </li>
      </ul>
    </section>

    <section class="section section--challenges">
      <div class="wrapper">
        <h1 class="section-title" id="les-defis">Les défis</h1>
        <p class="section-description">
          Ton défi t'attend.
          <br />Choisis ta nouvelle aventure, reste motivé et déterminé vers ton
          prochain objectif !
        </p>

        <section class="challengeGrid">
          <Challenge
            v-for="challenge in $store.getters['settings/visibleChallenges']"
            v-bind:key="challenge.id"
            :challenge="challenge"
          ></Challenge>
        </section>
      </div>
    </section>

    <section class="section section--shop">
        <div class="wrapper">
            <h1 class="section-title" id="boutique">La boutique</h1>
            <p class="section-description">
                Definisher, c'est aussi une boutique ! De nombreux produits seront proposés prochainement.
            </p>

            <section class="challengeGrid">
                <Produit :produit="produit"></Produit>
            </section>
        </div>
    </section>

    <section class="section">
      <div class="wrapper">
        <h1 class="section-title" id="en-savoir-plus">En savoir plus</h1>
        <ul class="faq">
          <li v-for="(question, id) in questions" v-bind:key="id">
            <font-awesome-icon
              class="faq-icon"
              :icon="question.opened ? 'minus-square' : 'plus-square'"
              @click="toggleQuestion(id)"
            ></font-awesome-icon>
            <p>
              <span class="faq-question" @click="toggleQuestion(id)">{{
                question.title
              }}</span>
              <span
                class="faq-answer"
                v-bind:class="{ 'faq-answer--opened': question.opened }"
                v-html="question.content"
              ></span>
            </p>
          </li>
        </ul>
      </div>
    </section>

    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "#app/layout/footer.vue";
import Header from "#app/layout/header.vue";
import Challenge from "#app/components/challenge.vue";
import Produit from "#app/components/produit.vue";

import produitLien from '/img/support_medailles.jpeg';

export default {
  components: {
    Footer,
    Header,
    Challenge,
    Produit,
  },

  data() {
    return {
      produit: {
          image: produitLien,
          nom: 'Support de médailles',
          description: 'Ce support de médaille au design original sera le moyen parfait pour mettre en valeur vos médailles durement gagnées !',
          lien: 'https://djodei.com',
      },
      items: [
        {
          icon: "sync",
          title: "Synchronise Strava",
          description:
            "Connecte ton compte Strava à notre site.<br/>Tu pourras ainsi suivre ta progression en direct sur la carte de ton défi !",
        },
        {
          icon: "running",
          title: "Sors courir",
          description:
            "Ou marcher, randonner, te balader... !<br/>Choisis ta vitesse et fais toi plaisir ! Maintenant, chaque sortie compte.",
        },
        {
          icon: "clock",
          title: "À ton rythme",
          description:
            "Réalise le défi à ton rythme !<br/>Le temps limite étant fixé à 18 mois, chacun peut finir les défis à son niveau !",
        },
        {
          icon: "medal",
          title: "Deviens finisher",
          description:
            "Après de nombreuses heures d'effort, tu deviens finisher de ton défi et remporte une médaille spécialement créée pour chaque défi !",
        },
      ],
      questions: [
        {
          opened: false,
          title: "C'est quoi exactement une « course virtuelle » ?",
          content:
            "Une course virtuelle est une course qui peut se dérouler où tu veux, quand tu veux et à ton rythme. Une course virtuelle peut être complétée autour d'un champ, en bord de mer, même lors d'une autre course compétitive. Où que tu cours, tu peux gagner une médaille !<br/><br/>Avec une course virtuelle chaque kilomètre compte.",
        },
        {
          opened: false,
          title:
            "Quelle est la différence entre une course virtuelle et un défi virtuel ?",
          content:
            "Les courses virtuelles correspondent à un événement daté précis et réalisable en une seule sortie. Tout le monde doit courir le même jour mais tu es bien sûr libre de choisir ton lieu et ton heure de départ.<br/><br/>Les défis virtuels reposent sur le même principe qu’une course virtuelle mais sur des distances beaucoup plus longues. Ils ne seront pas réalisables en une seule sortie. Certains pourront prendre plus d’un an pour être complétés.",
        },
        {
          opened: false,
          title: "Que dois-je faire pour m'inscrire ?",
          content:
            "C'est simple ! Il suffit de choisir un défi en cliquant sur « en savoir plus », confirme ta participation et tu seras redirigé vers notre page boutique.<br/><br/>Une fois que tu as créé ton compte, relie le à Strava. Termine simplement ton défi avant le temps maximum (18 mois) et nous t’enverrons ta médaille !",
        },
        {
          opened: false,
          title: "Dois-je parcourir la distance en une seule fois ?",
          content:
            "Non, pas du tout. Le temps limite est actuellement de 18 mois pour finir ton défi ! Mais tu pourras bien sûr le finir beaucoup plus vite selon le rythme que tu souhaites adopter. Tu peux compléter ton défi en autant de sorties que tu le souhaites !!",
        },
        {
          opened: false,
          title: "Comment télécharger mes preuves ?",
          content:
            "Ton compte Strava est directement connecté à notre base de données, il n’y a donc rien de spécial à faire. Après ta sortie, il suffit de connecter ta montre à ton compte Strava et nous récupérons les informations pour ton défi virtuel (peut prendre quelques minutes). Attention par contre, seules les sorties avec GPS sont prises en compte. Les sorties sur tapis ne compteront donc pas.",
        },
        {
          opened: false,
          title: "Où puis-je vérifier si je suis bien inscrit ?",
          content:
            "Une fois inscrit, tu vas recevoir un email automatisé confirmant ta place, tu pourras vérifier dans quelle course tu es inscrit en cliquant sur ton Espace Membre.",
        },
        {
          opened: false,
          title: "Qui peut participer à une course virtuelle ?",
          content:
            "N'importe qui et tout le monde ! Nous demandons aux participants de moins de 18 ans de parcourir la distance sous surveillance et/ou avec un parent/tuteur (courir ensemble est plus amusant !) Mais à part cela, il n'y a pas de restrictions. Sors et cours, marche ou fais de la randonnée, tout ce qui te convient ! En participant à nos courses virtuelles et défis tu acceptes que toute blessure ou dommage causé par ton activité soit de ta propre responsabilité. Si besoin n’hésite pas à consulter un médecin. Définisher ne sera pas tenu responsable de toute blessure survenant pendant ton activité. Pour plus d’informations tu peux consulter nos Conditions Générales d'Utilisation",
        },
        {
          opened: false,
          title: "Qu'est-ce qui empêche quelqu'un de tricher ?",
          content:
            "Nous avons un certain nombre de façons de détecter les tricheurs mais nous nous rendons bien compte que peu importe ce que nous ferons ou comment nous essayons d’empêcher la triche, les gens seront toujours en mesure d’y arriver si c'est ce qu'ils veulent faire. Par exemple mettre leur montre GPS sur leur chien !<br/><br/>Il n'y a pas de prix pour la première place. Si quelqu'un veut tricher, alors il ne fait que se tromper lui-même et gaspiller son argent.",
        },
        {
          opened: false,
          title: "Depuis quels pays acceptez-vous les inscriptions ?",
          content:
            "Nous accueillons chaleureusement les candidatures du monde entier et nous offrons l'expédition mondiale. (Uniquement pour les défis).",
        },
        {
          opened: false,
          title:
            "Je ne veux pas que ma médaille se perde en chemin, comment faire ?",
          content:
            "Nous prenons en charge la livraison standard des médailles pour les défis peu importe votre situation géographique. Mais si celle-ci se perd, nous ne serons malheureusement pas en mesure d’en renvoyer une.",
        },
        {
          opened: false,
          title: "Quand puis-je m'inscrire à un défi ?",
          content:
            "Sauf indication contraire, tu peux lancer un défi à tout moment et de n'importe où dans le monde (livraison gratuite des médailles incluse pour les défis).<br/><br/>Les inscriptions sont ouvertes maintenant alors n'hésites pas à t’inscrire et à commencer.<br/><br/>Il n’est par contre pas possible d’antidater tes participations. La prise en compte de tes sorties ne commencera que lorsque ton inscription sera validée. ",
        },
        {
          opened: false,
          title: "Puis-je relever plusieurs défis à la fois ?",
          content:
            "Oui ! Il est possible de faire plusieurs défis en même temps mais il ne faut pas qu’ils soient du même type. Par exemple si tu es inscrit à la traversée de la Corse, il n’est pas possible de faire les Pyrénées en même temps car ces 2 défis sont basés sur la distance. Mais il est possible de faire l’ascension du Mont Blanc en même temps car celui ci est basé sur le D+.<br/><br/>Il est également possible de participer en plus au défi « Un ticket pour la Lune » car celui-ci est considéré comme un défi communautaire.",
        },
        {
          opened: false,
          title: "Quels types d'exercices comptent ?",
          content:
            "Tu peux enregistrer la plupart des types d'exercices tels que la course, la marche, la randonnée, le trail, etc...<br/><br/>Les exercices comme le vélo ou la natation ne seront pas pris en compte. Mais ne sois pas déçu, il y aura bientôt des défis spécifiquement pour ces activités !!",
        },
        {
          opened: false,
          title: "Le site va-t-il évoluer ?",
          content:
            "Oui nous prévoyons de nombreuses évolutions pour le site. Aussi bien des fonctionnalités que de nouveaux défis (incluant de nouvelles disciplines). Mais cela demande beaucoup de ressources et de temps.<br/><br/>Tu peux nous contacter via notre mail de contact support@definisher.fr pour nous faire part des fonctionnalités ou des défis que tu aimerais voir sur Définisher.",
        },
        {
          opened: false,
          title: "Combien coûte l’inscription à un défi ?",
          content:
            "Nous avons établi nos tarifs selon un barème bien défini :<br/><br/>Il y a les courses virtuelles qui correspondent à un événement daté et réalisable en une seule sortie.<br/><br/>Le prix est de 10 euros. Les frais de port de la médaille ne sont pas compris.<br/><br/>Ensuite nous avons les défis virtuels, séparés en deux tarifs :<br/><br/>Les défis de moins de 200km, réalisables en 1 semaine à 2 mois par exemple. Le prix est de 20 euros incluant les frais de port de la médaille.<br/><br/>Ensuite il y a les défis de plus de 200km dont certains pourront prendre plus d’un an à être réalisés. Le prix est de 30 euros incluant les frais de port de la médaille.<br/><br/>Pour le prix d’un dossard, tu peux t’inscrire à une aventure inédite et t’assurer de rester motivé sur toutes tes sorties ! Grâce aux défis virtuels, chaque kilomètre compte.",
        },
      ],
    };
  },

  methods: {
    toggleQuestion(id) {
      this.questions[id].opened = !this.questions[id].opened;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "/css/config/colors.scss";

.section--challenges {
  background-color: $gray_light;
}

.section--shop {
    color: $white;
    background-color: $blue_dark;
}
</style>