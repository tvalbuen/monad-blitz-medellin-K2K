import { useState } from 'react';
import { publicClient, supplyCheck, STAGE_LABELS, EXPLORER_TX_BASE } from './contract';

interface TxEntry {
  label: string;
  hash: `0x${string}`;
}

interface Handoff {
  stage: number;
  actor: `0x${string}`;
  timestamp: bigint;
  details: string;
  coldChainOk: boolean;
}

interface VerifyResult {
  exists: boolean;
  authentic: boolean;
  compromised: boolean;
  currentStage: number;
  manufacturer: `0x${string}`;
}

type VerifyState = 'idle' | 'loading' | 'done' | 'error';

function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function parseDetails(raw: string): Record<string, string> | null {
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return null;
  }
}

export default function Verify({ txLog = {} }: { txLog?: Record<string, TxEntry[]> }) {
  const [batchId, setBatchId] = useState('LOTE-DEMO-01');
  const [state, setState] = useState<VerifyState>('idle');
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [history, setHistory] = useState<Handoff[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    setResult(null);
    setHistory([]);
    setErrorMsg(null);

    try {
      const [verifyRaw, historyRaw] = await Promise.all([
        publicClient.readContract({
          ...supplyCheck,
          functionName: 'verifyBatch',
          args: [batchId],
        }),
        publicClient.readContract({
          ...supplyCheck,
          functionName: 'getBatchHistory',
          args: [batchId],
        }),
      ]);

      const [exists, authentic, compromised, currentStage, manufacturer] =
        verifyRaw as [boolean, boolean, boolean, number, `0x${string}`];

      setResult({ exists, authentic, compromised, currentStage, manufacturer });
      setHistory(historyRaw as Handoff[]);
      setState('done');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setState('error');
    }
  }

  return (
    <div className="glass-card">
      <form className="verify-form" onSubmit={handleVerify}>
        <h2>Verificar lote</h2>
        <div className="field-group">
          <label htmlFor="verify-batchId">Batch ID</label>
          <input
            id="verify-batchId"
            type="text"
            placeholder="LOTE-DEMO-01"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn-submit"
          disabled={state === 'loading'}
        >
          {state === 'loading' ? 'Verificando...' : 'Verificar'}
        </button>
      </form>

      {state === 'error' && (
        <div className="tx-result error">Error: {errorMsg}</div>
      )}

      {state === 'done' && result && (
        <>
          {!result.exists && (
            <div className="verify-result">
              <span className="badge badge-not-found">NO ENCONTRADO</span>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                No existe ningun lote con ID &ldquo;{batchId}&rdquo; en el contrato.
              </p>
            </div>
          )}

          {result.exists && result.authentic && (
            <div className="verify-result">
              <span className="badge badge-authentic">AUTENTICO</span>
              <p className="badge-sub">Cadena de custodia íntegra — verificado en Monad</p>
            </div>
          )}

          {result.exists && !result.authentic && (
            <div className="verify-result">
              <span className="badge badge-compromised">COMPROMETIDO</span>
              <p className="badge-sub">Cadena de frío comprometida — alerta de integridad</p>
            </div>
          )}

          {(txLog[batchId]?.length ?? 0) > 0 && (
            <section className="tx-log-panel glass-card" style={{ marginTop: '1rem' }}>
              <h3 className="tx-log-title">Transacciones en cadena</h3>
              <ul className="tx-log-list">
                {txLog[batchId].map((e, i) => (
                  <li key={i} className="tx-log-entry">
                    <span className="tx-log-stage">{e.label}</span>
                    <a
                      href={`${EXPLORER_TX_BASE}${e.hash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="tx-log-hash"
                    >
                      {e.hash.slice(0, 10)}…{e.hash.slice(-6)} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {result.exists && history.length > 0 && (
            <div className="history-list" style={{ marginTop: '1rem' }}>
              {history.map((h, i) => {
                const parsed = parseDetails(h.details);
                const ts = new Date(Number(h.timestamp) * 1000).toLocaleString();
                return (
                  <div key={i} className="handoff-card">
                    <div className="stage-label">
                      {STAGE_LABELS[h.stage] ?? `Etapa ${h.stage}`}
                    </div>
                    <div className="meta">
                      Actor: {shortAddr(h.actor)} &nbsp;&middot;&nbsp; {ts}
                    </div>
                    {parsed ? (
                      <ul className="details-list">
                        {Object.entries(parsed).map(([k, v]) => (
                          <li key={k}>
                            <span className="key">{k}:</span> {v}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div style={{ fontSize: '0.88rem', color: '#374151' }}>
                        {h.details}
                      </div>
                    )}
                    <div style={{ marginTop: '0.35rem' }}>
                      Cadena de frio:{' '}
                      {h.coldChainOk ? (
                        <span className="cold-chain-ok">OK</span>
                      ) : (
                        <span className="cold-chain-fail">FALLA</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
