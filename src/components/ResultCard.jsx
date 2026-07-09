import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, MapPin, Calendar, ArrowLeft } from 'lucide-react';

export default function ResultCard({ guest, onReset }) {
  // Animation presets for staggered entries
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const handleWhatsAppRSVP = () => {
    const message = `¡Hola Desiré y Joel! Confirmo mi asistencia a su boda. Mi nombre es ${guest.nombre} y estaré asignado(a) en la ${guest.mesa}. ¡Qué gran alegría acompañarles en este día! ✨`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleLocation = () => {
    // Elegant wedding venue coordinates or address
    window.open('https://maps.google.com/?q=Santo+Domingo,+Republica+Dominicana', '_blank');
  };

  const handleAddToCalendar = () => {
    const title = 'Boda de Desiré y Joel';
    const details = '¡Celebración de nuestra boda! Acompáñanos a compartir nuestro amor.';
    const location = 'Santo Domingo, República Dominicana';
    const startDate = '20261204T180000'; // Dec 4, 2026 at 6:00 PM
    const endDate = '20261205T020000'; // Dec 5, 2026 at 2:00 AM
    
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    window.open(gCalUrl, '_blank');
  };

  return (
    <motion.section 
      id="result-card" 
      className="result-section card"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="success-header" variants={itemVariants}>
        <div className="success-icon-wrapper">
          <Sparkles size={20} />
        </div>
        <h3 className="guest-welcome">¡Te encontramos!</h3>
      </motion.div>

      <div className="guest-info-display">
        <motion.h4 className="display-name" variants={itemVariants}>
          {guest.nombre}
        </motion.h4>
        
        {/* Luxury Gold Ticket Design */}
        <motion.div className="ticket-container" variants={itemVariants}>
          <div className="ticket-notch ticket-notch-left"></div>
          <div className="ticket-notch ticket-notch-right"></div>
          <div className="ticket-divider"></div>
          
          <div className="ticket-top">
            <div className="table-label">Tu Mesa Asignada</div>
            <div className="table-number">{guest.mesa}</div>
          </div>
          <div className="ticket-bottom">
            <span className="ticket-footer-text">Desiré y Joel • 04.12.2026</span>
          </div>
        </motion.div>

        {guest.acompanantes && guest.acompanantes.length > 0 && (
          <motion.div className="info-group" variants={itemVariants}>
            <span className="group-label">Acompañantes incluidos</span>
            <div className="companions-list-tags">
              {guest.acompanantes.map((companion, index) => (
                <span key={index}>{companion}</span>
              ))}
            </div>
          </motion.div>
        )}

        {guest.mensaje && (
          <motion.div className="message-bubble" variants={itemVariants}>
            <svg className="quote-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            <p className="guest-message">
              {guest.mensaje}
            </p>
          </motion.div>
        )}

        {/* Dynamic Action Buttons */}
        <motion.div className="actions-grid" variants={itemVariants}>
          <button className="btn-action btn-action-primary" onClick={handleWhatsAppRSVP}>
            <MessageSquare size={16} />
            Confirmar Asistencia (WhatsApp)
          </button>
          <button className="btn-action" onClick={handleLocation}>
            <MapPin size={16} />
            Ver Ubicación
          </button>
          <button className="btn-action" onClick={handleAddToCalendar}>
            <Calendar size={16} />
            Añadir al Calendario
          </button>
        </motion.div>
      </div>

      <motion.button 
        className="btn-text" 
        onClick={onReset}
        variants={itemVariants}
        style={{ margin: '8px auto 0', justifyContent: 'center' }}
      >
        <ArrowLeft size={16} />
        Hacer otra búsqueda
      </motion.button>
    </motion.section>
  );
}
