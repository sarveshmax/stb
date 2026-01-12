export function toRawAmount(amountStr: string, decimals: number): bigint {
  const [whole, frac = ""] = amountStr.split(".");
  if (frac.length > decimals) {
    throw new Error(`Too many decimal places`);
  }

  const fracPadded = frac.padEnd(decimals, "0");
  const raw = whole + fracPadded;

  // remove leading zeros but prevent empty string
  const normalized = raw.replace(/^0+/, "") || "0";

  return BigInt(normalized);
}

export function decimalStringToBigInt(balanceStr: string, decimals: number): bigint {
  if (!balanceStr.includes(".")) {
    return BigInt(balanceStr) * BigInt(10 ** decimals);
  }

  const [whole, fraction] = balanceStr.split(".");

  // remove trailing zeros
  const cleanFraction = fraction.replace(/0+$/, "");

  if (cleanFraction.length > decimals) {
    // too many digits - truncate
    const trimmed = cleanFraction.slice(0, decimals);
    return BigInt(whole || "0") * BigInt(10 ** decimals) + BigInt(trimmed.padEnd(decimals, "0"));
  }

  // pad right side with zeros to reach decimals
  const paddedFraction = cleanFraction.padEnd(decimals, "0");

  return BigInt(whole || "0") * BigInt(10 ** decimals) + BigInt(paddedFraction || "0");
}

export function formatNumberWithCommas(balanceString: string) {
  try {
    const [intPart, decPart] = balanceString.split(".");
    const formattedInt = Number(intPart).toLocaleString();

    return decPart ? `${formattedInt}.${decPart}` : formattedInt;
  } catch {
    return "0";
  }
}

export function formatToUSD(value: number) {
  if (value === 0) return 0;

  if (value < 0.01) {
    return Number(value.toPrecision(2));
  }
  return Math.round(value * 100) / 100;
}
