module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert(
            'challenges',
            [
                {
                    nom: 'Un ticket pour la Lune',
                    slug: 'un-ticket-pour-la-lune',
                    description: 'Rejoindre la Lune depuis la Terre en courant, le voyage d\'une vie !',
                    catch: 'Défiez l\'impossible',
                    description_titre: 'Un challenge inédit !',
                    description_contenu: `Saurez-vous relever le défi des
                    <strong>384 400km</strong> qui séparent la Terre de la Lune ?
                    <br />
                    <br />Un challenge par équipe et contre la montre : tous les Definishers inscrits à ce challenge ont
                    <strong>jusqu'à la fin de cette année</strong> pour compléter, ensemble, cette distance folle !`,
                    medaille_titre: 'Une médaille unique',
                    medaille_contenu: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi hendrerit libero sed nibh eleifend semper.',
                    prix: 39,
                    fk_theme: 'dark',
                    quantite: null,
                    distance: 384400,
                    denivele: null,
                    date_fin: new Date(2020, 11, 31),
                    visible: true,
                },
                {
                    nom: 'La traversée de la Corse',
                    slug: 'la-traversee-de-la-corse',
                    description: 'Considérée comme une des randonnées les plus dures au Monde, le Gr20 vous attend.',
                    catch: 'Lorem ipsum',
                    description_titre: 'Lorem ipsum dolor',
                    description_contenu: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer bibendum nulla vel eros sodales tempus. Donec ipsum tortor, efficitur non nibh et, imperdiet rutrum est. In eleifend accumsan varius. Maecenas sed feugiat erat.`,
                    medaille_titre: 'Lorem ipsum dolor',
                    medaille_contenu: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi hendrerit libero sed nibh eleifend semper.',
                    prix: 39,
                    fk_theme: 'light',
                    quantite: 100,
                    distance: 177,
                    denivele: 11815,
                    date_fin: null,
                    visible: true,
                },
                {
                    nom: 'La traversée des Pyrénées',
                    slug: 'la-traversee-des-pyrenees',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    catch: 'Lorem ipsum',
                    description_titre: 'Lorem ipsum dolor',
                    description_contenu: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer bibendum nulla vel eros sodales tempus. Donec ipsum tortor, efficitur non nibh et, imperdiet rutrum est. In eleifend accumsan varius. Maecenas sed feugiat erat.`,
                    medaille_titre: 'Lorem ipsum dolor',
                    medaille_contenu: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi hendrerit libero sed nibh eleifend semper.',
                    prix: 39,
                    fk_theme: 'dark',
                    quantite: 100,
                    distance: 188,
                    denivele: 9200,
                    date_fin: null,
                    visible: true,
                },
                {
                    nom: 'L\'ascension du Mont Blanc',
                    slug: 'l-ascension-du-mont-blanc',
                    description: '4.800m de dénivelé positif pour atteindre le sommet du Mont Blanc.',
                    catch: 'Lorem ipsum',
                    description_titre: 'Lorem ipsum dolor',
                    description_contenu: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer bibendum nulla vel eros sodales tempus. Donec ipsum tortor, efficitur non nibh et, imperdiet rutrum est. In eleifend accumsan varius. Maecenas sed feugiat erat.`,
                    medaille_titre: 'Lorem ipsum dolor',
                    medaille_contenu: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi hendrerit libero sed nibh eleifend semper.',
                    prix: 39,
                    fk_theme: 'dark',
                    quantite: 100,
                    distance: null,
                    denivele: 4696,
                    date_fin: null,
                    visible: true,
                },
            ],
        );
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('challenges');
    },
};
