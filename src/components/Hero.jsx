import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  const calculateTimeLeft = () => {
    // Event date: December 04, 2026 at 18:00:00 (6:00 PM)
    const targetDate = new Date('2026-12-04T18:00:00');
    const difference = +targetDate - +new Date();
    
    let timeLeft = {
      días: 0,
      horas: 0,
      min: 0,
      seg: 0
    };

    if (difference > 0) {
      timeLeft = {
        días: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        min: Math.floor((difference / 1000 / 60) % 60),
        seg: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.header 
      className="wedding-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="wedding-logo">
        <motion.svg 
          className="rings-icon" 
          viewBox="0 0 100 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <circle cx="35" cy="30" r="22" stroke="url(#goldGradient)" strokeWidth="3"/>
          <circle cx="65" cy="30" r="22" stroke="url(#goldGradient)" strokeWidth="3" strokeDasharray="80 10"/>
          <defs>
            <linearGradient id="goldGradient" x1="13" y1="8" x2="87" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#DFBA6B" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#EED59B" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>
      
      <h1 className="couple-names">Desiré y Joel</h1>
      <p className="wedding-subtitle">Nuestra Boda • 04 de Diciembre, 2026</p>

      {/* Countdown Timer */}
      <div className="countdown-container">
        <div className="countdown-box">
          <div className="countdown-val">{String(timeLeft.días).padStart(2, '0')}</div>
          <div className="countdown-lbl">Días</div>
        </div>
        <div className="countdown-box">
          <div className="countdown-val">{String(timeLeft.horas).padStart(2, '0')}</div>
          <div className="countdown-lbl">Horas</div>
        </div>
        <div className="countdown-box">
          <div className="countdown-val">{String(timeLeft.min).padStart(2, '0')}</div>
          <div className="countdown-lbl">Min</div>
        </div>
        <div className="countdown-box">
          <div className="countdown-val">{String(timeLeft.seg).padStart(2, '0')}</div>
          <div className="countdown-lbl">Seg</div>
        </div>
      </div>
      
      <div className="divider">
        <span className="divider-line"></span>
        <motion.span 
          className="divider-leaf"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          ✦
        </motion.span>
        <span className="divider-line"></span>
      </div>
    </motion.header>
  );
}
