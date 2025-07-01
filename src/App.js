import React, { useState } from 'react';
import './index.css';
import emailjs from '@emailjs/browser';

const utilisateurs = {
  'laval@optiw.com': { role: 'laval', password: '1234' },
  'rosemere@optiw.com': { role: 'rosemere', password: '1234' },
  'blainville@optiw.com': { role: 'blainville', password: '1234' },
  'labo@optiw.com': { role: 'labo', password: '1234' },
  'admin@optiw.com': { role: 'admin', password: '1234' },
};

const differenceEnJours = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2 - d1;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function App() {
  const [login, setLogin] = useState('');
  const [mdp, setMdp] = useState('');
  const [role, setRole] = useState('');
  const [commande, setCommande] = useState({
    numero: '',
    client: '',
    date: '',
    statut: 'En attente',
    commentaire: '',
    email: '',
  });
  const [commandes, setCommandes] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [editionIndex, setEditionIndex] = useState(null);

  const seConnecter = () => {
    if (utilisateurs[login] && utilisateurs[login].password === mdp) {
      setRole(utilisateurs[login].role);
    } else {
      alert('Identifiants invalides');
    }
  };

  const sendStatusUpdateEmail = (clientEmail, clientName, orderNumber, newStatus) => {
    if (!clientEmail) return;
    emailjs.send('service1234', 'template_5tay4qh', {
      to_email: clientEmail,
      to_name: clientName,
      order_number: orderNumber,
      new_status: newStatus,
    }, 'KpP9SWLy5OcgKnYqn')
    .then(() => {
      console.log('✅ Email envoyé');
    })
    .catch((error) => {
      console.error('❌ Erreur email :', error);
    });
  };

  const ajouterCommande = () => {
    if (!commande.numero || !commande.client || !commande.date) {
      alert("Remplir tous les champs obligatoires.");
      return;
    }

    if (editionIndex !== null) {
      const updated = [...commandes];
      updated[editionIndex] = { ...commande, origine: role };
      setCommandes(updated);
      setEditionIndex(null);
    } else {
      setCommandes([...commandes, { ...commande, origine: role }]);
    }

    setCommande({
      numero: '',
      client: '',
      date: '',
      statut: 'En attente',
      commentaire: '',
      email: '',
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

  const changerStatut = (index, nouveauStatut) => {
    const updated = [...commandes];
    updated[index].statut = nouveauStatut;
    setCommandes(updated);

    const c = updated[index];
    sendStatusUpdateEmail(c.email, c.client, c.numero, nouveauStatut);
  };

  const changerCommentaire = (index, texte) => {
    const updated = [...commandes];
    updated[index].commentaire = texte;
    setCommandes(updated);
  };

  const aujourdHui = new Date();
  const filtrerCommandes = commandes.filter((c) => {
    if (role === 'admin' || role === 'labo') return true;
    return c.origine === role;
  }).filter((c) =>
    c.numero.toLowerCase().includes(recherche.toLowerCase())
  );

  if (!role) {
    return (
      <div className="login-container">
        <h2>Connexion</h2>
        <input placeholder="Email" value={login} onChange={(e) => setLogin(e.target.value)} />
        <input placeholder="Mot de passe" type="password" value={mdp} onChange={(e) => setMdp(e.target.value)} />
        <button onClick={seConnecter}>Se connecter</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h2>Bienvenue ({role})</h2>
      <button onClick={() => setRole('')}>Déconnexion</button>
      <hr />
      <div className="formulaire">
        <input placeholder="Numéro de commande" value={commande.numero} onChange={(e) => setCommande({ ...commande, numero: e.target.value })} />
        <input placeholder="Nom du client" value={commande.client} onChange={(e) => setCommande({ ...commande, client: e.target.value })} />
        <input type="date" value={commande.date} onChange={(e) => setCommande({ ...commande, date: e.target.value })} />
        <input placeholder="Email du client" value={commande.email} onChange={(e) => setCommande({ ...commande, email: e.target.value })} />
        <textarea placeholder="Commentaire" value={commande.commentaire} onChange={(e) => setCommande({ ...commande, commentaire: e.target.value })} rows="2" />
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

      <input placeholder="🔍 Rechercher un numéro" value={recherche} onChange={(e) => setRecherche(e.target.value)} className="search-bar" />

      <table className="commande-table">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Délai</th>
            <th>Commentaire</th>
            <th>Email</th>
            {role === 'labo' && <th>Magasin</th>}
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
                <td>
                  <textarea value={c.commentaire} onChange={(e) => changerCommentaire(i, e.target.value)} rows="2" />
                </td>
                <td>{c.email}</td>
                {role === 'labo' && <td>{c.origine}</td>}
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

