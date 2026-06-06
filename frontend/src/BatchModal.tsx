import { useState } from 'react';

type ModalMode = 'choose' | 'new' | 'existing';

interface Props {
  isOpen: boolean;
  batchIds: string[];
  onCreateNew: (id: string) => void;
  onSelectExisting: (id: string) => void;
  onClose: () => void;
}

export default function BatchModal({ isOpen, batchIds, onCreateNew, onSelectExisting, onClose }: Props) {
  const [mode, setMode] = useState<ModalMode>('choose');
  const [newId, setNewId] = useState('');
  const [existingId, setExistingId] = useState(batchIds[0] ?? '');

  if (!isOpen) return null;

  function reset() {
    setMode('choose');
    setNewId('');
    setExistingId(batchIds[0] ?? '');
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleCreateNew() {
    const id = newId.trim();
    if (!id) return;
    reset();
    onCreateNew(id);
  }

  function handleSelectExisting() {
    if (!existingId) return;
    reset();
    onSelectExisting(existingId);
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card glass-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Selección de lote</h2>

        {mode === 'choose' && (
          <div className="modal-choices">
            <button className="modal-choice-btn" onClick={() => setMode('new')}>
              <span className="modal-choice-icon">＋</span>
              <span className="modal-choice-label">Nuevo lote</span>
              <span className="modal-choice-sub">Registrar un lote en la cadena</span>
            </button>
            <button className="modal-choice-btn" onClick={() => setMode('existing')}>
              <span className="modal-choice-icon">↗</span>
              <span className="modal-choice-label">Lote existente</span>
              <span className="modal-choice-sub">Continuar un lote ya registrado</span>
            </button>
          </div>
        )}

        {mode === 'new' && (
          <div className="modal-section">
            <div className="field-group">
              <label htmlFor="modal-new-id">Batch ID del nuevo lote</label>
              <input
                id="modal-new-id"
                type="text"
                autoFocus
                placeholder="LOTE-DEMO-02"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateNew()}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-submit" onClick={handleCreateNew} disabled={!newId.trim()}>
                Crear lote
              </button>
              <button className="btn-back" onClick={() => setMode('choose')}>
                Volver
              </button>
            </div>
          </div>
        )}

        {mode === 'existing' && (
          <div className="modal-section">
            <div className="field-group">
              <label htmlFor="modal-existing-id">Seleccionar lote</label>
              <select
                id="modal-existing-id"
                value={existingId}
                onChange={(e) => setExistingId(e.target.value)}
              >
                {batchIds.map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-submit" onClick={handleSelectExisting} disabled={!existingId}>
                Continuar
              </button>
              <button className="btn-back" onClick={() => setMode('choose')}>
                Volver
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
