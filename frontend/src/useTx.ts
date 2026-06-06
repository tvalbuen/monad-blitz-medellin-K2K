import { useState } from 'react';
import { supplyCheck, walletClient, publicClient, account, monadTestnet } from './contract';
import type { supplyCheckAbi } from './abi';
import type { ContractFunctionArgs } from 'viem';

type AbiType = typeof supplyCheckAbi;

type WriteFunctionName = 'registerBatch' | 'transferCustody';

export type TxStatus = 'idle' | 'pending' | 'confirmed' | 'error';

export interface TxState {
  status: TxStatus;
  hash: `0x${string}` | null;
  error: string | null;
}

export interface UseTxResult extends TxState {
  run: (
    functionName: WriteFunctionName,
    args: ContractFunctionArgs<AbiType, 'nonpayable', WriteFunctionName>
  ) => Promise<`0x${string}` | null>;
}

export function useTx(): UseTxResult {
  const [state, setState] = useState<TxState>({
    status: 'idle',
    hash: null,
    error: null,
  });

  async function run(
    functionName: WriteFunctionName,
    args: ContractFunctionArgs<AbiType, 'nonpayable', WriteFunctionName>
  ): Promise<`0x${string}` | null> {
    setState({ status: 'pending', hash: null, error: null });
    try {
      const hash = await walletClient.writeContract({
        ...supplyCheck,
        functionName,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        args: args as any,
        chain: monadTestnet,
        account,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      setState({ status: 'confirmed', hash, error: null });
      return hash;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setState({ status: 'error', hash: null, error: message });
      return null;
    }
  }

  return { ...state, run };
}
