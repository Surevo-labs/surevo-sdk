import { Networks, StrKey } from "@stellar/stellar-sdk";

export const DEFAULT_TESTNET_RPC_URL =
  "https://soroban-testnet.stellar.org";

export interface SurevoConfig {
  verifierContractId: string;
  rpcUrl?: string;
  networkPassphrase?: string;
}

export interface ResolvedSurevoConfig {
  verifierContractId: string;
  rpcUrl: string;
  networkPassphrase: string;
}

export function resolveConfig(
  config: SurevoConfig,
): ResolvedSurevoConfig {
  if (!StrKey.isValidContract(config.verifierContractId)) {
    throw new Error("Invalid Surevo verifier contract ID");
  }

  const rpcUrl = config.rpcUrl ?? DEFAULT_TESTNET_RPC_URL;

  let parsedRpcUrl: URL;

  try {
    parsedRpcUrl = new URL(rpcUrl);
  } catch {
    throw new Error("Invalid Stellar RPC URL");
  }

  if (
    parsedRpcUrl.protocol !== "https:" &&
    parsedRpcUrl.protocol !== "http:"
  ) {
    throw new Error("Stellar RPC URL must use HTTP or HTTPS");
  }

  return {
    verifierContractId: config.verifierContractId,
    rpcUrl,
    networkPassphrase:
      config.networkPassphrase ?? Networks.TESTNET,
  };
}
