//Importation d'express
const express = require("express");

//Création du routeur
const router = express.Router();

//Importation du controlleur 'user'
const userCtrl = require("../controllers/user");

//Routes utilisateur
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
