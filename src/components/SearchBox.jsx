import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight } from 'lucide-react';

export default function SearchBox({
  searchQuery,
  setSearchQuery,
  suggestions,
  onSelectGuest,
  onClear
}) {
  const listVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
        staggerChildren: 0.04,
        delayChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.15 }
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="search-section card">
      <h2 className="section-title">Descubre tu mesa</h2>
      <p className="section-description">
        Ingresa tu nombre y apellido para conocer la mesa asignada.
      </p>

      <div className="search-box-wrapper">
        <div className="search-box">
          <span className="search-icon">
            <Search size={18} />
          </span>
          <input
            type="text"
            id="guest-search"
            placeholder="Escribe tu nombre aquí..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                id="clear-search"
                className="clear-button"
                onClick={onClear}
                aria-label="Limpiar búsqueda"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <X size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      <AnimatePresence>
        {searchQuery && (
          <motion.div
            id="suggestions-container"
            className="suggestions-list"
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {suggestions.length === 0 ? (
              <div className="suggestion-item" style={{ cursor: 'default', color: 'var(--text-muted)' }}>
                <span>No se encontraron resultados</span>
              </div>
            ) : (
              suggestions.map((guest) => (
                <motion.div
                  key={guest.id}
                  className="suggestion-item"
                  onClick={() => onSelectGuest(guest)}
                  variants={itemVariants}
                  whileHover={{ paddingLeft: 22, backgroundColor: '#faf8f5' }}
                  transition={{ duration: 0.2 }}
                >
                  <span>{guest.nombre}</span>
                  <motion.span className="suggestion-item-arrow">
                    <ChevronRight size={16} />
                  </motion.span>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
