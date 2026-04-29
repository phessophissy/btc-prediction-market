export function buildRetryCandidates<T extends { status: 'ok' | 'failed' }>(items: T[]): T[] {
  return items.filter((item) => item.status === 'failed');
}
