export {
  DEFAULT_TESTNET_RPC_URL,
  resolveConfig,
} from "./config.js";

export type {
  ResolvedSurevoConfig,
  SurevoConfig,
} from "./config.js";

export {
  getAttestationStatus,
  isVerified,
} from "./attestation.js";

export type {
  AttestationStatus,
  SurevoAttestation,
  SurevoGuarantees,
} from "./attestation.js";

export {
  DEFAULT_FRESHNESS_WINDOW,
  getLedgerAge,
  isAttestationFresh,
} from "./freshness.js";

export {
  SurevoVerifierError,
  VERIFIER_ERROR_NAMES,
  getVerifierErrorDetails,
  isVerifierErrorCode,
  parseVerifierError,
} from "./errors.js";

export type {
  VerifierErrorCode,
  VerifierErrorDetails,
  VerifierErrorName,
} from "./errors.js";

export { SurevoClient } from "./client.js";
