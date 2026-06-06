import { useState } from 'react';
import { Stage } from '../contract';
import { useTx } from '../useTx';
import TxResult from '../TxResult';

interface Props {
  batchId: string;
  disabled: boolean;
  onConfirmed?: (hash: `0x${string}`) => void;
}

export default function DistribucionLocal({ batchId, disabled, onConfirmed }: Props) {
  const { run, status, hash, error } = useTx();

  const [receptor, setReceptor] = useState('Farmacia Central');
  const [palet, setPalet] = useState('PAL-001');
  const [autores, setAutores] = useState('Juan / Maria');
  const [coldChainOk, setColdChainOk] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const details = JSON.stringify({ receptor, palet, autores });
    const txHash = await run('transferCustody', [batchId, Stage.LocalDistribution, details, coldChainOk]);
    if (txHash) onConfirmed?.(txHash);
  }

  const pending = status === 'pending';

  return (
    <div className="glass-card">
      <form className="stage-form" onSubmit={handleSubmit}>
        <h2>Distribucion local</h2>

        <div className="field-group">
          <label htmlFor="dl-receptor">Receptor</label>
          <input
            id="dl-receptor"
            type="text"
            placeholder="Farmacia Central"
            value={receptor}
            onChange={(e) => setReceptor(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="dl-palet">Palet</label>
          <input
            id="dl-palet"
            type="text"
            placeholder="PAL-001"
            value={palet}
            onChange={(e) => setPalet(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="dl-autores">Autores</label>
          <input
            id="dl-autores"
            type="text"
            placeholder="Juan / Maria"
            value={autores}
            onChange={(e) => setAutores(e.target.value)}
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

        <button type="submit" className="btn-submit" disabled={pending || disabled}>
          {pending ? 'Enviando...' : 'Transferir custodia'}
        </button>
      </form>

      <TxResult status={status} hash={hash} error={error} />
    </div>
  );
}
