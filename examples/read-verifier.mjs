import { SurevoClient } from "surevo-sdk";

const surevo = new SurevoClient({
  verifierContractId:
    "CANB2JYQUTG6UTE2IDZ3EOT4SO62XOJ4HWBKL5A2IISUIFIBJBZX75FA",
});

const nullifier = "00".repeat(32);

try {
  const latestLedger = await surevo.getLatestLedgerSequence();
  const verificationKey = await surevo.getVerificationKey();
  const nullifierUsed = await surevo.isNullifierUsed(nullifier);

  console.log("Surevo verifier testnet status");
  console.log(`Latest ledger: ${latestLedger}`);
  console.log(
    `Verification key byte length: ${verificationKey.length}`,
  );
  console.log(`Fictional nullifier used: ${nullifierUsed}`);
} catch (error) {
  console.error("Failed to read Surevo verifier from Stellar testnet.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}