export function summarizeFailures(messages: string[]): Record<string, number> {
  return messages.reduce<Record<string, number>>((acc, message) => {
    const key = message.includes('rate limit') ? 'rate-limit' : 'other';
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}
