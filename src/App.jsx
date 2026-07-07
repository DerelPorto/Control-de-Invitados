import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import SearchBox from './components/SearchBox';
import ResultCard from './components/ResultCard';
import AdminPanel from './components/AdminPanel';
import { fallbackGuests } from './components/participantes';


export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [guests, setGuests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [isAdminModeActive, setIsAdminModeActive] = useState(false);

  // Check for admin query parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true') {
        setIsAdminModeActive(true);
      }
    }
  }, []);

  // Fetch guests on mount (checking localStorage ONLY for admin users)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isAdminParam = params.get('admin') === 'true';
    const isAuthSession = typeof window !== 'undefined' && sessionStorage.getItem('wedding_admin_auth') === 'true';

    if (isAdminParam || isAuthSession) {
      const localData = localStorage.getItem('wedding_guests');
      if (localData) {
        try {
          setGuests(JSON.parse(localData));
          return;
        } catch (e) {
          console.error('Error parsing wedding_guests from localStorage, reloading...', e);
        }
      }
    }

    fetch('/invitados.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load JSON');
        return res.json();
      })
      .then((data) => {
        setGuests(data);
        if (isAdminParam || isAuthSession) {
          localStorage.setItem('wedding_guests', JSON.stringify(data));
        }
      })
      .catch((err) => {
        console.warn('Using local fallback guest list:', err);
        setGuests(fallbackGuests);
        if (isAdminParam || isAuthSession) {
          localStorage.setItem('wedding_guests', JSON.stringify(fallbackGuests));
        }
      });
  }, [isAdminModeActive]);

  const handleUpdateGuests = (newGuests) => {
    setGuests(newGuests);
    localStorage.setItem('wedding_guests', JSON.stringify(newGuests));
  };

  // Helper to remove accents/diacritics and convert to lowercase
  const normalizeString = (str) => {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  };

  // Filter suggestions when search query changes
  useEffect(() => {
    const query = normalizeString(searchQuery);
    if (!query) {
      setSuggestions([]);
      return;
    }

    const filtered = guests.filter((guest) => {
      const guestNameMatch = normalizeString(guest.nombre).includes(query);
      const companionMatch = guest.acompanantes && guest.acompanantes.some(
        (companion) => normalizeString(companion).includes(query)
      );
      return guestNameMatch || companionMatch;
    });

    setSuggestions(filtered);
  }, [searchQuery, guests]);

  const handleSelectGuest = (guest) => {
    setSelectedGuest(guest);
  };

  const handleResetSearch = () => {
    setSelectedGuest(null);
    setSearchQuery('');
  };

  return (
    <>
      {/* Animated Background Blobs */}
      <div className="bg-blobs-container">
        <motion.div
          className="bg-blob blob-1"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="bg-blob blob-2"
          animate={{
            x: [0, -40, 20, 0],
            y: [0, 30, -20, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="bg-blob blob-3"
          animate={{
            x: [0, 20, -20, 0],
            y: [0, 20, 10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Decorative Ornaments */}
      <div className="bg-ornament bg-ornament-top-left"></div>
      <div className="bg-ornament bg-ornament-bottom-right"></div>

      {/* Hero Header component */}
      <Hero />

      {/* Main Container with smooth fade/slide transitions between Search and Results */}
      <main className="main-content" style={{ width: '100%' }}>
        <AnimatePresence mode="wait">
          {!selectedGuest ? (
            <motion.div
              key="search-box"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <SearchBox
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                suggestions={suggestions}
                onSelectGuest={handleSelectGuest}
                onClear={() => setSearchQuery('')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="result-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <ResultCard
                guest={selectedGuest}
                onReset={handleResetSearch}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Admin Panel and footer details */}
      <AdminPanel
        isAdminModeActive={isAdminModeActive}
        guests={guests}
        onUpdateGuests={handleUpdateGuests}
      />
    </>
  );
}
