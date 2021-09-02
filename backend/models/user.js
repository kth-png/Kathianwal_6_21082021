//Importation de mongoose
const mongoose = require("mongoose");

//Importation du plugin unique validator
const uniqueValidator = require("mongoose-unique-validator");

//Création d'un schéma de données pour la création d'un utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
