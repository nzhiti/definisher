Cette application dépend des variables d'environnement suivantes :
- API_URL : URL absolue vers la racine de l'API (exemple : http://localhost:9090)
- SELF_URL: URL absolute vers... l'app frontend
- STRIPE_KEY : clé publique Stripe

La méthode de définition de ces variables dépend de la target considérée :
- target "development" : créer un fichier .env.development au même niveau que package.json, y définir chaque variable avec la valeur appropriée, puis démarrer l'image
- target "production" : définir les variables au démarrage de l'image docker (exemple : docker run -e API_URL=http://localhost:9090 frontend)
