import assert from "node:assert/strict";
import test from "node:test";

import {
  SurevoVerifierError,
  VERIFIER_ERROR_NAMES,
  getVerifierErrorDetails,
  isVerifierErrorCode,
  parseVerifierError,
} from "../dist/index.js";

const EXPECTED_ERRORS = [
  [1, "VkInvalidLength"],
  [2, "VkInvalidParameters"],
  [3, "ProofParseError"],
  [4, "VerificationFailed"],
  [5, "VkNotSet"],
  [6, "AlreadyInitialized"],
  [7, "SupplyMismatch"],
  [8, "PublicInputsMalformed"],
  [9, "ProofStale"],
  [10, "ProofFromFuture"],
  [11, "NullifierUsed"],
  [12, "InvalidRatio"],
];

test("matches every surevo-core verifier error code", () => {
  assert.deepEqual(
    Object.entries(VERIFIER_ERROR_NAMES).map(
      ([code, name]) => [Number(code), name],
    ),
    EXPECTED_ERRORS,
  );
});

for (const [code, name] of EXPECTED_ERRORS) {
  test(`maps contract error ${code} to ${name}`, () => {
    const details = getVerifierErrorDetails(code);

    assert.equal(details?.code, code);
    assert.equal(details?.name, name);
    assert.ok(details?.message);
    assert.equal(isVerifierErrorCode(code), true);
  });
}

test("parses a Soroban contract error string", () => {
  assert.deepEqual(
    parseVerifierError("Error(Contract, #11)"),
    {
      code: 11,
      name: "NullifierUsed",
      message: "The reserve nullifier has already been used.",
    },
  );
});

test("parses an Error instance containing contract context", () => {
  const parsed = parseVerifierError(
    new Error(
      "simulation failed: Error(Contract, #7)",
    ),
  );

  assert.equal(parsed?.name, "SupplyMismatch");
});

test("returns undefined for unknown contract errors", () => {
  assert.equal(
    parseVerifierError("Error(Contract, #99)"),
    undefined,
  );
  assert.equal(getVerifierErrorDetails(99), undefined);
  assert.equal(isVerifierErrorCode(99), false);
});

test("returns undefined for unrelated failures", () => {
  assert.equal(
    parseVerifierError("RPC connection failed"),
    undefined,
  );
});

test("creates a typed SDK error from Soroban output", () => {
  const error = SurevoVerifierError.from(
    "Error(Contract, #9)",
  );

  assert.ok(error instanceof SurevoVerifierError);
  assert.ok(error instanceof Error);
  assert.equal(error?.name, "SurevoVerifierError");
  assert.equal(error?.code, 9);
  assert.equal(error?.contractErrorName, "ProofStale");
  assert.equal(
    error?.message,
    "The proof is outside the accepted freshness window.",
  );
});

test("does not convert an unrelated error", () => {
  assert.equal(
    SurevoVerifierError.from(new Error("Network unavailable")),
    undefined,
  );
});
