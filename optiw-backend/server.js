require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration du transporteur Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 📧 Route pour rapport journalier
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

// 📧 Route pour envoi au filleul
app.post('/send-parrainage', async (req, res) => {
  const { email, prenom, codePromo, parrainNom, validationLink } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `🎁 Vous avez été parrainé chez Opti-W !`,
    html: `
      <div style="font-family:Arial,sans-serif; padding:20px; color:#002f5f; background:#f0f4fa; border-radius:10px;">
        <p>Bonjour ${prenom},</p>

        <p>🎉 <strong>Félicitations !</strong> ${parrainNom} vous a parrainé chez <strong>Opti-W</strong>.</p>

        <p>
          Voici votre code promo valable <strong>30 jours</strong> à utiliser en boutique :
        </p>

        <div style="font-size:20px; font-weight:bold; background:#f4c51c; padding:10px 15px; border-radius:6px; display:inline-block; margin:10px 0;">
          ${codePromo}
        </div>

        <p>
          Présentez-le lors de votre visite et bénéficiez d’un <strong>avantage exclusif</strong>.
        </p>

        <p>
          ✅ <strong>Important :</strong> cliquez sur le lien ci-dessous pour <strong>activer votre code promo et celui de votre ami</strong>.
        </p>

        <p style="margin: 15px 0;">
          👉 <a href="${validationLink}" style="color:#002f5f; text-decoration:none;">Activer mon code promo</a><br>
          <span style="font-size:12px; color:#555;">(ou copiez ce lien dans votre navigateur : ${validationLink})</span>
        </p>

        <p>À bientôt chez <strong>Opti-W</strong> !</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email de parrainage envoyé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email de parrainage", error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
