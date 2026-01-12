import { Connection } from "@solana/web3.js";

export async function waitForConfirmation(
  connection: Connection,
  signature: string,
  commitment: "processed" | "confirmed" | "finalized" = "confirmed",
) {
  for (;;) {
    const res = await connection.getSignatureStatuses([signature]);
    const status = res.value[0];

    if (!status) {
      // not found yet, wait and retry
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }

    if (status.err) {
      throw new Error("Transaction failed: " + JSON.stringify(status.err));
    }

    // confirmationStatus can be "processed" | "confirmed" | "finalized"
    if (
      status.confirmationStatus === commitment ||
      (commitment === "confirmed" && status.confirmationStatus === "finalized")
    ) {
      return status;
    }

    await new Promise((r) => setTimeout(r, 1000));
  }
}

export function withTimeout<T>(promise: Promise<T>, ms: number, fallbackValue: T): Promise<T> {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve(fallbackValue), ms);

    promise
      .then((v) => {
        clearTimeout(t);
        resolve(v);
      })
      .catch(() => {
        clearTimeout(t);
        resolve(fallbackValue);
      });
  });
}
