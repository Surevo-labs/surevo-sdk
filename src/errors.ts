export const VERIFIER_ERROR_NAMES = {
  1: "VkInvalidLength",
  2: "VkInvalidParameters",
  3: "ProofParseError",
  4: "VerificationFailed",
  5: "VkNotSet",
  6: "AlreadyInitialized",
  7: "SupplyMismatch",
  8: "PublicInputsMalformed",
  9: "ProofStale",
  10: "ProofFromFuture",
  11: "NullifierUsed",
  12: "InvalidRatio",
} as const;

export type VerifierErrorCode =
  keyof typeof VERIFIER_ERROR_NAMES;

export type VerifierErrorName =
  (typeof VERIFIER_ERROR_NAMES)[VerifierErrorCode];

export interface VerifierErrorDetails {
  code: VerifierErrorCode;
  name: VerifierErrorName;
  message: string;
}

const VERIFIER_ERROR_MESSAGES: Record<
  VerifierErrorCode,
  string
> = {
  1: "The verification key has an invalid length.",
  2: "The verification key contains invalid parameters.",
  3: "The proof could not be parsed.",
  4: "The zero knowledge proof verification failed.",
  5: "The verifier has not been initialized with a verification key.",
  6: "The verifier has already been initialized.",
  7: "The proven issued supply does not match the token contract.",
  8: "The proof public inputs are malformed.",
  9: "The proof is outside the accepted freshness window.",
  10: "The proof references a future ledger.",
  11: "The reserve nullifier has already been used.",
  12: "The reserve ratio is invalid.",
};

export function isVerifierErrorCode(
  code: number,
): code is VerifierErrorCode {
  return Object.hasOwn(VERIFIER_ERROR_NAMES, code);
}

export function getVerifierErrorDetails(
  code: number,
): VerifierErrorDetails | undefined {
  if (!isVerifierErrorCode(code)) {
    return undefined;
  }

  return {
    code,
    name: VERIFIER_ERROR_NAMES[code],
    message: VERIFIER_ERROR_MESSAGES[code],
  };
}

/**
 * Extracts a Surevo contract error from Soroban's
 * `Error(Contract, #N)` representation.
 */
export function parseVerifierError(
  value: unknown,
): VerifierErrorDetails | undefined {
  const text =
    value instanceof Error ? value.message : String(value);

  const match = /Error\(Contract,\s*#(\d+)\)/.exec(text);

  if (!match?.[1]) {
    return undefined;
  }

  return getVerifierErrorDetails(Number(match[1]));
}

export class SurevoVerifierError extends Error {
  readonly code: VerifierErrorCode;
  readonly contractErrorName: VerifierErrorName;

  constructor(details: VerifierErrorDetails) {
    super(details.message);
    this.name = "SurevoVerifierError";
    this.code = details.code;
    this.contractErrorName = details.name;
  }

  static from(value: unknown): SurevoVerifierError | undefined {
    const details = parseVerifierError(value);

    return details
      ? new SurevoVerifierError(details)
      : undefined;
  }
}
