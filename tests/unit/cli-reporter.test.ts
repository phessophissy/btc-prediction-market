import { describe, it, expect } from 'vitest';
import {
  createReportingEngine,
  ReportingEngineHandler,
} from '../../cli/src/utils/reporter';

describe('cli reporter utility', () => {
  it('creates handler with sane normalized config', () => {
    const handler = createReportingEngine({ maxRetries: 0, timeoutMs: 0, threshold: -1 });
    const cfg = handler.getConfig();
    expect(cfg.maxRetries).toBe(1);
    expect(cfg.timeoutMs).toBe(100);
    expect(cfg.threshold).toBe(0);
  });

  it('process returns success for enabled handler', async () => {
    const handler = createReportingEngine({ enabled: true });
    const result = await handler.process({ value: 1 });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ value: 1 });
  });

  it('withRetry retries before succeeding', async () => {
    const handler = new ReportingEngineHandler({ enabled: true, threshold: 1, maxRetries: 3, timeoutMs: 1000 });
    let calls = 0;
    const out = await handler.withRetry(async () => {
      calls += 1;
      if (calls < 2) {
        throw new Error('fail once');
      }
      return 'ok';
    });
    expect(out).toBe('ok');
    expect(calls).toBe(2);
  });
});
