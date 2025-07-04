import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './index.css';
import Parrainage from './Parrainage';
import ReferenceView from './ReferenceView';

const utilisateurs = {
  'laval@optiw.com': { role: 'magasin', magasin: 'Laval', password: '1234' },
  'rosemere@optiw.com': { role: 'magasin', magasin: 'Rosemère', password: '1234' },
  'blainville@optiw.com': { role: 'magasin', magasin: 'Blainville', password: '1234' },
  'labo@optiw.com': { role: 'labo', magasin: 'Tous', password: '1234' },
  'admin@optiw.com': { role: 'admin', magasin: 'Tous', password: '1234' },
  'reference@optiw.com': { role: 'reference', magasin: 'Tous', password: '1234' },
};

function differenceEnJours(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2 - d1;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function MainApp({ setRole, setLogin, setMdp, role, magasin, setMagasin }) {
  const [commande, setCommande] = useState({ numero: '', client: '', date: '', statut: 'En attente', commentaire: '' });
  const [commandes, setCommandes] = useState(() => JSON.parse(localStorage.getItem('commandes')) || []);
  const [editionIndex, setEditionIndex] = useState(null);
  const [formActif, setFormActif] = useState(false);
  const aujourdHui = new Date();

  useEffect(() => {
    localStorage.setItem('commandes', JSON.stringify(commandes));
  }, [commandes]);

  const filtrerCommandes = commandes.filter((c) =>
    role === 'admin' || role === 'labo' || c.origine === magasin
  );

  const ajouterCommande = () => {
    const updated = [...commandes];
    if (editionIndex !== null) {
      updated[editionIndex] = { ...commande, origine: magasin };
      setEditionIndex(null);
    } else {
      updated.push({ ...commande, origine: magasin });
    }
    setCommandes(updated);
    setCommande({ numero: '', client: '', date: '', statut: 'En attente', commentaire: '' });
    setFormActif(false);
  };

  const modifierCommande = (index) => {
    setCommande(commandes[index]);
    setEditionIndex(index);
    setFormActif(true);
  };

  const supprimerCommande = (index) => {
    const updated = [...commandes];
    updated.splice(index, 1);
    setCommandes(updated);
  };

  const changerStatut = (index, nouveauStatut) => {
    const updated = [...commandes];
    updated[index].statut = nouveauStatut;
    setCommandes(updated);
  };

  const changerCommentaire = (index, texte) => {
    const updated = [...commandes];
    updated[index].commentaire = texte;
    setCommandes(updated);
  };

  const handleLogout = () => {
    setRole('');
    setLogin('');
    setMdp('');
    setMagasin('');
    // ❗ Ne supprime que les infos de session (et pas commandes, parrainages)
    localStorage.removeItem('login');
    localStorage.removeItem('role');
    localStorage.removeItem('magasin');
  };

  return (
    <div className="app">
      <h2 className="header">Bienvenue {role === 'magasin' ? magasin : role}</h2>
      <button onClick={handleLogout}>Déconnexion</button>
      <hr />
      <button onClick={() => {
        setFormActif(true);
        setCommande({ numero: '', client: '', date: '', statut: 'En attente', commentaire: '' });
        setEditionIndex(null);
      }}>
        ➕ Nouvelle commande
      </button>

      <div className="formulaire">
        <input disabled={!formActif} placeholder="Numéro de commande" value={commande.numero} onChange={(e) => setCommande({ ...commande, numero: e.target.value })} />
        <input disabled={!formActif} placeholder="Nom du client" value={commande.client} onChange={(e) => setCommande({ ...commande, client: e.target.value })} />
        <input disabled={!formActif} type="date" value={commande.date} onChange={(e) => setCommande({ ...commande, date: e.target.value })} />
        <textarea disabled={!formActif} placeholder="Commentaire" value={commande.commentaire} onChange={(e) => setCommande({ ...commande, commentaire: e.target.value })} />
        <select disabled={!formActif} value={commande.statut} onChange={(e) => setCommande({ ...commande, statut: e.target.value })}>
          <option>En attente</option>
          <option>Reçue au labo</option>
          <option>En production</option>
          <option>Prête</option>
          <option>Expédiée</option>
          <option>Reçue au magasin</option>
          <option>Livrée au client</option>
        </select>
        {formActif && (
          <button onClick={ajouterCommande}>
            {editionIndex !== null ? '✅ Modifier' : '📦 Ajouter'}
          </button>
        )}
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Délai</th>
            <th>Commentaire</th>
            <th>Origine</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtrerCommandes.map((c, i) => {
            const jours = differenceEnJours(c.date, aujourdHui);
            const style = jours >= 14 ? { backgroundColor: '#ffcccc' } : jours >= 10 ? { backgroundColor: '#fff3cd' } : {};
            return (
              <tr key={i} style={style}>
                <td>{c.numero}</td>
                <td>{c.client}</td>
                <td>{c.date}</td>
                <td>
                  <select value={c.statut} onChange={(e) => changerStatut(i, e.target.value)}>
                    <option>En attente</option>
                    <option>Reçue au labo</option>
                    <option>En production</option>
                    <option>Prête</option>
                    <option>Expédiée</option>
                    <option>Reçue au magasin</option>
                    <option>Livrée au client</option>
                  </select>
                </td>
                <td>{jours} jours</td>
                <td><textarea value={c.commentaire} onChange={(e) => changerCommentaire(i, e.target.value)} /></td>
                <td>{c.origine}</td>
                <td>
                  <button onClick={() => modifierCommande(i)}>✏️</button>
                  <button onClick={() => supprimerCommande(i)}>🗑️</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Login({ login, setLogin, mdp, setMdp, seConnecter }) {
  const navigate = useNavigate();
  const [tracking, setTracking] = useState('');
  const [commandeTrouvee, setCommandeTrouvee] = useState(null);

  const rechercherTracking = () => {
    const toutes = JSON.parse(localStorage.getItem('commandes')) || [];
    const trouvée = toutes.find(c => c.numero === tracking);
    setCommandeTrouvee(trouvée || null);
  };

  return (
    <div className="app">
      <div className="login-container">
        <input className="input-field" placeholder="Email" value={login} onChange={(e) => setLogin(e.target.value)} />
        <input className="input-field" placeholder="Mot de passe" type="password" value={mdp} onChange={(e) => setMdp(e.target.value)} />
        <button className="login-button" onClick={seConnecter}>Connexion</button>
      </div>

      <div className="tracking-box">
        <h3>Suivi de commande</h3>
        <input placeholder="Numéro de commande" value={tracking} onChange={(e) => setTracking(e.target.value)} />
        <button onClick={rechercherTracking}>🔍 Rechercher</button>
        {commandeTrouvee ? (
          <div className="result">
            <p><strong>Commande :</strong> {commandeTrouvee.numero}</p>
            <p><strong>Statut :</strong> {commandeTrouvee.statut}</p>
            <p><strong>Commentaire :</strong> {commandeTrouvee.commentaire}</p>
          </div>
        ) : tracking && <p>Aucune commande trouvée.</p>}
      </div>

      <div className="promotions">
        <div className="promotion-images">
          <img src="promo1.jpg" alt="Promotion 1" />
          <img src="promo2.jpg" alt="Promotion 2" />
        </div>
        <button className="referral-button" onClick={() => navigate('/parrainage')}>👥 Parrainer un ami</button>
      </div>
    </div>
  );
}

export default function App() {
  const [login, setLogin] = useState(localStorage.getItem('login') || '');
  const [mdp, setMdp] = useState('');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [magasin, setMagasin] = useState(localStorage.getItem('magasin') || '');

  const seConnecter = () => {
    if (utilisateurs[login] && utilisateurs[login].password === mdp) {
      const user = utilisateurs[login];
      setRole(user.role);
      setMagasin(user.magasin);
      localStorage.setItem('login', login);
      localStorage.setItem('role', user.role);
      localStorage.setItem('magasin', user.magasin);
    } else {
      alert('Identifiants invalides');
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          role === 'reference' ? (
            <Navigate to="/reference" replace />
          ) : role ? (
            <MainApp
              role={role}
              setRole={setRole}
              magasin={magasin}
              setMagasin={setMagasin}
              setLogin={setLogin}
              setMdp={setMdp}
            />
          ) : (
            <Login
              login={login}
              setLogin={setLogin}
              mdp={mdp}
              setMdp={setMdp}
              seConnecter={seConnecter}
            />
          )
        } />
        <Route path="/parrainage" element={<Parrainage />} />
        <Route path="/reference" element={
          <ReferenceView
            setRole={setRole}
            setLogin={setLogin}
            setMdp={setMdp}
          />
        } />
      </Routes>
    </Router>
  );
}
