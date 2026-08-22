export function kes(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  return `${sign}KES ${Math.abs(amount).toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;
}

export function num(amount: number): string {
  return amount.toLocaleString("en-KE");
}

export function pct(value: number): string {
  return `${value}%`;
}
