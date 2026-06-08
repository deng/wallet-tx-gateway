export function toLiteral(value: string, decimals: number | null): string {
  if (decimals == null || decimals === 0) return value;
  const bigValue = BigInt(value);
  const divisor = BigInt(10) ** BigInt(decimals);
  const intPart = bigValue / divisor;
  const fracPart = bigValue % divisor;
  if (fracPart === 0n) return intPart.toString();
  let frac = fracPart.toString().padStart(decimals, '0');
  frac = frac.replace(/0+$/, '');
  return `${intPart}.${frac}`;
}
