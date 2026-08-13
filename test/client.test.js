import assert from "node:assert/strict";
import test from "node:test";

import { xdr } from "@stellar/stellar-sdk";

import { SurevoClient } from "../dist/index.js";

const VERIFIER_CONTRACT_ID =
  "CANB2JYQUTG6UTE2IDZ3EOT4SO62XOJ4HWBKL5A2IISUIFIBJBZX75FA";

const NULLIFIER = "ab".repeat(32);

function createServer(overrides = {}) {
  return {
    async getContractInstance() {
      return new xdr.ScContractInstance({
        executable:
          xdr.ContractExecutable.contractExecutableWasm(
            Buffer.alloc(32),
          ),
        storage: [
          new xdr.ScMapEntry({
            key: xdr.ScVal.scvSymbol("vk"),
            val: xdr.ScVal.scvBytes(
              Buffer.from([1, 2, 3, 4]),
            ),
          }),
        ],
      });
    },

    async getContractData() {
      return {};
    },

    async getLatestLedger() {
      return { sequence: 123_456 };
    },

    ...overrides,
  };
}

function createClient(server) {
  return new SurevoClient(
    {
      verifierContractId: VERIFIER_CONTRACT_ID,
    },
    server,
  );
}

test("reads the verifier verification key", async () => {
  const client = createClient(createServer());

  const verificationKey =
    await client.getVerificationKey();

  assert.deepEqual(
    Array.from(verificationKey),
    [1, 2, 3, 4],
  );
});

test("reports a recorded nullifier as used", async () => {
  let receivedContractId;
  let receivedKey;

  const server = createServer({
    async getContractData(contractId, key) {
      receivedContractId = contractId;
      receivedKey = key;
      return {};
    },
  });

  const used =
    await createClient(server).isNullifierUsed(NULLIFIER);

  assert.equal(used, true);
  assert.equal(receivedContractId, VERIFIER_CONTRACT_ID);

  const parts = receivedKey.vec();
  assert.equal(parts?.[0]?.sym().toString(), "nf");
  assert.equal(
    Buffer.from(parts?.[1]?.bytes() ?? []).toString("hex"),
    NULLIFIER,
  );
});

test("reports an absent nullifier as unused", async () => {
  const server = createServer({
    async getContractData() {
      throw {
        code: 404,
        message: "Contract data not found",
      };
    },
  });

  const used =
    await createClient(server).isNullifierUsed(NULLIFIER);

  assert.equal(used, false);
});

test("preserves unexpected RPC errors", async () => {
  const rpcError = new Error("RPC unavailable");

  const server = createServer({
    async getContractData() {
      throw rpcError;
    },
  });

  await assert.rejects(
    createClient(server).isNullifierUsed(NULLIFIER),
    (error) => error === rpcError,
  );
});

test("rejects malformed nullifiers before RPC", async () => {
  let called = false;

  const server = createServer({
    async getContractData() {
      called = true;
      return {};
    },
  });

  await assert.rejects(
    createClient(server).isNullifierUsed("not-hex"),
    {
      message:
        "Nullifier must be a 32-byte hexadecimal string",
    },
  );

  assert.equal(called, false);
});

test("reads the latest ledger sequence", async () => {
  const sequence =
    await createClient(
      createServer(),
    ).getLatestLedgerSequence();

  assert.equal(sequence, 123_456);
});

test("rejects a missing verification key", async () => {
  const server = createServer({
    async getContractInstance() {
      return new xdr.ScContractInstance({
        executable:
          xdr.ContractExecutable.contractExecutableWasm(
            Buffer.alloc(32),
          ),
        storage: [],
      });
    },
  });

  await assert.rejects(
    createClient(server).getVerificationKey(),
    {
      message:
        "Surevo verifier verification key is not set",
    },
  );
});

test("rejects a malformed verification key", async () => {
  const server = createServer({
    async getContractInstance() {
      return new xdr.ScContractInstance({
        executable:
          xdr.ContractExecutable.contractExecutableWasm(
            Buffer.alloc(32),
          ),
        storage: [
          new xdr.ScMapEntry({
            key: xdr.ScVal.scvSymbol("vk"),
            val: xdr.ScVal.scvU32(123),
          }),
        ],
      });
    },
  });

  await assert.rejects(
    createClient(server).getVerificationKey(),
    {
      message:
        "Surevo verifier verification key is malformed",
    },
  );
});
