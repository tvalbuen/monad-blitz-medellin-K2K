export const supplyCheckAbi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "batchId",
        "type": "string"
      }
    ],
    "name": "BatchAlreadyExists",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "batchId",
        "type": "string"
      }
    ],
    "name": "BatchNotFound",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "batchId",
        "type": "string"
      }
    ],
    "name": "ChainComplete",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "enum SupplyCheck.Stage",
        "name": "expected",
        "type": "uint8"
      },
      {
        "internalType": "enum SupplyCheck.Stage",
        "name": "got",
        "type": "uint8"
      }
    ],
    "name": "InvalidStageTransition",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "batchId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "enum SupplyCheck.Stage",
        "name": "stage",
        "type": "uint8"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "actor",
        "type": "address"
      }
    ],
    "name": "BatchCompromised",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "batchId",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "manufacturer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "productName",
        "type": "string"
      }
    ],
    "name": "BatchRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "batchId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "enum SupplyCheck.Stage",
        "name": "stage",
        "type": "uint8"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "actor",
        "type": "address"
      }
    ],
    "name": "CustodyTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "batchId",
        "type": "string"
      }
    ],
    "name": "getBatchHistory",
    "outputs": [
      {
        "components": [
          {
            "internalType": "enum SupplyCheck.Stage",
            "name": "stage",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "actor",
            "type": "address"
          },
          {
            "internalType": "uint64",
            "name": "timestamp",
            "type": "uint64"
          },
          {
            "internalType": "string",
            "name": "details",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "coldChainOk",
            "type": "bool"
          }
        ],
        "internalType": "struct SupplyCheck.Handoff[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "batchId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "productName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "details",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "coldChainOk",
        "type": "bool"
      }
    ],
    "name": "registerBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "batchId",
        "type": "string"
      },
      {
        "internalType": "enum SupplyCheck.Stage",
        "name": "stage",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "details",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "coldChainOk",
        "type": "bool"
      }
    ],
    "name": "transferCustody",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "batchId",
        "type": "string"
      }
    ],
    "name": "verifyBatch",
    "outputs": [
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "authentic",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "compromised",
        "type": "bool"
      },
      {
        "internalType": "enum SupplyCheck.Stage",
        "name": "currentStage",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "manufacturer",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
