const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // Ajout de l'importation de crypto
const SALT_WORK_FACTOR = 10;

// Définition du schéma pour les utilisateurs
const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mot_de_passe: { type: String, required: true },
  resetToken: { type: String }, // Token de réinitialisation
  resetTokenExpiry: { type: Date } // Date d'expiration du token
});

// Hachage du mot de passe avant de sauvegarder l'utilisateur
userSchema.pre('save', function(next) {
  const user = this;

  // Ne hachez le mot de passe que s'il a été modifié (ou est nouveau)
  if (!user.isModified('mot_de_passe')) return next();

  // Générer un salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // Hacher le mot de passe en utilisant le nouveau salt
    bcrypt.hash(user.mot_de_passe, salt, function(err, hash) {
      if (err) return next(err);

      // Remplacer le mot de passe en clair par le mot de passe haché
      user.mot_de_passe = hash;
      next();
    });
  });
});

// Méthode pour comparer les mots de passe lors de la connexion
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.mot_de_passe);
  } catch (err) {
    throw err;
  }
};

// Méthode pour générer un token de réinitialisation
userSchema.methods.generateResetToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetToken = resetToken;
  this.resetTokenExpiry = Date.now() + 3600000; // 1 heure
  return resetToken;
};

// Création et exportation du modèle utilisateur
module.exports = mongoose.model('User', userSchema);
