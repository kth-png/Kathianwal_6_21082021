# HOT TAKES

## Installation

Avant d'installer les dépendances, exécutez la commande suivante dans votre terminal :

- `cd backend`

1. Installez npm (gestionnaire de paquets Node JS) :

- `npm install`

2. Installez nodemon :

- `npm install -g nodemon`

3. Installez toutes les dépendances présentes dans "package.json" :

- "bcrypt": "^5.0.1", = `npm install --save bcrypt`
- "cors": "^2.8.5", = `npm install --save cors`
- "dotenv": "^10.0.0", = `npm install --save dotenv`
- "express": "^4.17.1", = `npm install --save express`
- "express-mongo-sanitize": "^2.1.0", = `npm install --save express-mongo-sanitize`
- "express-rate-limit": "^5.3.0", = `npm install --save express-rate-limit`
- "helmet": "^4.6.0", = `npm install --save helmet`
- "jsonwebtoken": "^8.5.1", = `npm install --save jsonwebtoken`
- "mongoose": "^5.13.8", = `npm install --save mongoose`
- "mongoose-unique-validator": "^2.0.3", = `npm install --save mongoose-unique-validator`
- "multer": "^1.4.3" = `npm install --save multer`

4. Veuillez créer un fichier '.env' à la racine du dossier (backend), veuillez renseigner les variables suivantes :

MONGO_DB=mongodb+srv://new_user87:Moononthewater87@cluster0.lxpxl.mongodb.net/Cluster0?retryWrites=true&w=majority
TOKEN_SECRET_KEY=RANDOM_TOKEN_SECRET

5. le dossier 'images' ne figure pas dans les dossiers du backend, veuillez le créer (s'il est manquant vous ne pourrez pas télécharger une image si vous voulez créer ou modifer une sauce en cliquant sur 'ADD SAUCE')

## Utilisation

Vous pouvez maintenant lancer : `nodemon server` dans votre terminal

Si le serveur fonctionne le terminal doit afficher :
"Listening on port 3000"

Si vous êtes bien connecté à la base de données le terminal doit afficher :
"Connexion à MongoDB réussie !"

L'application devrait se recharger automatiquement quand vous modifiez un fichier.

Utilsez `Ctrl+C` dans votre terminal pour arrêter nodemon.
