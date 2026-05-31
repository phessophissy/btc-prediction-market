export function computeFeeAwareBudget(balanceMicroStx: number, feeMicroStx: number): number {
  if (balanceMicroStx <= feeMicroStx) return 0;
  return balanceMicroStx - feeMicroStx;
}
