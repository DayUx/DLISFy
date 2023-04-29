# PUNTIFY
Cette application est une bibliothèque de titres musicaux qui permet aux utilisateurs de visualiser une liste de titres et de les écouter. Elle est développée en utilisant les technologies suivantes :

- Front-end : React
- Back-end : FastAPI
- Base de données : MongoDB
- Routes de l'application

## Routes de l'application

- /login : Page de connexion
- /register : Page d'inscription
- / : Page d'accueil
- /rechercher : Page de recherche
- /bibliotheque : Page de la bibliothèque de titres
- /likes : Page des titres aimés par l'utilisateur
- /admin : Page d'administration
- /admin/artistes : Page de gestion des artistes
- /admin/musiques : Page de gestion des titres musicaux
- /admin/styles : Page de gestion des styles musicaux
- /admin/albums : Page de gestion des albums

## Routes de l'API

### POST
- "auth/login" pour se connecter
- "auth/register" pour s'inscrire
- "admin/artist" pour créer un nouvel artiste
- "admin/album" pour créer un nouvel album
- "admin/style" pour créer un nouveau style musical
- "admin/song" pour créer un nouveau titre musical
- "music/song/like" pour ajouter un like à un titre musical
### GET
- "admin" pour accéder à l'interface d'administration
- "music/artist/search" pour rechercher des artistes
- "music/song/search" pour rechercher des titres musicaux
- "music/style/search" pour rechercher des styles musicaux
- "music/song/id" pour obtenir un titre musical par son identifiant
- "music/artist/id" pour obtenir un artiste par son identifiant
- "stream/song" pour écouter un titre musical en streaming
- "music/song/artist" pour obtenir les titres musicaux d'un artiste spécifique
- "music/song/style" pour obtenir les titres musicaux d'un style spécifique
- "music/song/album" pour obtenir les titres musicaux d'un album spécifique
- "music/album/search" pour rechercher des albums
- "music/album/id" pour obtenir un album par son identifiant
- "music/album/artist" pour obtenir les albums d'un artiste spécifique
- "music/songid/likes" pour obtenir les identifiants des utilisateurs qui ont aimé un titre musical
- "music/song/likes" pour obtenir le nombre de likes pour chaque titre musical
- "music/user" pour obtenir les informations de l'utilisateur connecté
### PUT
- "admin/album" pour mettre à jour un album
- "admin/style" pour mettre à jour un style musical
- "admin/song" pour mettre à jour un titre musical
- "admin/artist" pour mettre à jour un artiste

# Installation et exécution
Pour exécuter l'application localement, suivez les étapes suivantes :

installer les librairies python
```bash
pip install -r requirements.txt
```
installer MongoDB et lancez le
installer les librairies node
```bash
cd frontend
npm install
```
lancer react
```bash
cd frontend
npm start
```
lancer FastAPI (backend/main.py)


Une fois l'application lancée, inscrivez-vous et connectez-vous pour accéder à l'application.
Pour accéder à l'administration, rajoutez un attribut "admin" avec en valeur true à votre utilisateur dans la base de données.