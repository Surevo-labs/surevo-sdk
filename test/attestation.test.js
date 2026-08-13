import assert from "node:assert/strict";
import test from "node:test";

import {
  getAttestationStatus,
  isVerified,
} from "../dist/index.js";

const passingGuarantees = {
  solvent: true,
  supplyMatched: true,
  fresh: true,
  unique: true,
};

test("verifies an attestation when all four guarantees pass", () => {
  assert.equal(isVerified(passingGuarantees), true);
  assert.equal(
    getAttestationStatus(passingGuarantees),
    "verified",
  );
});

for (const guarantee of Object.keys(passingGuarantees)) {
  test(`rejects an attestation when ${guarantee} fails`, () => {
    const guarantees = {
      ...passingGuarantees,
      [guarantee]: false,
    };

    assert.equal(isVerified(guarantees), false);
    assert.equal(
      getAttestationStatus(guarantees),
      "rejected",
    );
  });
}

test("does not mutate the supplied guarantee values", () => {
  const guarantees = { ...passingGuarantees };
  const original = { ...guarantees };

  isVerified(guarantees);

  assert.deepEqual(guarantees, original);
});
