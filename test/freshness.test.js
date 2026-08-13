import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_FRESHNESS_WINDOW,
  getLedgerAge,
  isAttestationFresh,
} from "../dist/index.js";

test("uses the verifier's 100-ledger freshness window", () => {
  assert.equal(DEFAULT_FRESHNESS_WINDOW, 100);
});

test("calculates an attestation's ledger age", () => {
  assert.equal(getLedgerAge(1_000, 1_025), 25);
});

test("accepts an attestation from the current ledger", () => {
  assert.equal(isAttestationFresh(1_000, 1_000), true);
});

test("accepts the final ledger inside the freshness window", () => {
  assert.equal(isAttestationFresh(1_000, 1_100), true);
});

test("rejects the first ledger outside the freshness window", () => {
  assert.equal(isAttestationFresh(1_000, 1_101), false);
});

test("rejects an attestation from a future ledger", () => {
  assert.equal(isAttestationFresh(1_001, 1_000), false);
});

test("supports a custom freshness window", () => {
  assert.equal(isAttestationFresh(1_000, 1_050, 50), true);
  assert.equal(isAttestationFresh(1_000, 1_051, 50), false);
});

test("rejects invalid ledger values", () => {
  assert.throws(
    () => getLedgerAge(-1, 1_000),
    /Attestation ledger must be a non-negative safe integer/,
  );

  assert.throws(
    () => isAttestationFresh(1_000, 1.5),
    /Current ledger must be a non-negative safe integer/,
  );
});
