//Importation d'Express
const express = require("express");

//Création du routeur
const router = express.Router();

//Importation du middleware d'authentification
const auth = require("../middleware/auth");

//Importation du middleware de config de multer
const multer = require("../middleware/multer-config");

//Importation du controlleur 'sauce'
const sauceCtrl = require("../controllers/sauce");

/******************************** ROUTES DES SAUCES ************************************* */
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeOrDislikeSauce);

//Exportation
module.exports = router;
