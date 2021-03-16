## Definisher-docker
Ce dépôt fournit la base pour le déploiement de Definisher dans un nouvel environnement. Pour l'instant, ce projet n'est pensé que pour des environnements de développement mais pourra être étendu à un environnement de recette voire de production.

### 🛠 Pré-requis
- docker
- docker-compose

### 📥 Installation
#### Structure
Dans un dossier quelconque, clonez les trois dépôts definisher de façon à obtenir la structure suivante :
```
/dossier-quelconque
    | /api
    | /docker
    | /frontend
```

Si vous ne voulez pas réfléchir :
```
mkdir definisher.fr
git clone git@github.com:Definisher/definisher-frontend.git ./definisher.fr/frontend
git clone git@github.com:Definisher/definisher-api.git ./definisher.fr/api
git clone git@github.com:Definisher/definisher-docker.git ./definisher.fr/docker
```

#### Configuration
Mettez à jour le fichier `docker/docker-compose.yml` de telle façon à ce que les variables d'environnements manquantes soient renseignées. Chaque dépôt détaille dans son propre README les variables attendues, merci de vous y référer pour plus d'informations.

### 🚀 Utilisation
Depuis le dossier `docker`, vous n'avez qu'une seule commande à exécuter pour démarrer l'environnement : `docker-compose up`

#### Premier lancement
Attention, au premier lancement, certains éléments doivent être initialisés pour que l'environnement se déploie correctement. Vous aurez par exemple besoin d'initialiser la structure de la base de données liée au dépôt definisher-api.

Pour ce faire démarrez les containers puis, pour chaque service, suivez les instructions d'initialisation décrites dans leur dépôt respectif.
