import { EXPLORER_TX_BASE } from './contract';
import type { TxStatus } from './useTx';

interface TxResultProps {
  status: TxStatus;
  hash: `0x${string}` | null;
  error: string | null;
}

export default function TxResult({ status, hash, error }: TxResultProps) {
  if (status === 'idle') return null;

  if (status === 'pending') {
    return (
      <div className="tx-result pending">
        Enviando transaccion...
      </div>
    );
  }

  if (status === 'confirmed' && hash) {
    return (
      <div className="tx-result confirmed">
        Transaccion confirmada.{' '}
        <a href={`${EXPLORER_TX_BASE}${hash}`} target="_blank" rel="noreferrer">
          Ver en MonadScan
        </a>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="tx-result error">
        Error: {error}
      </div>
    );
  }

  return null;
}
