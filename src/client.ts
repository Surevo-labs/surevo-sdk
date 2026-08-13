import { rpc, xdr } from "@stellar/stellar-sdk";

import {
  resolveConfig,
  type ResolvedSurevoConfig,
  type SurevoConfig,
} from "./config.js";

type SurevoRpcReader = Pick<
  rpc.Server,
  | "getContractData"
  | "getContractInstance"
  | "getLatestLedger"
>;

function isNotFoundError(
  value: unknown,
): value is { code: number } {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    value.code === 404
  );
}

function hexToBytes(hex: string): Uint8Array {
  return Uint8Array.from(
    hex.match(/../g) ?? [],
    (byte) => Number.parseInt(byte, 16),
  );
}

function createNullifierKey(
  nullifier: string,
): xdr.ScVal {
  if (!/^[0-9a-fA-F]{64}$/.test(nullifier)) {
    throw new Error(
      "Nullifier must be a 32-byte hexadecimal string",
    );
  }

  return xdr.ScVal.scvVec([
    xdr.ScVal.scvSymbol("nf"),
    xdr.ScVal.scvBytes(
      hexToBytes(nullifier),
    ),
  ]);
}

export class SurevoClient {
  readonly config: ResolvedSurevoConfig;
  readonly #server: SurevoRpcReader;

  constructor(
    config: SurevoConfig,
    server?: SurevoRpcReader,
  ) {
    this.config = resolveConfig(config);

    const allowHttp =
      new URL(this.config.rpcUrl).protocol === "http:";

    this.#server =
      server ??
      new rpc.Server(this.config.rpcUrl, {
        allowHttp,
      });
  }

  /**
   * Reads the verifier's public verification key.
   */
  async getVerificationKey(): Promise<Uint8Array> {
    const instance =
      await this.#server.getContractInstance(
        this.config.verifierContractId,
      );

    const storage = instance.storage() ?? [];
    const expectedKey =
      xdr.ScVal.scvSymbol("vk").toXDR("hex");

    const entry = storage.find(
      (storageEntry) =>
        storageEntry.key().toXDR("hex") === expectedKey,
    );

    if (!entry) {
      throw new Error(
        "Surevo verifier verification key is not set",
      );
    }

    const value = entry.val();

    if (value.switch() !== xdr.ScValType.scvBytes()) {
      throw new Error(
        "Surevo verifier verification key is malformed",
      );
    }

    return new Uint8Array(value.bytes());
  }

  /**
   * Checks whether a reserve nullifier is already recorded.
   */
  async isNullifierUsed(
    nullifier: string,
  ): Promise<boolean> {
    const key = createNullifierKey(nullifier);

    try {
      await this.#server.getContractData(
        this.config.verifierContractId,
        key,
        rpc.Durability.Persistent,
      );

      return true;
    } catch (error) {
      if (isNotFoundError(error)) {
        return false;
      }

      throw error;
    }
  }

  /**
   * Returns the latest ledger sequence known to the RPC server.
   */
  async getLatestLedgerSequence(): Promise<number> {
    const ledger =
      await this.#server.getLatestLedger();

    return ledger.sequence;
  }
}
