import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import './index.css';

const utilisateurs = {
  'employe@optiw.com': { role: 'employe', magasin: 'Opti-W' },
  'labo@optiw.com': { role: 'labo', magasin: 'labo' },
  'admin@optiw.com': { role: 'admin', magasin: 'admin' },
  'laval@optiw.com': { role: 'magasin', magasin: 'Laval' },
  'rosemere@optiw.com': { role: 'magasin', magasin: 'Rosemère' },
  'blainville@optiw.com': { role: 'magasin', magasin: 'Blainville' },
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
    const utilisateur = utilisateurs[login];
    if (utilisateur) {
      setRole(utilisateur.role);
      setMagasin(utilisateur.magasin);
    } else {
      alert('Identifiants invalides');
    }
  };

  const envoyerEmail = (email, nom, numero, statut) => {
    console.log('✅ Envoi email à :', email);
    console.log('📦 Données envoyées :', { nom, numero, statut });

    emailjs
      .send(
        'service1234',
        'template_5tay4qh',
        {
          to_email: email,
          to_name: nom,
          order_number: numero,
          new_status: statut,
        },
        'KpP9SWLy5OcgKnYqn'
      )
      .then(() => {
        console.log('✅ Email envoyé avec succès');
      })
      .catch((error) => {
        console.error('❌ Erreur EmailJS :', error);
      });
  };

  const ajouterCommande = () => {
    if (editionIndex !== null) {
      const updated = [...commandes];
      updated[editionIndex] = commande;
      setCommandes(updated);
      setEditionIndex(null);
    } else {
      const nouvelleCommande = { ...commande, origine: magasin };
      setCommandes([...commandes, nouvelleCommande]);
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
    if (c.email) {
      envoyerEmail(c.email, c.client, c.numero, nouveauStatut);
    }
  };

  const changerCommentaire = (index, texte) => {
    const updated = [...commandes];
    updated[index].commentaire = texte;
    setCommandes(updated);
  };

  const aujourdHui = new Date();
  const filtrerCommandes = commandes.filter((c) => {
    if (role === 'magasin') return c.origine === magasin;
    return true;
  }).filter((c) =>
    c.numero.toLowerCase().includes(recherche.toLowerCase())
  );

  if (!role) {
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
      <h2>Bienvenue ({role} {magasin !== 'admin' && magasin !== 'labo' ? ` - ${magasin}` : ''})</h2>
      <button onClick={() => { setRole(''); setLogin(''); setMdp(''); }}>Déconnexion</button>
      <hr />
      <div>
        <input placeholder="Numéro de commande" value={commande.numero} onChange={(e) => setCommande({ ...commande, numero: e.target.value })} />
        <input placeholder="Nom du client" value={commande.client} onChange={(e) => setCommande({ ...commande, client: e.target.value })} />
        <input type="date" value={commande.date} onChange={(e) => setCommande({ ...commande, date: e.target.value })} />
        <input placeholder="Email client" value={commande.email} onChange={(e) => setCommande({ ...commande, email: e.target.value })} />
        <textarea placeholder="Commentaire" value={commande.commentaire} onChange={(e) => setCommande({ ...commande, commentaire: e.target.value })} rows="2" style={{ width: '100%' }} />
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
            {role === 'labo' || role === 'admin' ? <th>Origine</th> : null}
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
                  <textarea value={c.commentaire} onChange={(e) => changerCommentaire(i, e.target.value)} rows="2" style={{ width: '100%' }} />
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

