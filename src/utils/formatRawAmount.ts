//FOR MAX BUTTON
export function formatRawAmount(rawAmount: bigint, decimals: number) {
  if (decimals === 0) return rawAmount.toString();

  const base = BigInt(10 ** decimals);
  const integer = rawAmount / base;
  const fraction = rawAmount % base;

  if (fraction === 0n) return integer.toString();

  const padded = fraction.toString().padStart(decimals, "0");
  return `${integer}.${padded}`;
}
