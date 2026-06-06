import { useState } from 'react';
import './App.css';
import Produccion from './stages/Produccion';
import DistribucionMundial from './stages/DistribucionMundial';
import DistribucionLocal from './stages/DistribucionLocal';
import EntregaFinal from './stages/EntregaFinal';
import Verify from './Verify';

type View = 'produccion' | 'mundial' | 'local' | 'final' | 'verify';

const NAV_ITEMS: { id: View; label: string }[] = [
  { id: 'produccion', label: 'Produccion' },
  { id: 'mundial', label: 'Dist. mundial' },
  { id: 'local', label: 'Dist. local' },
  { id: 'final', label: 'Entrega final' },
  { id: 'verify', label: 'Verificar' },
];

function App() {
  const [view, setView] = useState<View>('produccion');

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
        {view === 'produccion' && <Produccion />}
        {view === 'mundial' && <DistribucionMundial />}
        {view === 'local' && <DistribucionLocal />}
        {view === 'final' && <EntregaFinal />}
        {view === 'verify' && <Verify />}
      </main>
    </>
  );
}

export default App;
