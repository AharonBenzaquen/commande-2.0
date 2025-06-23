
import React, { useState } from 'react';
import './index.css';

const utilisateurs = {
  'laval@optiw.com':      { role: 'employe', magasin: 'Laval', password: '1234' },
  'rosemere@optiw.com':   { role: 'employe', magasin: 'Rosemère', password: '1234' },
  'blainville@optiw.com': { role: 'employe', magasin: 'Blainville', password: '1234' },
  'labo@optiw.com':       { role: 'labo', password: '1234' },
  'admin@optiw.com':      { role: 'admin', password: '1234' },
};

function differenceEnJours(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2 - d1;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function App() {
  const [login, setLogin] = useState('');
  const [mdp, setMdp] = useState('');
  const [role, setRole] = useState('');
  const [magasin, setMagasin] = useState('');
  const [adminVueMagasin, setAdminVueMagasin] = useState('Tous');
  const [commande, setCommande] = useState({ numero: '', client: '', date: '', statut: 'En attente', commentaire: '' });
  const [commandes, setCommandes] = useState([
    { numero: 'CMD001', client: 'Client A', date: '2025-06-10', statut: 'En attente', commentaire: 'Urgent', magasin: 'Laval' },
    { numero: 'CMD002', client: 'Client B', date: '2025-06-12', statut: 'Prête', commentaire: 'Ajouter étui', magasin: 'Rosemère' },
    { numero: 'CMD003', client: 'Client C', date: '2025-06-15', statut: 'Livrée au client', commentaire: '', magasin: 'Blainville' }
  ]);
  const [recherche, setRecherche] = useState('');
  const [editionIndex, setEditionIndex] = useState(null);

  const seConnecter = () => {
    const user = utilisateurs[login];
    if (user && user.password === mdp) {
      setRole(user.role);
      setMagasin(user.magasin || '');
    } else {
      alert('Identifiants invalides');
    }
  };

  const aujourdHui = new Date();
  const filtrerCommandes = commandes.filter((c) => {
    const matchRecherche = c.numero.toLowerCase().includes(recherche.toLowerCase());
    if (role === 'employe') return c.magasin === magasin && matchRecherche;
    if (role === 'admin') return (adminVueMagasin === 'Tous' || c.magasin === adminVueMagasin) && matchRecherche;
    return matchRecherche;
  });

  return !role ? (
    <div style={{ padding: 20 }}>
      <h2>Connexion</h2>
      <input placeholder="Email" value={login} onChange={(e) => setLogin(e.target.value)} />
      <input placeholder="Mot de passe" type="password" value={mdp} onChange={(e) => setMdp(e.target.value)} />
      <button onClick={seConnecter}>Se connecter</button>
    </div>
  ) : (
    <div style={{ padding: 20 }}>
      <h2>Bienvenue ({role}{magasin ? ` - ${magasin}` : ''})</h2>
      <button onClick={() => { setRole(''); setLogin(''); setMdp(''); setMagasin(''); }}>Déconnexion</button>
      {role === 'admin' && (
        <div style={{ marginTop: 10 }}>
          <label>Voir commandes de : </label>
          <select value={adminVueMagasin} onChange={(e) => setAdminVueMagasin(e.target.value)}>
            <option value="Tous">Tous</option>
            <option value="Laval">Laval</option>
            <option value="Rosemère">Rosemère</option>
            <option value="Blainville">Blainville</option>
          </select>
        </div>
      )}
      <hr />
      <input placeholder="🔍 Rechercher un numéro" value={recherche} onChange={(e) => setRecherche(e.target.value)} style={{ marginTop: 10 }} />
      <table border="1" cellPadding="6" style={{ marginTop: 10, width: '100%' }}>
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Délai</th>
            <th>Magasin</th>
            <th>Commentaire</th>
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
                <td>{c.statut}</td>
                <td>{jours} jours</td>
                <td>{c.magasin}</td>
                <td>{c.commentaire}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
