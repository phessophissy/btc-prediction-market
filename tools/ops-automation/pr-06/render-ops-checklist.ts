export function renderOpsChecklist(items: string[]): string {
  return items.map((item) => `- [ ] ${item}`).join('\n');
}
