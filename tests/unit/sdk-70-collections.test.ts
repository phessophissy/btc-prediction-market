import { describe, it, expect } from 'vitest';

// clarity value parsing - collection tests (PR 70)

function filterActive<T extends { active: boolean }>(items: T[]): T[] {
  return items.filter(i => i.active);
}

function sortByField<T>(items: T[], field: keyof T, desc = false): T[] {
  return [...items].sort((a, b) => {
    const va = a[field], vb = b[field];
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return desc ? -cmp : cmp;
  });
}

describe('clarity value parsing - filtering', () => {
  it('filters active items', () => {
    const items = [{ id: 70, active: true }, { id: 71, active: false }];
    expect(filterActive(items)).toHaveLength(1);
  });
  it('returns empty for empty input', () => expect(filterActive([])).toEqual([]));
  it('returns empty when none active', () => {
    expect(filterActive([{ id: 1, active: false }])).toEqual([]);
  });
});

describe('clarity value parsing - sorting', () => {
  it('sorts ascending by default', () => {
    const items = [{ id: 3 }, { id: 1 }, { id: 2 }];
    expect(sortByField(items, 'id')[0].id).toBe(1);
  });
  it('sorts descending', () => {
    const items = [{ id: 1 }, { id: 3 }, { id: 2 }];
    expect(sortByField(items, 'id', true)[0].id).toBe(3);
  });
});
