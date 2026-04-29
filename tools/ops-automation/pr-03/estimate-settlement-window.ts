export function estimateSettlementWindow(settlementBlock: number, confirmationDepth = 6): number {
  return settlementBlock + confirmationDepth;
}
