// 📁 ConnexionParrainage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

export default function ConnexionParrainage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('connexion');

  const [identifiant, setIdentifiant] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');

  const handleValidation = () => {
    if (mode === 'connexion') {
      if (!identifiant || !motdepasse) {
        alert('Veuillez remplir tous les champs.');
        return;
      }

      const userKey = `parrain_${identifiant}`;
      const existing = JSON.parse(localStorage.getItem(userKey));

      if (!existing) {
        alert("Ce compte n'existe pas.");
        return;
      }
      if (existing.motdepasse !== motdepasse) {
        alert("Mot de passe incorrect.");
        return;
      }

      localStorage.setItem('parrainActif', JSON.stringify(existing));
      navigate('/parrainage');

    } else {
      if (!email || !telephone || !motdepasse || !prenom || !nom) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
      }

      const userKey = `parrain_${email}`;
      const userKeyTel = `parrain_${telephone}`;
      const alreadyEmail = localStorage.getItem(userKey);
      const alreadyTel = localStorage.getItem(userKeyTel);

      if (alreadyEmail || alreadyTel) {
        alert('Un compte avec cet email ou ce téléphone existe déjà.');
        return;
      }

      const newUser = {
        email,
        telephone,
        motdepasse,
        prenom,
        nom,
        nbParrainages: 0,
        montantTotal: 0,
      };

      localStorage.setItem(`parrain_${email}`, JSON.stringify(newUser));
      localStorage.setItem(`parrain_${telephone}`, JSON.stringify(newUser));
      localStorage.setItem('parrainActif', JSON.stringify(newUser));

      navigate('/parrainage');
    }
  };

  return (
    <div className="connexion-parrain-container">
      <h2>{mode === 'connexion' ? 'Connexion Parrain' : 'Inscription Parrain'}</h2>

      {mode === 'connexion' ? (
        <>
          <input
            placeholder="Email ou téléphone"
            value={identifiant}
            onChange={(e) => setIdentifiant(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={motdepasse}
            onChange={(e) => setMotdepasse(e.target.value)}
          />
        </>
      ) : (
        <>
          <input
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Numéro de téléphone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={motdepasse}
            onChange={(e) => setMotdepasse(e.target.value)}
          />
          <input
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
          <input
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </>
      )}

      <button className="login-button" onClick={handleValidation}>
        {mode === 'connexion' ? 'Se connecter' : 'Créer mon compte'}
      </button>

      <p style={{ marginTop: '20px' }}>
        {mode === 'connexion' ? (
          <>Pas encore de compte ?{' '}
            <span className="switch-link" onClick={() => setMode('inscription')}>
              S’inscrire
            </span>
          </>
        ) : (
          <>Déjà inscrit ?{' '}
            <span className="switch-link" onClick={() => setMode('connexion')}>
              Se connecter
            </span>
          </>
        )}
      </p>
    </div>
  );
}
