import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Composants
import LoginView from './LoginView';
import MainApp from './MainApp';
import Parrainage from './Parrainage';
import ReferenceView from './ReferenceView';
import OuNousTrouver from './OuNousTrouver';
import Tracking from './Tracking';
import ConnexionParrainage from './ConnexionParrainage'; // ✅ Nouveau

// 🔐 Comptes utilisateurs autorisés
const utilisateurs = {
  'laval@optiw.com':      { role: 'magasin', magasin: 'Laval',      password: 'LavalOpti2025!' },
  'rosemere@optiw.com':   { role: 'magasin', magasin: 'Rosemère',   password: 'RoseOpti2025!' },
  'blainville@optiw.com': { role: 'magasin', magasin: 'Blainville', password: 'BlainOpti2025!' },
  'labo@optiw.com':       { role: 'labo',    magasin: 'Tous',       password: 'LaboSecure2025!' },
  'admin@optiw.com':      { role: 'admin',   magasin: 'Tous',       password: 'Admin#2025Opti' },
  'reference@optiw.com':  { role: 'reference', magasin: 'Tous',     password: 'RefOpti2025!' },
};

export default function App() {
  const [login, setLogin] = useState('');
  const [mdp, setMdp] = useState('');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [magasin, setMagasin] = useState(localStorage.getItem('magasin') || '');

  const seConnecter = (navigate) => {
    const utilisateur = utilisateurs[login];
    if (utilisateur && utilisateur.password === mdp) {
      setRole(utilisateur.role);
      setMagasin(utilisateur.magasin);
      localStorage.setItem('role', utilisateur.role);
      localStorage.setItem('magasin', utilisateur.magasin);

      const redirection = utilisateur.role === 'reference' ? '/reference' : '/main';
      navigate(redirection);
    } else {
      alert('Identifiants invalides');
    }
  };

  return (
    <Router>
      <Routes>

        <Route path="/" element={
          <LoginView
            login={login}
            setLogin={setLogin}
            mdp={mdp}
            setMdp={setMdp}
            seConnecter={seConnecter}
          />
        } />

        <Route path="/parrainage" element={<Parrainage />} />

        <Route path="/reference" element={
          <ReferenceView
            setRole={setRole}
            setLogin={setLogin}
            setMdp={setMdp}
          />
        } />

        <Route path="/main" element={
          (role && role !== 'reference') ? (
            <MainApp
              role={role}
              setRole={setRole}
              magasin={magasin}
              setMagasin={setMagasin}
              setLogin={setLogin}
              setMdp={setMdp}
            />
          ) : <Navigate to="/" />
        } />

        <Route path="/ou-nous-trouver" element={<OuNousTrouver />} />
        <Route path="/tracking" element={<Tracking commandes={[]} />} />

        {/* ✅ Nouvelle page : Connexion ou inscription au parrainage */}
        <Route path="/connexion-parrainage" element={<ConnexionParrainage />} />

      </Routes>
    </Router>
  );
}

