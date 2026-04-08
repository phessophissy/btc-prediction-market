export const MICROSTX_PER_STX = 1_000_000;

export function microStxToStx(microStx: number): number {
  return microStx / MICROSTX_PER_STX;
}

export function stxToMicroStx(stx: number): number {
  return Math.round(stx * MICROSTX_PER_STX);
}
