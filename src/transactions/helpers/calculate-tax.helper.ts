export function calculateTax(percentage: number, amount: string): string {
  return String(((Number(amount) * percentage) / 100).toFixed(2));
}
