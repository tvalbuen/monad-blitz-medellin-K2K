import { useState } from 'react';
import { useTx } from '../useTx';
import TxResult from '../TxResult';

export default function Produccion() {
  const { run, status, hash, error } = useTx();

  const [batchId, setBatchId] = useState('LOTE-DEMO-01');
  const [productName, setProductName] = useState('Vacuna-X');
  const [proveedor, setProveedor] = useState('Laboratorios ABC');
  const [equipo, setEquipo] = useState('Equipo de produccion');
  const [pureza, setPureza] = useState('99.7%');
  const [despacho, setDespacho] = useState('Despacho #001');
  const [coldChainOk, setColdChainOk] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const details = JSON.stringify({ proveedor, equipo, pureza, despacho });
    await run('registerBatch', [batchId, productName, details, coldChainOk]);
  }

  const pending = status === 'pending';

  return (
    <div className="glass-card">
      <form className="stage-form" onSubmit={handleSubmit}>
        <h2>Produccion</h2>

        <div className="field-group">
          <label htmlFor="prod-batchId">Batch ID</label>
          <input
            id="prod-batchId"
            type="text"
            placeholder="LOTE-DEMO-01"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="prod-productName">Nombre del producto</label>
          <input
            id="prod-productName"
            type="text"
            placeholder="Vacuna-X"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="prod-proveedor">Proveedor</label>
          <input
            id="prod-proveedor"
            type="text"
            placeholder="Laboratorios ABC"
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="prod-equipo">Equipo</label>
          <input
            id="prod-equipo"
            type="text"
            placeholder="Equipo de produccion"
            value={equipo}
            onChange={(e) => setEquipo(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="prod-pureza">Pureza de compuestos</label>
          <input
            id="prod-pureza"
            type="text"
            placeholder="99.7%"
            value={pureza}
            onChange={(e) => setPureza(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="prod-despacho">Despacho</label>
          <input
            id="prod-despacho"
            type="text"
            placeholder="Despacho #001"
            value={despacho}
            onChange={(e) => setDespacho(e.target.value)}
          />
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={coldChainOk}
            onChange={(e) => setColdChainOk(e.target.checked)}
          />
          <span>Cadena de frio verificada</span>
        </label>

        <button type="submit" className="btn-submit" disabled={pending}>
          {pending ? 'Registrando...' : 'Registrar lote'}
        </button>
      </form>

      <TxResult status={status} hash={hash} error={error} />
    </div>
  );
}
