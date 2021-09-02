// ********IMPORTATIONS GÉNÉRALES***********
const express = require("express");
const mongoose = require("mongoose");
//accéder au path du serveur
const path = require("path");
const cors = require("cors");

// ***************IMPORTATIONS SÉCURITÉ*************

// Importation du plugin mongo-sanitize pour se protéger des injections SQL
const mongoSanitize = require("express-mongo-sanitize");

// Importation du plugin helmet pour sécuriser les en-têtes HTTP
const helmet = require("helmet");

// Importation de express-rate-limit pour prévenir les attaques par force brute (envoi d'un flux infini de requêtes à une API)
const rateLimit = require("express-rate-limit");

// Limitation du nombre de connexions d'un seul utilisateur (en lien avec rateLimit)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // à 15 minutes
  max: 100, // et chaque adresse IP est limitée à 100 requêtes
});

//**************************CONNEXION MONGODB************************

//variable d'environnement pour récupérer les infos sensibles
require("dotenv").config();

//connexion à la base de données MongoDB
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//const Sauce = require("./models/sauce");

// **************** IMPORATAION DES ROUTEURS *********************
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

// ***************** MIDDLEWARES *********************

//constante permettant d'appeler la fonction express
const app = express();

//transformer le corps de la requête en JSON / objet JS utilisable
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Middelware permettant d'éviter les erreur CORS
app.use(cors());

//middleware permettant d'accepter les requêtes quelque soit leurs origines
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// POUR LA SÉCURITÉ

app.use(mongoSanitize()); // Middleware global pour se protéger des injections SQL
app.use(helmet()); // Middleware pour sécuriser les en-têtes HTTP
app.disable("x-powered-by"); // Désactivation de l’en-tête 'X-Powered-By' pour empêcher les intrus de l'utiliser (en-tête activé par défaut)
app.use(limiter); // Middleware pour prévenir les attaques par force brute

//Gestion de l'enregistrement des images
app.use("/images", express.static(path.join(__dirname, "images")));

//middleware pour les routes 'user' et 'sauce'
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;
