require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-mail', async (req, res) => {
  const { magasin, employe, livraisons, chiffre, rendezVous, date } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_DEST,
    subject: `Rapport journalier - ${date} - ${magasin}`,
    text: `
📍 Magasin : ${magasin}
📅 Date : ${date}

👤 Employé : ${employe}
📦 Livraisons : ${livraisons}
💰 Chiffre du jour : ${chiffre} $
📅 Rendez-vous pris : ${rendezVous}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email envoyé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email", error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
