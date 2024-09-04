const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('./models/User');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Configurer Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // ou un autre service d'email
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route d'inscription
app.post('/utilisateurs', async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe } = req.body;

    // Validation des champs
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }
    if (mot_de_passe.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const newUser = new User({ nom, prenom, email, mot_de_passe : hashedPassword}); 
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// il faut décripter le mot de passe
// Route de connexion avec logs pour débogage
app.post('/connexion', async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // Validation des champs
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }

    // Logs pour débogage
    console.log('Mot de passe envoyé:', mot_de_passe);
    console.log('Mot de passe stocké (haché):', user.mot_de_passe);

    const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    console.log('Mot de passe valide:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }

    res.status(200).json({ message: 'Connexion réussie' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour demander une réinitialisation de mot de passe
app.post('/motdepasse/oublié', async (req, res) => {
  try {
    const { email } = req.body;

    // Validation de l'email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }

    // Génération du token de réinitialisation en utilisant la méthode du modèle
    const resetToken = user.generateResetToken();
    await user.save();

    // Envoi de l'email
    const resetUrl = `${process.env.FRONTEND_URL}/reinitialiser-mot-de-passe/${resetToken}`;
    await transporter.sendMail({
      to: user.email,
      subject: 'Réinitialisation du mot de passe',
      text: `Vous avez demandé une réinitialisation de mot de passe. Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe : ${resetUrl}`,
    });

    res.status(200).json({ message: 'Email de réinitialisation envoyé.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour réinitialiser le mot de passe
app.post('/motdepasse/reinitialiser/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { mot_de_passe } = req.body;

    // Validation du mot de passe
    if (mot_de_passe.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ error: 'Token de réinitialisation invalide ou expiré' });
    }

    // Hachage du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    user.mot_de_passe = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const dbURI = process.env.USE_ATLAS === 'true'
  ? process.env.MONGODB_URI_ATLAS
  : process.env.MONGODB_URI_LOCAL;

mongoose.connect(dbURI)
  .then(() => console.log('Connected to the database'))
  .catch(error => console.error('Database connection error:', error));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
