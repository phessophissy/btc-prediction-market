import { MarketMetadata } from '../types';

const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 32;
const MAX_NOTE_LENGTH = 280;

export function validateMarketMetadata(meta: Partial<MarketMetadata>): string[] {
  const errors: string[] = [];
  if (meta.tags) {
    if (meta.tags.length > MAX_TAGS) {
      errors.push(`Too many tags: max ${MAX_TAGS}`);
    }
    for (const tag of meta.tags) {
      if (tag.length > MAX_TAG_LENGTH) {
        errors.push(`Tag too long: "${tag.slice(0, 20)}…"`);
      }
      if (!/^[a-z0-9-]+$/.test(tag)) {
        errors.push(`Invalid tag format: "${tag}"`);
      }
    }
  }
  if (meta.creatorNote && meta.creatorNote.length > MAX_NOTE_LENGTH) {
    errors.push(`Creator note exceeds ${MAX_NOTE_LENGTH} chars`);
  }
  if (meta.imageUrl && !/^https?:\/\//.test(meta.imageUrl)) {
    errors.push('imageUrl must be an absolute http(s) URL');
  }
  return errors;
}
