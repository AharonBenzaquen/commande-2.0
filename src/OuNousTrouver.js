import React from 'react';
import './index.css';

export default function OuNousTrouver() {
  return (
    <div className="location-page">
      <h2 className="location-title">📍 Où nous trouver</h2>

      <div className="store-list">
        {/* ⬅️ LAVAL */}
        <div className="store-card">
          <div className="store-info">
            <h3>Opti-W Laval</h3>
            <p>📍 2939 Av. Jacques-Bureau, Laval, QC H7P 6K7</p>
            <p>📞 (450) 978-0888</p>
            <a
              href="https://onlinebookingv2.downloadwink.com/?id=2747&name=Vision%20770&storeid=8"
              target="_blank"
              rel="noopener noreferrer"
              className="appointment-button-inline"
            >
              Prendre rendez-vous
            </a>
          </div>
          <iframe
            title="Opti-W Laval"
            className="store-map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5587.040541631336!2d-73.75526372379899!3d45.55997522704329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc923b8d2021d6b%3A0xe3322ddc754869f5!2sOpti-W%20Laval%20(optometriste%20et%20opticien%20Walmart)!5e0!3m2!1sfr!2sca!4v1752014723813!5m2!1sfr!2sca"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        {/* ⬅️ ROSEMÈRE */}
        <div className="store-card">
          <div className="store-info">
            <h3>Opti-W Rosemère</h3>
            <p>📍 401 Boul. Labelle, Rosemère, QC J7A 3T2</p>
            <p>📞 (450) 437-3500</p>
            <a
              href="https://onlinebookingv2.downloadwink.com/?id=2747&name=Vision%20770&storeid=7"
              target="_blank"
              rel="noopener noreferrer"
              className="appointment-button-inline"
            >
              Prendre rendez-vous
            </a>
          </div>
          <iframe
            title="Opti-W Rosemère"
            className="store-map"
            src="https://www.google.com/maps/place/Opti-W+Rosem%C3%A8re+(optometriste+et+opticien+Walmart)/@45.6195837,-73.9153733,12z/data=!4m6!3m5!1s0x4cc9264b342a7119:0x6b2a2e54879c041!8m2!3d45.6299725!4d-73.8217936!16s%2Fg%2F11hcjvpq73?hl=fr&entry=ttu&g_ep=EgoyMDI1MDcwNi4wIKXMDSoASAFQAw%3D%3D"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        {/* ⬅️ BLAINVILLE */}
        <div className="store-card">
          <div className="store-info">
            <h3>Opti-W Blainville</h3>
            <p>📍 13300 Boul. Curé-Labelle, Mirabel, QC J7J 1M3</p>
            <p>📞 (450) 430-4404</p>
            <a
              href="https://onlinebookingv2.downloadwink.com/?id=2747&name=Vision%20770&storeid=11"
              target="_blank"
              rel="noopener noreferrer"
              className="appointment-button-inline"
            >
              Prendre rendez-vous
            </a>
          </div>
          <iframe
            title="Opti-W Blainville"
            className="store-map"
            src="https://www.google.com/maps/place/Opti-W+Blanville+(optometriste+et+optician+Walmart)/@45.6791326,-73.9132629,17z/data=!3m1!4b1!4m6!3m5!1s0x4cc929e3ba92a189:0x2562f20629da38f2!8m2!3d45.6791326!4d-73.9132629!16s%2Fg%2F11h7s47y45?hl=fr&entry=ttu&g_ep=EgoyMDI1MDcwNi4wIKXMDSoASAFQAw%3D%3D"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
