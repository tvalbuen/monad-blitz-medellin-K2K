import { useState } from 'react';
import './App.css';
import Produccion from './stages/Produccion';
import DistribucionMundial from './stages/DistribucionMundial';
import DistribucionLocal from './stages/DistribucionLocal';
import EntregaFinal from './stages/EntregaFinal';
import Verify from './Verify';
import { EXPLORER_TX_BASE } from './contract';

type View = 'produccion' | 'mundial' | 'local' | 'final' | 'verify';

interface TxLogEntry {
  label: string;
  hash: `0x${string}`;
}

const NAV_ITEMS: { id: View; label: string }[] = [
  { id: 'produccion', label: 'Produccion' },
  { id: 'mundial', label: 'Dist. mundial' },
  { id: 'local', label: 'Dist. local' },
  { id: 'final', label: 'Entrega final' },
  { id: 'verify', label: 'Verificar' },
];

function App() {
  const [view, setView] = useState<View>('produccion');
  const [txLog, setTxLog] = useState<TxLogEntry[]>([]);

  function addTxEntry(label: string) {
    return (hash: `0x${string}`) => {
      setTxLog((prev) => [...prev, { label, hash }]);
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

      <main>
        {view === 'produccion' && <Produccion onConfirmed={addTxEntry('Produccion')} />}
        {view === 'mundial' && <DistribucionMundial onConfirmed={addTxEntry('Dist. mundial')} />}
        {view === 'local' && <DistribucionLocal onConfirmed={addTxEntry('Dist. local')} />}
        {view === 'final' && <EntregaFinal onConfirmed={addTxEntry('Entrega final')} />}
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
