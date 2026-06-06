import { useState } from 'react';
import { Stage } from '../contract';
import { useTx } from '../useTx';
import TxResult from '../TxResult';

export default function EntregaFinal() {
  const { run, status, hash, error } = useTx();

  const [batchId, setBatchId] = useState('LOTE-DEMO-01');
  const [receptor, setReceptor] = useState('Hospital General');
  const [direccion, setDireccion] = useState('Calle 100 #15-20');
  const [fecha, setFecha] = useState('2026-06-06');
  const [coldChainOk, setColdChainOk] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const details = JSON.stringify({ receptor, direccion, fecha });
    await run('transferCustody', [batchId, Stage.FinalDelivery, details, coldChainOk]);
  }

  const pending = status === 'pending';

  return (
    <div className="glass-card">
      <form className="stage-form" onSubmit={handleSubmit}>
        <h2>Entrega final</h2>

        <div className="field-group">
          <label htmlFor="ef-batchId">Batch ID</label>
          <input
            id="ef-batchId"
            type="text"
            placeholder="LOTE-DEMO-01"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="ef-receptor">Receptor</label>
          <input
            id="ef-receptor"
            type="text"
            placeholder="Hospital General"
            value={receptor}
            onChange={(e) => setReceptor(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="ef-direccion">Direccion</label>
          <input
            id="ef-direccion"
            type="text"
            placeholder="Calle 100 #15-20"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="ef-fecha">Fecha</label>
          <input
            id="ef-fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
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
          {pending ? 'Enviando...' : 'Confirmar entrega'}
        </button>
      </form>

      <TxResult status={status} hash={hash} error={error} />
    </div>
  );
}
