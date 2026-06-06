import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { supplyCheckAbi } from './abi';

// Monad Testnet chain definition — RPC discipline: always testnet-rpc.monad.xyz
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: [import.meta.env.VITE_RPC_URL as string] },
  },
  blockExplorers: {
    default: { name: 'MonadScan', url: 'https://testnet.monadscan.com' },
  },
});

export const account = privateKeyToAccount(
  import.meta.env.VITE_DEMO_PK as `0x${string}`
);

export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
});

export const walletClient = createWalletClient({
  account,
  chain: monadTestnet,
  transport: http(),
});

export const CONTRACT_ADDRESS = import.meta.env
  .VITE_CONTRACT_ADDRESS as `0x${string}`;

export const EXPLORER_TX_BASE = 'https://testnet.monadscan.com/tx/';

// Stage enum mirrors SupplyCheck.sol enum Stage { Production=0, GlobalDistribution=1, LocalDistribution=2, FinalDelivery=3 }
export const Stage = {
  Production: 0,
  GlobalDistribution: 1,
  LocalDistribution: 2,
  FinalDelivery: 3,
} as const;

export const STAGE_LABELS: Record<number, string> = {
  0: 'Producción',
  1: 'Distribución mundial',
  2: 'Distribución local',
  3: 'Entrega final',
};

// Convenience config spread into read/write calls
export const supplyCheck = {
  address: CONTRACT_ADDRESS,
  abi: supplyCheckAbi,
} as const;
