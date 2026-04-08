export type OutcomeLetter = 'A' | 'B' | 'C' | 'D';
export type OutcomeFlag = 1 | 2 | 4 | 8;

const FLAG_TO_LETTER: Record<OutcomeFlag, OutcomeLetter> = {
  1: 'A',
  2: 'B',
  4: 'C',
  8: 'D',
};

const LETTER_TO_FLAG: Record<OutcomeLetter, OutcomeFlag> = {
  A: 1,
  B: 2,
  C: 4,
  D: 8,
};

export function outcomeToLetter(flag: OutcomeFlag): OutcomeLetter {
  return FLAG_TO_LETTER[flag];
}

export function letterToOutcome(letter: OutcomeLetter): OutcomeFlag {
  return LETTER_TO_FLAG[letter];
}

export function getActiveOutcomes(possibleOutcomes: number): OutcomeLetter[] {
  const outcomes: OutcomeLetter[] = [];
  if (possibleOutcomes & 1) outcomes.push('A');
  if (possibleOutcomes & 2) outcomes.push('B');
  if (possibleOutcomes & 4) outcomes.push('C');
  if (possibleOutcomes & 8) outcomes.push('D');
  return outcomes;
}
