import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css'; // Ou ConnexionParrain.css si séparé

export default function ConnexionParrain() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('connexion'); // 'connexion' ou 'inscription'

  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');

  const handleValidation = () => {
    if (!email || !tel || (mode === 'inscription' && (!prenom || !nom))) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    // Sauvegarde dans localStorage
    const user = { email, tel, prenom, nom };
    localStorage.setItem('parrainActif', JSON.stringify(user));

    navigate('/parrainage');
  };

  return (
    <div className="connexion-parrain-container">
      <h2>{mode === 'connexion' ? 'Connexion Parrainage' : 'Inscription Parrainage'}</h2>

      <input
        placeholder="Adresse email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Numéro de téléphone"
        value={tel}
        onChange={(e) => setTel(e.target.value)}
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
          <>
            Pas encore de compte ?{' '}
            <span className="switch-link" onClick={() => setMode('inscription')}>
              S’inscrire
            </span>
          </>
        ) : (
          <>
            Déjà inscrit ?{' '}
            <span className="switch-link" onClick={() => setMode('connexion')}>
              Se connecter
            </span>
          </>
        )}
      </p>
    </div>
  );
}
