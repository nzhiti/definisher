## Pré-requis
Cette image est prévue pour fonctionner avec une base de données PostgreSQL, gérée via l'ORM Sequelize.
Le setup de la base de données est laissée à votre appréciation, néanmoins voici les recommandations.

#### Environnement de développement
Pour un environnement de développement ou de recette n'hésitez pas à utiliser un container
"postgres" que vous pourrez orchestrer avec docker-compose très aisément.

Exemple de configuration :
```
database:
    image: postgres
    restart: always
    ports:
        - '5432:5432'
    volumes:
        - ./postgres-data:/var/lib/postgresql/data
    environment:
        - POSTGRES_DB=definisher
        - POSTGRES_PASSWORD=definisher

api:
    environment:
        - DB_USER=postgres
        - DB_PASS=definisher
        - DB_HOST=database
        - DB_PORT=5432
        - DB_NAME=definisher
```

#### Environnement de production
Pour un environnement de production, il est recommandé d'installer et configurer la base de données
directement sur l'hôte Docker. Le paramètrage est plus complexe mais nécessaire pour garantir la pérenité des données et leur accessibilité à tout instant.

Voici, dans les grandes lignes, ce que vous devriez faire sur votre hôte :
1. Créer la base de données
    - installer postgres (`$ sudo apt install postgresql postgresql-contrib`)
    - créer un utilisateur dédié à la base de données (`postgres$ createuser "definisher"`)
    - choisir le mot de passe de cet utilisateur (`# \password definisher`)
    - créer la base de données (`postgres$ createdb "definisher"`)
    - si vous avez créé un utilisateur spécifique, lui donner les droits (`# grant all privileges on database definisher to definisher;`)
2. Autoriser la connexion à la base de données
    - modifier le fichier `pg_hba.conf` pour autoriser le container à se connecter à la base (`host definisher all 172.18.0.0/16 md5` -> on autorise toutes les connexions IPv4 venant de la plage d'IPs habituellement réservée aux containers Docker à se connecter par identifiant + mot de passe)
    - modifier le fichier `postgresql.conf` et changer la valeur de `listen_adresses` pour écouter les connexions venant de l'IP du container (par défaut, postgres n'écoute que localhost)
3. Démarrer le container en précisant l'adresse IP de l'hôte pour permettre au container d'accéder à la base
    - soit via docker avec l'option "--add-host" (`--add-host=database:<ip-de-l-hote>`)
    - soit via docker-compose avec l'option "extra_hosts" (`extra_hosts: - database:<ip-de-l-hote>`)
    - dans les deux cas, la valeur de la variable DB_HOST (voir plus bas) doit être `database`

En suivant ce protocole, vous devriez obtenir une base de données vide mais fonctionnelle et accessible depuis votre container.
S'agissant d'un environnement de production, il s'agirait également de mettre en place une backup de cette base, mais cela sort totalement du scope de l'utilisation de ce dépôt...


## Utilisation
### Variables d'environnement
Passer les variables d'environnement suivantes au démarrage de l'image :
- HOSTNAME : nom de l'hôte depuis lequel l'API est accessible par le front (exemple : http://localhost)
- PORT : port d'exposition de l'API (exemple : 9090)

- DB_PASS : mot de passe d'accès à la base de données
- DB_HOST : nom de l'hôte d'accès à la base de données (en production, généralement l'IP de l'hôte)
- DB_PORT : port d'accès à la base de données
- DB_NAME : nom de la base de données
- AUTH_SECRET : chaîne secrète servant à signer les tokens Oauth
- FRONT_URL : url absolue vers la racine du frontend (exemple : http://frontend:8080)
- STRAVA_CLIENT_ID : client ID de l'application Strava
- STRAVA_CLIENT_SECRET : client secret de l'application Strava
- STRAVA_TOKEN : chaîne aléatoire servant de clé secrète pour communiquer avec Strava (mettez ce que vous voulez ici)
- MAIL_PUBLIC_KEY : clé public d'accès à Mailjet
- MAIL_PRIVATE_KEY : clé privé d'accès à Mailjet
- STRIPE_API_KEY : clé privée d'accès à l'API Stripe
- STRIPE_WEBHOOK_SECRET : clé privée servant à valider l'authenticité des webhooks Stripe

### Initialisation
Pour initialiser la base de données, sequelize-cli propose deux instructions :
- db:migrate, qui permet de générer la structure de la base en exécutant les migrations l'une après l'autre
- db:seed:all, qui permet d'injecter des données en base. Les données pertinentes à injecter dépendront de votre environnement (certains seed sont nécessaires, d'autres servent de données de recette)

Quoi qu'il en soit, connectez-vous au container, puis exécutez à l'envie l'une des commandes suivantes :
- structure de la base : `$ yarn sequelize db:migrate`
- tous les seeders : `$ yarn sequelize db:seed:all`
- un seeder spécifique : `$ yarn sequelize db:seed --seed ./db/seeders/<nom-du-seeder>.js
