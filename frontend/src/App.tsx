import { useState, useEffect } from 'react';
import './App.css';
import Produccion from './stages/Produccion';
import DistribucionMundial from './stages/DistribucionMundial';
import DistribucionLocal from './stages/DistribucionLocal';
import EntregaFinal from './stages/EntregaFinal';
import Verify from './Verify';
import { EXPLORER_TX_BASE, publicClient, supplyCheck, STAGE_LABELS } from './contract';

type View = 'produccion' | 'mundial' | 'local' | 'final' | 'verify';

type BatchStatus =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'not-registered' }
  | { status: 'registered'; stage: 0 | 1 | 2 | 3 }
  | { status: 'error'; message: string };

interface TxLogEntry {
  label: string;
  hash: `0x${string}`;
}

const KNOWN_BATCH_IDS = ['LOTE-DEMO-01', 'LOTE-DEMO-02'];

const NAV_ITEMS: { id: View; label: string }[] = [
  { id: 'produccion', label: 'Produccion' },
  { id: 'mundial', label: 'Dist. mundial' },
  { id: 'local', label: 'Dist. local' },
  { id: 'final', label: 'Entrega final' },
  { id: 'verify', label: 'Verificar' },
];

// Stage → view mapping
const STAGE_TO_VIEW: Record<number, View> = {
  0: 'mundial',
  1: 'local',
  2: 'final',
  3: 'verify',
};

function App() {
  const [view, setView] = useState<View>('produccion');
  const [txLog, setTxLog] = useState<TxLogEntry[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('LOTE-DEMO-01');
  const [batchStatus, setBatchStatus] = useState<BatchStatus>({ status: 'idle' });
  const [batchIds, setBatchIds] = useState<string[]>(KNOWN_BATCH_IDS);

  async function fetchBatchStatus(id: string) {
    setBatchStatus({ status: 'loading' });
    try {
      const result = await publicClient.readContract({
        ...supplyCheck,
        functionName: 'verifyBatch',
        args: [id],
      }) as [boolean, boolean, boolean, number, `0x${string}`];
      const [exists, , , currentStage] = result;
      if (!exists) {
        setBatchStatus({ status: 'not-registered' });
        setView('produccion');
      } else {
        const stage = currentStage as 0 | 1 | 2 | 3;
        setBatchStatus({ status: 'registered', stage });
        setView(STAGE_TO_VIEW[stage] ?? 'verify');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setBatchStatus({ status: 'error', message });
    }
  }

  useEffect(() => {
    if (selectedBatch.trim()) {
      fetchBatchStatus(selectedBatch);
    }
  }, [selectedBatch]);

  function isStageEnabled(tab: View): boolean {
    if (batchStatus.status === 'loading' || batchStatus.status === 'idle') return false;
    switch (tab) {
      case 'produccion': return batchStatus.status === 'not-registered';
      case 'mundial':    return batchStatus.status === 'registered' && batchStatus.stage === 0;
      case 'local':      return batchStatus.status === 'registered' && batchStatus.stage === 1;
      case 'final':      return batchStatus.status === 'registered' && batchStatus.stage === 2;
      default:           return true;
    }
  }

  function handleStageConfirmed(label: string) {
    return (hash: `0x${string}`) => {
      setTxLog((prev) => [...prev, { label, hash }]);
      // Add the selectedBatch to known list if not already present
      setBatchIds((prev) => prev.includes(selectedBatch) ? prev : [...prev, selectedBatch]);
      // Re-fetch batch status after tx confirms
      if (selectedBatch.trim()) {
        fetchBatchStatus(selectedBatch);
      }
    };
  }

  return (
    <>
      <header className="app-header">
        <h1>SupplyCheck</h1>
        <p>Trazabilidad farmaceutica en Monad — autenticidad en segundos, sin autoridad central</p>
      </header>

      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-btn${view === item.id ? ' active' : ''}`}
            onClick={() => setView(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="batch-selector glass-card">
        <div className="batch-selector-row">
          <div className="field-group" style={{ flex: 1 }}>
            <label htmlFor="global-batch-id">Batch ID</label>
            <input
              id="global-batch-id"
              type="text"
              list="batch-id-list"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              placeholder="LOTE-DEMO-01"
            />
            <datalist id="batch-id-list">
              {batchIds.map((id) => <option key={id} value={id} />)}
            </datalist>
          </div>
          <div className="batch-status-badge">
            {batchStatus.status === 'idle' && <span className="batch-status-idle">—</span>}
            {batchStatus.status === 'loading' && <span className="batch-status-loading">Consultando...</span>}
            {batchStatus.status === 'not-registered' && <span className="batch-status-new">No registrado</span>}
            {batchStatus.status === 'registered' && (
              <span className="batch-status-stage">
                {STAGE_LABELS[batchStatus.stage]}
              </span>
            )}
            {batchStatus.status === 'error' && <span className="batch-status-error">Error</span>}
          </div>
        </div>
      </div>

      <main>
        {view === 'produccion' && (
          <Produccion
            batchId={selectedBatch}
            disabled={!isStageEnabled('produccion')}
            onConfirmed={handleStageConfirmed('Produccion')}
          />
        )}
        {view === 'mundial' && (
          <DistribucionMundial
            batchId={selectedBatch}
            disabled={!isStageEnabled('mundial')}
            onConfirmed={handleStageConfirmed('Dist. mundial')}
          />
        )}
        {view === 'local' && (
          <DistribucionLocal
            batchId={selectedBatch}
            disabled={!isStageEnabled('local')}
            onConfirmed={handleStageConfirmed('Dist. local')}
          />
        )}
        {view === 'final' && (
          <EntregaFinal
            batchId={selectedBatch}
            disabled={!isStageEnabled('final')}
            onConfirmed={handleStageConfirmed('Entrega final')}
          />
        )}
        {view === 'verify' && <Verify />}
      </main>

      {txLog.length > 0 && (
        <section className="tx-log-panel glass-card">
          <h3 className="tx-log-title">Transacciones en cadena</h3>
          <ul className="tx-log-list">
            {txLog.map((e, i) => (
              <li key={i} className="tx-log-entry">
                <span className="tx-log-stage">{e.label}</span>
                <a
                  href={`${EXPLORER_TX_BASE}${e.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="tx-log-hash"
                >
                  {e.hash.slice(0, 10)}…{e.hash.slice(-6)}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

export default App;
