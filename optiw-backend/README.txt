Instructions pour lancer le backend Opti-W :

1. Renomme le fichier ".env.example" en ".env"
2. Dans le fichier .env, remplis :
   - EMAIL_USER : ton adresse Gmail
   - EMAIL_PASS : ton mot de passe (ou mot de passe d'application)
   - EMAIL_DEST : adresse qui doit recevoir le rapport
3. Ouvre un terminal dans ce dossier et tape :
   npm install
   puis :
   npm start

Le serveur démarrera sur le port 3001 et écoutera les requêtes POST sur /send-mail
