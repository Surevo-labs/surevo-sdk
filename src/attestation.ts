/**
 * The four guarantees enforced by the Surevo verifier contract.
 */
export interface SurevoGuarantees {
  /**
   * Hidden reserves cover the issued supply at the required ratio.
   */
  solvent: boolean;

  /**
   * The proof's issued supply matches the token contract's total supply.
   */
  supplyMatched: boolean;

  /**
   * The proof remains within the verifier's accepted ledger window.
   */
  fresh: boolean;

  /**
   * The reserve nullifier has not previously been used.
   */
  unique: boolean;
}

/**
 * Public information associated with a Surevo attestation.
 *
 * Private reserve balances, wallet addresses and reserve secrets are
 * intentionally excluded.
 */
export interface SurevoAttestation {
  issuer: string;
  tokenContractId: string;
  verifierContractId: string;
  ledgerSequence: number;
  nullifier: string;
  transactionHash?: string;
  guarantees: SurevoGuarantees;
}

/**
 * The overall result derived from the four verifier guarantees.
 */
export type AttestationStatus = "verified" | "rejected";

/**
 * Returns true only when every Surevo guarantee passed.
 */
export function isVerified(
  guarantees: SurevoGuarantees,
): boolean {
  return (
    guarantees.solvent &&
    guarantees.supplyMatched &&
    guarantees.fresh &&
    guarantees.unique
  );
}

/**
 * Derives a simple public status from the four guarantees.
 */
export function getAttestationStatus(
  guarantees: SurevoGuarantees,
): AttestationStatus {
  return isVerified(guarantees) ? "verified" : "rejected";
}
