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
