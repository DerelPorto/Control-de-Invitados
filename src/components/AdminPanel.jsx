import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  QrCode,
  Download,
  X,
  Copy,
  Check,
  Lock,
  Plus,
  Trash2,
  Edit,
  Search,
  Upload,
  Save,
  Users
} from 'lucide-react';
import QRCode from 'qrcode';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Sole2026';

export default function AdminPanel({ isAdminModeActive, guests, onUpdateGuests }) {
  if (!isAdminModeActive) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState('https://mi-boda.com');
  const [hasQr, setHasQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Navigation & Operations State
  const [currentTab, setCurrentTab] = useState('qr'); // 'qr' or 'guests'
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formMode, setFormMode] = useState(null); // 'add', 'edit' or null
  const [formGuest, setFormGuest] = useState({ id: '', nombre: '', mesa: '', mensaje: '', acompanantes: [] });
  const [newCompanionName, setNewCompanionName] = useState('');

  // Load auth state from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuth = sessionStorage.getItem('wedding_admin_auth');
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Initialize URL with current page origin if available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.href && !window.location.href.startsWith('file://')) {
      setQrUrl(window.location.origin + window.location.pathname);
    }
  }, []);

  const generateQR = async (text) => {
    if (!text || !canvasRef.current) return;
    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: 180,
        margin: 2,
        color: {
          dark: '#2d2a26',
          light: '#ffffff'
        }
      });
      setHasQr(true);
    } catch (err) {
      console.error('Error generating QR:', err);
    }
  };

  useEffect(() => {
    if (isOpen && currentTab === 'qr' && isAuthenticated) {
      setTimeout(() => {
        generateQR(qrUrl);
      }, 150);
    }
  }, [isOpen, currentTab, qrUrl, isAuthenticated]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const downloadUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'codigo-qr-boda.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintCard = () => {
    if (!canvasRef.current) return;
    const qrImageSrc = canvasRef.current.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Imprimir Invitación - Desiré y Joel</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap');
          
          body {
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            font-family: 'Caveat', cursive, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: #c5a059;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .card {
            width: 450px;
            height: 600px;
            box-sizing: border-box;
            padding: 40px 20px;
            text-align: center;
            background-color: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
          }
          .title {
            font-size: 3.8rem;
            margin: 0 0 10px 0;
            font-weight: 700;
            color: #c5a059;
          }
          .subtitle {
            font-size: 2.3rem;
            line-height: 1.4;
            margin: 0;
            font-weight: 500;
          }
          .qr-container {
            margin: 15px 0;
            padding: 5px;
            background: #ffffff;
            display: inline-block;
          }
          .qr-container img {
            width: 180px;
            height: 180px;
            display: block;
          }
          .footer-names {
            font-size: 3.1rem;
            margin: 0 0 5px 0;
            font-weight: 700;
          }
          .footer-date {
            font-size: 2.2rem;
            margin: 0;
            font-weight: 500;
          }
          @media print {
            body {
              min-height: auto;
            }
            .card {
              border: none;
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div>
            <h1 class="title">¡Bienvenidos!</h1>
            <p class="subtitle">Escanea el código QR<br>y descubre tu mesa</p>
          </div>
          <div class="qr-container">
            <img src="${qrImageSrc}" alt="Código QR">
          </div>
          <div>
            <h2 class="footer-names">Desiré y Joel</h2>
            <p class="footer-date">04 de Diciembre de 2026</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 300);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error('Error copying text: ', err));
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('wedding_admin_auth', 'true');
      }
      setAuthError('');
      setPassword('');
    } else {
      setAuthError('Contraseña incorrecta. Inténtalo de nuevo.');
    }
  };

  // Export Guest list to JSON file
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(guests, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "invitados.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import Guest list from JSON file
  const handleImport = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!Array.isArray(parsed)) {
          alert('El archivo JSON debe contener una lista (array) de invitados.');
          return;
        }

        // Basic schema check
        const isValid = parsed.every(g => typeof g.nombre === 'string');
        if (!isValid) {
          alert('Formato inválido. Cada invitado debe tener al menos la propiedad "nombre" (ej. {"nombre": "Juan"}).');
          return;
        }

        // Map parsed guests to ensure they have correct structure
        const formatted = parsed.map((g, idx) => ({
          id: g.id || Date.now() + idx,
          nombre: g.nombre,
          mesa: g.mesa || 'Mesa 1',
          acompanantes: Array.isArray(g.acompanantes) ? g.acompanantes : [],
          mensaje: g.mensaje || ''
        }));

        if (window.confirm(`Se encontraron ${formatted.length} invitados en el archivo. ¿Deseas reemplazar la lista actual por completo? (Cancelar agregará los nuevos a la lista existente sin sobrescribir)`)) {
          onUpdateGuests(formatted);
        } else {
          // Merge lists, avoid duplicate IDs
          const existingIds = new Set(guests.map(g => g.id));
          const newGuests = [...guests];
          formatted.forEach(g => {
            if (existingIds.has(g.id)) {
              g.id = Math.max(...newGuests.map(item => item.id), 0) + 1;
            }
            newGuests.push(g);
          });
          onUpdateGuests(newGuests);
        }
      } catch (err) {
        alert('Error al leer el archivo JSON. Asegúrate de que esté bien formado.');
        console.error(err);
      }
    };
    fileReader.readAsText(file);
    e.target.value = null; // Reset file input
  };

  // Form Companion Handlers
  const handleAddCompanion = () => {
    if (!newCompanionName.trim()) return;
    setFormGuest({
      ...formGuest,
      acompanantes: [...formGuest.acompanantes, newCompanionName.trim()]
    });
    setNewCompanionName('');
  };

  const handleRemoveCompanion = (indexToRemove) => {
    setFormGuest({
      ...formGuest,
      acompanantes: formGuest.acompanantes.filter((_, idx) => idx !== indexToRemove)
    });
  };

  const handleSaveForm = () => {
    if (!formGuest.nombre.trim()) {
      alert('El nombre del invitado es obligatorio.');
      return;
    }

    let updatedGuests;
    if (formMode === 'add') {
      const newId = guests.length > 0 ? Math.max(...guests.map(g => g.id)) + 1 : 1;
      const newGuest = {
        ...formGuest,
        id: newId,
        nombre: formGuest.nombre.trim(),
        mesa: formGuest.mesa.trim(),
        mensaje: formGuest.mensaje.trim()
      };
      updatedGuests = [...guests, newGuest];
    } else {
      updatedGuests = guests.map(g =>
        g.id === formGuest.id
          ? {
            ...formGuest,
            nombre: formGuest.nombre.trim(),
            mesa: formGuest.mesa.trim(),
            mensaje: formGuest.mensaje.trim()
          }
          : g
      );
    }

    onUpdateGuests(updatedGuests);
    setFormMode(null);
  };

  const handleEditClick = (guest) => {
    setFormGuest({ ...guest });
    setFormMode('edit');
  };

  const handleDeleteConfirm = (id) => {
    const updatedGuests = guests.filter(g => g.id !== id);
    onUpdateGuests(updatedGuests);
    setDeleteConfirmId(null);
  };

  const filteredGuests = guests.filter(guest => {
    const query = adminSearchQuery.toLowerCase();
    return (
      guest.nombre.toLowerCase().includes(query) ||
      (guest.mesa && guest.mesa.toLowerCase().includes(query)) ||
      (guest.acompanantes && guest.acompanantes.some(c => c.toLowerCase().includes(query)))
    );
  });

  return (
    <footer className="app-footer">
      <button
        className="btn-text"
        onClick={() => setIsOpen(true)}
      >
        <Settings size={14} />
        Configuración
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsOpen(false);
              setFormMode(null);
              setDeleteConfirmId(null);
              setAuthError('');
              setPassword('');
            }}
          >
            <motion.div
              className="modal-content"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()} // Prevent close when clicking panel content
              style={{ maxWidth: currentTab === 'guests' && isAuthenticated ? '550px' : '500px' }}
            >
              <button
                className="modal-close"
                onClick={() => {
                  setIsOpen(false);
                  setFormMode(null);
                  setDeleteConfirmId(null);
                  setAuthError('');
                  setPassword('');
                }}
                aria-label="Cerrar panel"
              >
                <X size={16} />
              </button>

              <div className="admin-panel">
                {!isAuthenticated ? (
                  /* Password Protection Gate */
                  <div className="auth-panel">
                    <div className="auth-icon-wrapper">
                      <Lock size={22} />
                    </div>
                    <h3>Acceso Administrador</h3>
                    <p>Introduce la contraseña de acceso para realizar cambios en el evento o la lista de invitados.</p>
                    <form onSubmit={handleAuthSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <input
                        type="password"
                        placeholder="Escribe la contraseña..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          width: '100%',
                          height: '46px',
                          border: '1.5px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '0 16px',
                          textAlign: 'center',
                          outline: 'none',
                          fontSize: '0.95rem'
                        }}
                        autoFocus
                      />
                      {authError && <p className="auth-error">{authError}</p>}
                      <button type="submit" className="btn-primary" style={{ height: '46px' }}>
                        Desbloquear
                      </button>
                    </form>
                  </div>
                ) : (
                  /* Authenticated Views */
                  <>
                    <h3>Panel de Control</h3>

                    {/* Tabs Control */}
                    <div className="admin-tabs">
                      <button
                        className={`admin-tab ${currentTab === 'qr' ? 'active' : ''}`}
                        onClick={() => {
                          setCurrentTab('qr');
                          setFormMode(null);
                          setDeleteConfirmId(null);
                        }}
                      >
                        <QrCode size={14} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline' }} />
                        Código QR
                      </button>
                      <button
                        className={`admin-tab ${currentTab === 'guests' ? 'active' : ''}`}
                        onClick={() => {
                          setCurrentTab('guests');
                          setFormMode(null);
                          setDeleteConfirmId(null);
                        }}
                      >
                        <Users size={14} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline' }} />
                        Invitados
                      </button>
                    </div>

                    {/* QR Code Tab */}
                    {currentTab === 'qr' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <p>
                          Escribe el enlace final de este sitio web (ej: la URL de Vercel/GitHub Pages) para generar el código QR que imprimirás en las invitaciones físicas.
                        </p>

                        <div className="qr-inputs">
                          <input
                            type="url"
                            placeholder="https://mi-boda.com"
                            value={qrUrl}
                            onChange={(e) => setQrUrl(e.target.value)}
                          />
                          <button
                            className="btn-secondary"
                            onClick={() => generateQR(qrUrl)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <QrCode size={16} />
                            Generar
                          </button>
                        </div>

                        <div className="qr-display-container">
                          <div className="qrcode-box">
                            <canvas ref={canvasRef}></canvas>
                          </div>

                          <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {hasQr && (
                              <>
                                <button
                                  className="btn-primary"
                                  onClick={handleDownload}
                                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 16px', fontSize: '0.82rem', flex: '1 1 calc(50% - 5px)', justifyContent: 'center' }}
                                >
                                  <Download size={15} />
                                  Descargar QR
                                </button>
                                <button
                                  className="btn-primary"
                                  onClick={handlePrintCard}
                                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 16px', fontSize: '0.82rem', flex: '1 1 calc(50% - 5px)', justifyContent: 'center' }}
                                >
                                  <QrCode size={15} />
                                  Imprimir Tarjeta
                                </button>
                              </>
                            )}
                            <button
                              className="btn-secondary"
                              onClick={handleCopyLink}
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '1 1 100%', justifyContent: 'center', fontSize: '0.82rem' }}
                            >
                              {copied ? <Check size={15} /> : <Copy size={15} />}
                              {copied ? 'Copiado' : 'Copiar Enlace'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Guests List Tab */}
                    {currentTab === 'guests' && (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {formMode === null ? (
                          <>
                            {/* Dashboard Stats */}
                            <div className="admin-stats">
                              <div className="stat-card">
                                <div className="stat-val">{guests.length}</div>
                                <div className="stat-lbl">Invitados</div>
                              </div>
                              <div className="stat-card">
                                <div className="stat-val">{new Set(guests.map(g => g.mesa).filter(Boolean)).size}</div>
                                <div className="stat-lbl">Mesas Asignadas</div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="admin-controls">
                              <button
                                className="btn-secondary btn-icon-label"
                                onClick={() => {
                                  setFormGuest({ id: '', nombre: '', mesa: '', mensaje: '', acompanantes: [] });
                                  setFormMode('add');
                                }}
                              >
                                <Plus size={14} />
                                Agregar Invitado
                              </button>

                              <button
                                className="btn-secondary btn-icon-label"
                                onClick={handleExport}
                              >
                                <Download size={14} />
                                Exportar
                              </button>

                              <div className="file-input-wrapper btn-secondary btn-icon-label">
                                <Upload size={14} />
                                <span>Importar</span>
                                <input type="file" accept=".json" onChange={handleImport} />
                              </div>
                            </div>

                            {/* Search bar */}
                            <div className="admin-search">
                              <span className="search-icon">
                                <Search size={15} />
                              </span>
                              <input
                                type="text"
                                placeholder="Buscar invitado o mesa..."
                                value={adminSearchQuery}
                                onChange={(e) => setAdminSearchQuery(e.target.value)}
                              />
                            </div>

                            {/* Scrollable list */}
                            <div className="admin-list-container">
                              {filteredGuests.length === 0 ? (
                                <div style={{ padding: '24px 14px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                  No se encontraron invitados
                                </div>
                              ) : (
                                filteredGuests.map(guest => (
                                  <div className="admin-guest-item" key={guest.id}>
                                    <div className="guest-info-col">
                                      <span className="guest-name-txt">{guest.nombre}</span>
                                      <span className="guest-meta-txt">
                                        {guest.mesa || 'Sin mesa asignada'} • {guest.acompanantes ? guest.acompanantes.length : 0} acomp.
                                      </span>
                                    </div>
                                    <div className="guest-actions-col">
                                      {deleteConfirmId === guest.id ? (
                                        <div className="confirm-box" style={{ display: 'flex', gap: '4px' }}>
                                          <button
                                            className="btn-action-icon delete"
                                            onClick={() => handleDeleteConfirm(guest.id)}
                                            title="Confirmar eliminación"
                                            style={{ color: '#d32f2f' }}
                                          >
                                            <Check size={14} />
                                          </button>
                                          <button
                                            className="btn-action-icon"
                                            onClick={() => setDeleteConfirmId(null)}
                                            title="Cancelar"
                                          >
                                            <X size={14} />
                                          </button>
                                        </div>
                                      ) : (
                                        <>
                                          <button
                                            className="btn-action-icon edit"
                                            onClick={() => handleEditClick(guest)}
                                            title="Editar"
                                          >
                                            <Edit size={14} />
                                          </button>
                                          <button
                                            className="btn-action-icon delete"
                                            onClick={() => setDeleteConfirmId(guest.id)}
                                            title="Eliminar"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </>
                        ) : (
                          /* Add or Edit Form */
                          <div className="admin-form">
                            <h4>{formMode === 'add' ? 'Agregar Invitado' : 'Editar Invitado'}</h4>

                            <div className="form-group">
                              <label>Nombre</label>
                              <input
                                type="text"
                                placeholder="Ej. Pedro Almonte"
                                value={formGuest.nombre}
                                onChange={(e) => setFormGuest({ ...formGuest, nombre: e.target.value })}
                              />
                            </div>

                            <div className="form-group">
                              <label>Mesa asignada</label>
                              <input
                                type="text"
                                placeholder="Ej. Mesa 5"
                                value={formGuest.mesa}
                                onChange={(e) => setFormGuest({ ...formGuest, mesa: e.target.value })}
                              />
                            </div>

                            <div className="form-group">
                              <label>Mensaje de Bienvenida</label>
                              <textarea
                                placeholder="Mensaje personalizado que verá al buscar su nombre..."
                                value={formGuest.mensaje}
                                rows={2}
                                onChange={(e) => setFormGuest({ ...formGuest, mensaje: e.target.value })}
                              />
                            </div>

                            {/* Companion list manager */}
                            <div className="form-group companions-editor">
                              <label>Acompañantes ({formGuest.acompanantes.length})</label>
                              <div className="companion-input-row">
                                <input
                                  type="text"
                                  placeholder="Nombre del acompañante..."
                                  value={newCompanionName}
                                  onChange={(e) => setNewCompanionName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddCompanion();
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  className="btn-secondary btn-small"
                                  onClick={handleAddCompanion}
                                >
                                  Agregar
                                </button>
                              </div>

                              <div className="companions-tags-list">
                                {formGuest.acompanantes.map((companion, idx) => (
                                  <span key={idx} className="companion-tag">
                                    {companion}
                                    <button
                                      type="button"
                                      className="companion-tag-remove"
                                      onClick={() => handleRemoveCompanion(idx)}
                                    >
                                      <X size={10} />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="form-actions">
                              <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setFormMode(null)}
                              >
                                Cancelar
                              </button>
                              <button
                                type="button"
                                className="btn-primary"
                                onClick={handleSaveForm}
                              >
                                Guardar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="copyright">Con amor • Desiré y Joel</p>
    </footer>
  );
}
