import { useState } from 'react';
import { Stage } from '../contract';
import { useTx } from '../useTx';
import TxResult from '../TxResult';

interface Props {
  onConfirmed?: (hash: `0x${string}`) => void;
}

export default function DistribucionMundial({ onConfirmed }: Props) {
  const { run, status, hash, error } = useTx();

  const [batchId, setBatchId] = useState('LOTE-DEMO-01');
  const [medioTransporte, setMedioTransporte] = useState('Vuelo AA-123');
  const [numeroGuia, setNumeroGuia] = useState('GUIA-2024-001');
  const [coldChainOk, setColdChainOk] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const details = JSON.stringify({ medioTransporte, numeroGuia });
    const txHash = await run('transferCustody', [batchId, Stage.GlobalDistribution, details, coldChainOk]);
    if (txHash) onConfirmed?.(txHash);
  }

  const pending = status === 'pending';

  return (
    <div className="glass-card">
      <form className="stage-form" onSubmit={handleSubmit}>
        <h2>Distribucion mundial</h2>

        <div className="field-group">
          <label htmlFor="dm-batchId">Batch ID</label>
          <input
            id="dm-batchId"
            type="text"
            placeholder="LOTE-DEMO-01"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="dm-transporte">Medio de transporte</label>
          <input
            id="dm-transporte"
            type="text"
            placeholder="Vuelo AA-123"
            value={medioTransporte}
            onChange={(e) => setMedioTransporte(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="dm-guia">Numero de guia</label>
          <input
            id="dm-guia"
            type="text"
            placeholder="GUIA-2024-001"
            value={numeroGuia}
            onChange={(e) => setNumeroGuia(e.target.value)}
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
          {pending ? 'Enviando...' : 'Transferir custodia'}
        </button>
      </form>

      <TxResult status={status} hash={hash} error={error} />
    </div>
  );
}
