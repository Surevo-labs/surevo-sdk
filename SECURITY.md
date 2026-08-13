# Security Policy

Surevo handles proof-of-reserves infrastructure. Security reports should be treated carefully.

## Report a vulnerability

Do not open a public GitHub issue for a suspected vulnerability.

Use GitHub private vulnerability reporting from the repository Security tab. Include:

- A clear description
- The affected SDK version or commit
- Reproduction steps or a minimal proof of concept
- The potential impact
- Any suggested mitigation

Avoid accessing real issuer secrets, reserve data or funds while investigating.

## Sensitive information

Never include the following in issues, pull requests, tests or logs:

- Stellar secret seeds
- Private keys
- Issuer reserve secrets
- Private witness data
- Real confidential reserve balances
- Credentials or access tokens

Use generated or clearly fictional test values.

## Security-sensitive areas

These include contract error interpretation, nullifier encoding, proof and public-input handling, transaction submission, verifier configuration and local proof-generation integration.
