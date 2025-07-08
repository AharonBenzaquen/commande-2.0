import React from 'react';
import './index.css';

export default function OuNousTrouver() {
  return (
    <div className="location-page">
      <h2 className="location-title">📍 Où nous trouver</h2>

      <div className="store">
        <h3>Opti-W Laval</h3>
        <p>Adresse : 2939 Av. Jacques-Bureau, Laval, QC H7P 6K7</p>
        <p>Téléphone : (450) 978-0888</p>
        <a
          href="https://onlinebookingv2.downloadwink.com/?id=2747&name=Vision%20770&storeid=8"
          target="_blank"
          rel="noopener noreferrer"
          className="appointment-button"
        >
          Prendre rendez-vous
        </a>
        <iframe
          title="Opti-W Laval"
          className="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2794.969446040636!2d-73.76563712325258!3d45.584652227624364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc9237271aafe09%3A0x7aa5a478d13d8a59!2sWalmart%20Supercentre!5e0!3m2!1sfr!2sca!4v1720454400000!5m2!1sfr!2sca"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>

      <div className="store">
        <h3>Opti-W Rosemère</h3>
        <p>Adresse : 401 Boul. Labelle, Rosemère, QC J7A 3T2</p>
        <p>Téléphone : (450) 437-3500</p>
        <a
          href="https://onlinebookingv2.downloadwink.com/?id=2747&name=Vision%20770&storeid=7"
          target="_blank"
          rel="noopener noreferrer"
          className="appointment-button"
        >
          Prendre rendez-vous
        </a>
        <iframe
          title="Opti-W Rosemère"
          className="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2793.119747252253!2d-73.7940700232513!3d45.62686087107981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc918cba5ee5273%3A0xa1fae1348788df7e!2sWalmart%20Supercentre!5e0!3m2!1sfr!2sca!4v1720454500000!5m2!1sfr!2sca"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>

      <div className="store">
        <h3>Opti-W Blainville</h3>
        <p>Adresse : 13300 Boul. Curé-Labelle, Mirabel, QC J7J 1M3</p>
        <p>Téléphone : (450) 430-4404</p>
        <a
          href="https://onlinebookingv2.downloadwink.com/?id=2747&name=Vision%20770&storeid=11"
          target="_blank"
          rel="noopener noreferrer"
          className="appointment-button"
        >
          Prendre rendez-vous
        </a>
        <iframe
          title="Opti-W Blainville"
          className="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2791.964921960666!2d-73.87809332324967!3d45.65259567087324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc9369e9b77db1d%3A0xd26d8b6a3b44cb3a!2sWalmart%20Supercentre!5e0!3m2!1sfr!2sca!4v1720454600000!5m2!1sfr!2sca"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
