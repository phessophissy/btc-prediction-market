import type { Outcome } from './index';

export function groupBetsByOutcome(entries: Array<{ outcome: Outcome; amount: number }>): Record<Outcome, number> {
  return entries.reduce(
    (acc, entry) => {
      acc[entry.outcome] += entry.amount;
      return acc;
    },
    { 'outcome-a': 0, 'outcome-b': 0 } as Record<Outcome, number>
  );
}
