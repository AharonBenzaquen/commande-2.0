
import React, { useState } from 'react';
import './index.css';

const utilisateurs = {
  'laval@optiw.com': { role: 'laval', password: '1234' },
  'rosemere@optiw.com': { role: 'rosemere', password: '1234' },
  'blainville@optiw.com': { role: 'blainville', password: '1234' },
  'labo@optiw.com': { role: 'labo', password: '1234' },
  'admin@optiw.com': { role: 'admin', password: '1234' }
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
  const [commande, setCommande] = useState({ numero: '', client: '', date: '', statut: 'En attente', commentaire: '', origine: '' });
  const [commandes, setCommandes] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [editionIndex, setEditionIndex] = useState(null);
  const aujourdHui = new Date();

  const seConnecter = () => {
    if (utilisateurs[login] && utilisateurs[login].password === mdp) {
      setRole(utilisateurs[login].role);
    } else {
      alert("Identifiants incorrects");
    }
  };

  const ajouterCommande = () => {
    const nouvelleCommande = {
      ...commande,
      origine: role
    };

    if (editionIndex !== null) {
      const maj = [...commandes];
      maj[editionIndex] = nouvelleCommande;
      setCommandes(maj);
      setEditionIndex(null);
    } else {
      setCommandes([...commandes, nouvelleCommande]);
    }

    setCommande({ numero: '', client: '', date: '', statut: 'En attente', commentaire: '', origine: '' });
  };

  const modifierCommande = (index) => {
    setCommande(commandes[index]);
    setEditionIndex(index);
  };

  const supprimerCommande = (index) => {
    const maj = [...commandes];
    maj.splice(index, 1);
    setCommandes(maj);
  };

  const changerStatut = (index, nouveauStatut) => {
    const maj = [...commandes];
    maj[index].statut = nouveauStatut;
    setCommandes(maj);
  };

  const changerCommentaire = (index, texte) => {
    const maj = [...commandes];
    maj[index].commentaire = texte;
    setCommandes(maj);
  };

  const filtrerCommandes = commandes.filter((c) => {
    if (role === 'admin' || role === 'labo') return c.numero.includes(recherche);
    return c.origine === role && c.numero.includes(recherche);
  });

  if (!role) {
    return (
      <div className="container">
        <header>OPTI-W • Suivi Commandes</header>
        <h2>Connexion</h2>
        <input placeholder="Email" value={login} onChange={(e) => setLogin(e.target.value)} />
        <input type="password" placeholder="Mot de passe" value={mdp} onChange={(e) => setMdp(e.target.value)} />
        <button onClick={seConnecter}>Se connecter</button>
      </div>
    );
  }

  return (
    <div className="container">
      <header>OPTI-W • Suivi Commandes</header>
      <h3>Bienvenue ({role})</h3>
      <button onClick={() => setRole('')}>Déconnexion</button>

      <h4>{editionIndex !== null ? 'Modifier une commande' : 'Ajouter une commande'}</h4>
      <input placeholder="Numéro de commande" value={commande.numero} onChange={(e) => setCommande({ ...commande, numero: e.target.value })} />
      <input placeholder="Nom du client" value={commande.client} onChange={(e) => setCommande({ ...commande, client: e.target.value })} />
      <input type="date" value={commande.date} onChange={(e) => setCommande({ ...commande, date: e.target.value })} />
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

      <input placeholder="🔍 Rechercher par numéro" value={recherche} onChange={(e) => setRecherche(e.target.value)} />

      <table>
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Délai</th>
            <th>Commentaire</th>
            {role === 'labo' || role === 'admin' ? <th>Origine</th> : null}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtrerCommandes.map((c, i) => {
            const jours = differenceEnJours(c.date, aujourdHui);
            const classe = jours >= 14 ? "danger" : jours >= 10 ? "warning" : "";
            return (
              <tr key={i} className={classe}>
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
                <td>
                  <textarea value={c.commentaire} onChange={(e) => changerCommentaire(i, e.target.value)} />
                </td>
                {role === 'labo' || role === 'admin' ? <td>{c.origine}</td> : null}
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
