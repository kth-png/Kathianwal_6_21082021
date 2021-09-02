const { json } = require("body-parser");

//Importation du modèle 'Sauce'
const Sauce = require("../models/sauce");

// Importation du modèle 'Like'
const Like = require("../models/like");

//importation de file system de Node
const fs = require("fs");

//créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};

//récupération de toutes les sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//récupération d'une sauce spécifique
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//modifier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "sauce mise à jour" }))
    .catch((error) => res.status(400).json({ error }));
};

//suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "sauce supprimée" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//'Liker' ou 'Disliker' une sauce
exports.likeOrDislikeSauce = (req, res, next) => {
  // Définition du statut « Like » pour l'userId fourni
  const likeValue = req.body.like;
  // Récupération de l'userId (un seul utilisateur n'a qu'une seule valeur pour une sauce)
  const userId = req.body.userId;

  // Récupération de l'identifiant de la sauce à liker ou disliker
  Sauce.findOne({ _id: req.params.id })
    // Promesse qui se résout si on trouve la sauce
    .then((sauce) => {
      // Tableaux permettant de stocker le like/dislike d'un utilisateur avec son userId
      let newUsersLiked = sauce.usersLiked;
      let newUsersDisliked = sauce.usersDisliked;
      // Si like = 1, l'utilisateur aime (= like) la sauce
      if (likeValue == 1) {
        // On push l'ID de l'utilisateur qui a liké dans le tableau 'newUsersLiked'
        newUsersLiked.push(userId);
        // Et on incrémente un like
        const newLikes = newUsersLiked.length;
        // Mise à jour du nombre de like de la sauce avec son identifiant
        // (avec le nouveau 'like' de l'userId de l'utilisateur correspondant)
        Sauce.updateOne(
          { _id: req.params.id },
          {
            likes: newLikes,
            usersLiked: newUsersLiked,
          }
        )
          // Si la promesse se résout, un message indique que l'opération s'est bien déroulée
          .then(() =>
            res.status(200).json({ message: "Vous avez likée cette sauce !" })
          )
          // Sinon un message d'erreur s'affiche
          .catch((error) => res.status(400).json({ error }));
      }
      // Si like = 0, l'utilisateur annule son like ou son dislike
      else if (likeValue == 0) {
        // Constante permettant de chercher l'userId du tableau 'newUsersLiked'
        const indexToRemoveFromLikes = newUsersLiked.indexOf(userId);
        // Si l'élément cherché (userId) est présent dans ce tableau
        if (indexToRemoveFromLikes !== -1) {
          // On enlève un like du tableau
          newUsersLiked.splice(indexToRemoveFromLikes, 1);
        }
        // Mise à jour du nouveau tableau (avec le like en moins)
        const newLikes = newUsersLiked.length;
        // Constante permettant de chercher l'userId du tableau 'newUsersDisliked'
        const indexToRemoveFromDislikes = newUsersDisliked.indexOf(userId);
        // Si l'élément cherché (userId) est présent dans ce tableau
        if (indexToRemoveFromDislikes !== -1) {
          // On enlève un dislike du tableau
          newUsersDisliked.splice(indexToRemoveFromDislikes, 1);
        }
        // Mise à jour du nouveau tableau (avec le dislike en moins)
        const newDislikes = newUsersDisliked.length;
        // Mise à jour globale du nombre de like et dislike (dans les tableaux usersLiked et usersDisliked) de la sauce avec son identifiant
        Sauce.updateOne(
          { _id: req.params.id },
          {
            likes: newLikes,
            dislikes: newDislikes,
            usersLiked: newUsersLiked,
            usersDisliked: newUsersDisliked,
          }
        )
          // Si la promesse se résout, un message indique que l'opération s'est bien déroulée
          .then(() => res.status(200).json({ message: "Notation annulée !" }))
          // Sinon un message d'erreur s'affiche
          .catch((error) => res.status(400).json({ error }));
      }
      // Si like = -1, l'utilisateur n'aime pas (= dislike) la sauce
      else if (likeValue == -1) {
        // On push l'ID de l'utilisateur qui a disliké dans le tableau 'newUsersDisliked'
        newUsersDisliked.push(userId);
        // Et on incrémente un dislike
        const newDislikes = newUsersDisliked.length;
        /// Mise à jour du nombre de dislike de la sauce avec son identifiant
        // (avec le nouveau 'dislike' de l'userId de l'utilisateur correspondant)
        Sauce.updateOne(
          { _id: req.params.id },
          {
            dislikes: newDislikes,
            usersDisliked: newUsersDisliked,
          }
        )
          // Si la promesse se résout, un message indique que l'opération s'est bien déroulée
          .then(() =>
            res
              .status(200)
              .json({ message: "Vous avez dislikée cette sauce !" })
          )
          // Sinon un message d'erreur s'affiche
          .catch((error) => res.status(400).json({ error }));
      }
    })
    // Si la sauce est introuvable un message d'erreur s'affiche (404)
    .catch((error) => res.status(400).json({ error }));
};
