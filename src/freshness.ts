export const DEFAULT_FRESHNESS_WINDOW = 100;

function assertLedgerSequence(
  value: number,
  name: string,
): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(
      `${name} must be a non-negative safe integer`,
    );
  }
}

/**
 * Calculates how many ledgers have closed since an attestation.
 */
export function getLedgerAge(
  attestationLedger: number,
  currentLedger: number,
): number {
  assertLedgerSequence(
    attestationLedger,
    "Attestation ledger",
  );
  assertLedgerSequence(currentLedger, "Current ledger");

  return currentLedger - attestationLedger;
}

/**
 * Determines whether an attestation is within its validity window.
 */
export function isAttestationFresh(
  attestationLedger: number,
  currentLedger: number,
  freshnessWindow = DEFAULT_FRESHNESS_WINDOW,
): boolean {
  assertLedgerSequence(freshnessWindow, "Freshness window");

  const age = getLedgerAge(
    attestationLedger,
    currentLedger,
  );

  return age >= 0 && age <= freshnessWindow;
}
