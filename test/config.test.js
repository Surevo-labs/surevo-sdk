import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_TESTNET_RPC_URL,
  resolveConfig,
} from "../dist/index.js";

const VERIFIER_CONTRACT_ID =
  "CANB2JYQUTG6UTE2IDZ3EOT4SO62XOJ4HWBKL5A2IISUIFIBJBZX75FA";

test("applies Stellar testnet defaults", () => {
  const config = resolveConfig({
    verifierContractId: VERIFIER_CONTRACT_ID,
  });

  assert.equal(
    config.verifierContractId,
    VERIFIER_CONTRACT_ID,
  );
  assert.equal(config.rpcUrl, DEFAULT_TESTNET_RPC_URL);
  assert.equal(
    config.networkPassphrase,
    "Test SDF Network ; September 2015",
  );
});

test("preserves custom network configuration", () => {
  const config = resolveConfig({
    verifierContractId: VERIFIER_CONTRACT_ID,
    rpcUrl: "https://rpc.example.com",
    networkPassphrase: "Custom Surevo Network",
  });

  assert.equal(config.rpcUrl, "https://rpc.example.com");
  assert.equal(
    config.networkPassphrase,
    "Custom Surevo Network",
  );
});

test("rejects an invalid verifier contract ID", () => {
  assert.throws(
    () =>
      resolveConfig({
        verifierContractId: "not-a-contract",
      }),
    {
      message: "Invalid Surevo verifier contract ID",
    },
  );
});

test("rejects an invalid RPC URL", () => {
  assert.throws(
    () =>
      resolveConfig({
        verifierContractId: VERIFIER_CONTRACT_ID,
        rpcUrl: "not-a-url",
      }),
    {
      message: "Invalid Stellar RPC URL",
    },
  );
});

test("rejects a non-HTTP RPC URL", () => {
  assert.throws(
    () =>
      resolveConfig({
        verifierContractId: VERIFIER_CONTRACT_ID,
        rpcUrl: "ftp://rpc.example.com",
      }),
    {
      message: "Stellar RPC URL must use HTTP or HTTPS",
    },
  );
});
