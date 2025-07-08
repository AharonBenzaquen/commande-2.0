import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css'; // Ou fichier séparé si tu préfères

export default function ConnexionParrain() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('connexion'); // 'connexion' ou 'inscription'

  const [identifiant, setIdentifiant] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');

  const handleValidation = () => {
    if (!identifiant || !motdepasse) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const userKey = `parrain_${identifiant}`;
    const existing = JSON.parse(localStorage.getItem(userKey));

    if (mode === 'connexion') {
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
      if (existing) {
        alert("Ce compte existe déjà.");
        return;
      }
      if (!prenom || !nom) {
        alert("Veuillez indiquer votre nom complet.");
        return;
      }

      const newUser = { identifiant, motdepasse, prenom, nom };
      localStorage.setItem(userKey, JSON.stringify(newUser));
      localStorage.setItem('parrainActif', JSON.stringify(newUser));
      navigate('/parrainage');
    }
  };

  return (
    <div className="connexion-parrain-container">
      <h2>{mode === 'connexion' ? 'Connexion Parrain' : 'Inscription Parrain'}</h2>

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

      {mode === 'inscription' && (
        <>
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

      <button onClick={handleValidation}>
        {mode === 'connexion' ? 'Se connecter' : 'Créer mon compte'}
      </button>

      <p style={{ marginTop: '20px' }}>
        {mode === 'connexion' ? (
          <>Pas encore de compte ?{' '}
            <span className="switch-link" onClick={() => setMode('inscription')}>S’inscrire</span>
          </>
        ) : (
          <>Déjà inscrit ?{' '}
            <span className="switch-link" onClick={() => setMode('connexion')}>Se connecter</span>
          </>
        )}
      </p>
    </div>
  );
}
