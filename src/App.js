import React, { useState } from 'react';
import './index.css';

const utilisateurs = {
  'laval@optiw.com': { role: 'magasin', magasin: 'Laval', password: '1234' },
  'rosemere@optiw.com': { role: 'magasin', magasin: 'Rosemère', password: '1234' },
  'blainville@optiw.com': { role: 'magasin', magasin: 'Blainville', password: '1234' },
  'labo@optiw.com': { role: 'labo', password: '1234' },
  'admin@optiw.com': { role: 'admin', password: '1234' },
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
  const [utilisateur, setUtilisateur] = useState(null);
  const [commande, setCommande] = useState({
    numero: '',
    client: '',
    date: '',
    statut: 'En attente',
    commentaire: '',
    tracking: '',
  });
  const [commandes, setCommandes] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [editionIndex, setEditionIndex] = useState(null);
  const [trackingRecherche, setTrackingRecherche] = useState('');
  const [resultatTracking, setResultatTracking] = useState(null);

  const aujourdHui = new Date();

  const seConnecter = () => {
    if (utilisateurs[login] && utilisateurs[login].password === mdp) {
      const infos = utilisateurs[login];
      setUtilisateur({ ...infos, email: login });
    } else {
      alert('Identifiants invalides');
    }
  };

  const ajouterCommande = () => {
    const nouvelleCommande = {
      ...commande,
      origine: utilisateur.magasin || null,
    };

    if (editionIndex !== null) {
      const updated = [...commandes];
      updated[editionIndex] = nouvelleCommande;
      setCommandes(updated);
      setEditionIndex(null);
    } else {
      setCommandes([...commandes, nouvelleCommande]);
    }

    setCommande({
      numero: '',
      client: '',
      date: '',
      statut: 'En attente',
      commentaire: '',
      tracking: '',
    });
  };

  const modifierCommande = (index) => {
    setCommande(commandes[index]);
    setEditionIndex(index);
  };

  const supprimerCommande = (index) => {
    const updated = [...commandes];
    updated.splice(index, 1);
    setCommandes(updated);
  };

  const changerChamp = (index, champ, valeur) => {
    const updated = [...commandes];
    updated[index][champ] = valeur;
    setCommandes(updated);
  };

  const filtrerCommandes = commandes.filter((c) => {
    if (utilisateur.role === 'labo') return true;
    if (utilisateur.role === 'admin') return true;
    return c.origine === utilisateur.magasin;
  }).filter(c => c.numero.toLowerCase().includes(recherche.toLowerCase()));

  const rechercherTracking = () => {
    const found = commandes.find((c) => c.tracking === trackingRecherche);
    setResultatTracking(found || null);
  };

  if (!utilisateur) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Connexion</h2>
        <input placeholder="Email" value={login} onChange={(e) => setLogin(e.target.value)} />
        <input placeholder="Mot de passe" type="password" value={mdp} onChange={(e) => setMdp(e.target.value)} />
        <button onClick={seConnecter}>Se connecter</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Bienvenue {utilisateur.email} ({utilisateur.role})</h2>
      <button onClick={() => setUtilisateur(null)}>Déconnexion</button>

      <hr />

      <div>
        <input placeholder="Numéro de commande" value={commande.numero} onChange={(e) => setCommande({ ...commande, numero: e.target.value })} />
        <input placeholder="Nom du client" value={commande.client} onChange={(e) => setCommande({ ...commande, client: e.target.value })} />
        <input type="date" value={commande.date} onChange={(e) => setCommande({ ...commande, date: e.target.value })} />
        <input placeholder="Tracking client" value={commande.tracking} onChange={(e) => setCommande({ ...commande, tracking: e.target.value })} />
        <textarea placeholder="Commentaire" value={commande.commentaire} onChange={(e) => setCommande({ ...commande, commentaire: e.target.value })} />
        <select value={commande.statut} onChange={(e) => setCommande({ ...commande, statut: e.target.value })}>
          <option>En attente</option>
          <option>Reçue au labo</option>
          <option>En production</option>
          <option>Prête</option>
          <option>Expédiée</option>
          <option>Reçue au magasin</option>
          <option>Livrée au client</option>
        </select>
        <button onClick={ajouterCommande}>{editionIndex !== null ? 'Modifier' : 'Ajouter'}</button>
      </div>

      <input placeholder="🔍 Rechercher un numéro" value={recherche} onChange={(e) => setRecherche(e.target.value)} style={{ marginTop: 10 }} />

      <table border="1" cellPadding="6" style={{ marginTop: 10, width: '100%' }}>
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Délai</th>
            <th>Commentaire</th>
            <th>Tracking</th>
            {utilisateur.role === 'labo' && <th>Origine</th>}
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
                  <select value={c.statut} onChange={(e) => changerChamp(i, 'statut', e.target.value)}>
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
                <td>
                  <textarea value={c.commentaire} onChange={(e) => changerChamp(i, 'commentaire', e.target.value)} />
                </td>
                <td>{c.tracking}</td>
                {utilisateur.role === 'labo' && <td>{c.origine}</td>}
                <td>
                  <button onClick={() => modifierCommande(i)}>✏️</button>
                  <button onClick={() => supprimerCommande(i)}>🗑️</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <hr />
      <h3>📦 Suivi de commande client</h3>
      <input placeholder="Code de suivi" value={trackingRecherche} onChange={(e) => setTrackingRecherche(e.target.value)} />
      <button onClick={rechercherTracking}>Rechercher</button>
      {resultatTracking && (
        <div style={{ marginTop: 10 }}>
          <strong>Commande trouvée :</strong><br />
          Numéro : {resultatTracking.numero}<br />
          Client : {resultatTracking.client}<br />
          Statut : {resultatTracking.statut}<br />
          Commentaire : {resultatTracking.commentaire}
        </div>
      )}
      {resultatTracking === null && trackingRecherche && (
        <p style={{ color: 'red' }}>Aucune commande trouvée avec ce code.</p>
      )}
    </div>
  );
}

