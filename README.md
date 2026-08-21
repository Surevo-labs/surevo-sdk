# Surevo SDK

**Integrate proof of reserves into Stellar applications.**

TypeScript tools for reading and interpreting Surevo zero knowledge proof-of-reserves attestations on Stellar.

[Surevo Core](https://github.com/Surevo-labs/surevo-core) · [Live App](https://surevo.netlify.app/) · [Verifier on Explorer](https://stellar.expert/explorer/testnet/contract/CANB2JYQUTG6UTE2IDZ3EOT4SO62XOJ4HWBKL5A2IISUIFIBJBZX75FA)

`TypeScript` · `Stellar` · `Soroban` · `Zero knowledge proof of reserves`

## What this SDK provides

- Validated Stellar network configuration
- A typed model for Surevo’s four guarantees
- Attestation freshness utilities
- Readable mappings for all verifier contract errors
- Soroban RPC access to public verifier state
- Browser-compatible public APIs

## Surevo’s four guarantees

A Surevo attestation is verified only when all four guarantees pass:

| Guarantee | Meaning |
| --- | --- |
| Solvency | Hidden reserves cover the issued supply at the required ratio |
| Real liabilities | Proven supply matches the token contract’s actual total supply |
| Freshness | The proof remains within the accepted ledger window |
| Uniqueness | The reserve nullifier has not already been used |

## Install for development

```bash
git clone https://github.com/Surevo-labs/surevo-sdk.git
cd surevo-sdk
npm install
npm run build
```

## Quick start

```ts
import { SurevoClient } from "surevo-sdk";

const surevo = new SurevoClient({
  verifierContractId:
    "CANB2JYQUTG6UTE2IDZ3EOT4SO62XOJ4HWBKL5A2IISUIFIBJBZX75FA",
});

const currentLedger =
  await surevo.getLatestLedgerSequence();

const verificationKey =
  await surevo.getVerificationKey();

const nullifierUsed =
  await surevo.isNullifierUsed(
    "ab".repeat(32),
  );

console.log({
  currentLedger,
  verificationKeyBytes: verificationKey.length,
  nullifierUsed,
});
```

The default configuration uses Stellar testnet. Custom RPC URLs and network passphrases can be supplied when creating the client.

## Run the Stellar testnet example

The SDK includes a complete example that reads public state from the deployed Surevo verifier on Stellar testnet.

```bash
npm run example:testnet
```

The example uses the public `SurevoClient` API and prints:

* The latest Stellar testnet ledger
* The verifier verification-key byte length
* Whether a fictional 32-byte nullifier has already been used

No secret key, seed phrase, or private reserve data is required.

The example source is available at `examples/read-verifier.mjs`.


## Attestation status

```ts
import {
  getAttestationStatus,
  isVerified,
} from "surevo-sdk";

const guarantees = {
  solvent: true,
  supplyMatched: true,
  fresh: true,
  unique: true,
};

console.log(isVerified(guarantees));
// true

console.log(getAttestationStatus(guarantees));
// "verified"
```

## Freshness

Surevo proofs use a default validity window of 100 ledgers.

```ts
import {
  getLedgerAge,
  isAttestationFresh,
} from "surevo-sdk";

const age = getLedgerAge(1_000, 1_025);
const fresh = isAttestationFresh(1_000, 1_025);

console.log({ age, fresh });
// { age: 25, fresh: true }
```

## Verifier errors

The SDK maps all 12 `surevo-core` contract errors into typed, readable results.

```ts
import {
  SurevoVerifierError,
  parseVerifierError,
} from "surevo-sdk";

const details = parseVerifierError(
  "Error(Contract, #11)",
);

console.log(details);
// {
//   code: 11,
//   name: "NullifierUsed",
//   message: "The reserve nullifier has already been used."
// }

const error = SurevoVerifierError.from(
  "Error(Contract, #9)",
);

console.log(error?.contractErrorName);
// "ProofStale"
```

## Public API

| Export | Purpose |
| --- | --- |
| `SurevoClient` | Read public state from the Surevo verifier |
| `resolveConfig` | Validate and resolve Stellar configuration |
| `isVerified` | Check whether all four guarantees passed |
| `getAttestationStatus` | Derive `verified` or `rejected` |
| `getLedgerAge` | Calculate an attestation’s age |
| `isAttestationFresh` | Check the ledger freshness window |
| `parseVerifierError` | Decode Soroban contract errors |
| `SurevoVerifierError` | Represent a typed verifier failure |

## Development

```bash
npm run typecheck
npm test
npm run build
```

The unit test suite uses mocked RPC readers and makes no live network requests.

## Architecture

`surevo-sdk` is the integration layer for [`surevo-core`](https://github.com/Surevo-labs/surevo-core), which contains the Noir solvency circuit, Soroban verifier, reference issuer token and public testnet deployment.

Private reserve balances and reserve secrets remain on the issuer’s machine. The SDK works with public verifier configuration, proofs, public inputs and on-chain results.

## Security

Never place issuer reserve secrets, private keys or secret seeds in SDK configuration, source control or client-side applications.

Please report security vulnerabilities privately rather than opening a public issue.

## License

MIT
