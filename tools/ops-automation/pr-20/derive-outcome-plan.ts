import type { Outcome } from './index';

export function deriveOutcomePlan(size: number): Outcome[] {
  return Array.from({ length: size }, (_, i) => (i % 2 === 0 ? 'outcome-a' : 'outcome-b'));
}
