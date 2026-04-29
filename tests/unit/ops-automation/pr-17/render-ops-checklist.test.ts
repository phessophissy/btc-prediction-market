import { describe, expect, it } from 'vitest';
import { renderOpsChecklist } from '../../../../tools/ops-automation/pr-17/render-ops-checklist';

describe('renderOpsChecklist', () => {
  it('renders markdown checklist lines', () => {
    const out = renderOpsChecklist(['fund wallets', 'place bets']);
    expect(out).toContain('- [ ] fund wallets');
    expect(out).toContain('- [ ] place bets');
  });
});
