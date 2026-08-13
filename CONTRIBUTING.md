# Contributing to Surevo SDK

Thank you for helping make private proof-of-reserves tooling easier to use across the Stellar ecosystem.

## Before you start

1. Read the issue completely.
2. Comment before beginning substantial work.
3. Wait for the maintainer to confirm the scope when multiple contributors are interested.
4. Ask questions if an acceptance criterion is unclear.

Keep contributions focused and avoid unrelated refactors.

## Development setup

```bash
git clone https://github.com/Surevo-labs/surevo-sdk.git
cd surevo-sdk
npm install
npm run build
npm test
```

## Branches

Use a short descriptive branch name such as `feat/short-description`.

Common prefixes are `feat/`, `fix/`, `docs/`, `test/` and `chore/`.

## Required checks

Before opening a pull request, run `npm run typecheck`, `npm test` and `npm run build`.

All checks must pass. Unit tests should use injected or mocked RPC readers unless an issue explicitly requests live integration testing.

## Pull requests

A pull request should:

- Solve one clearly defined problem
- Explain the developer benefit
- Include tests for new behavior
- Preserve strict TypeScript compilation
- Update documentation when the public API changes
- Reference the related issue when applicable
- Exclude private keys, secret seeds and private reserve data

## Compatibility

Public SDK code should work in Node.js and browsers where practical. Avoid Node-only globals such as `Buffer` in published source unless required by the feature.

## Contract alignment

Contract errors, storage keys and verifier behavior must match the authoritative [`surevo-core`](https://github.com/Surevo-labs/surevo-core) implementation.

## Security

Do not disclose vulnerabilities or sensitive issuer information in public issues. Follow [SECURITY.md](SECURITY.md).
