/**
 * Unit tests for src/node/improvements/ -- the shared utility module
 * introduced by the SURFS replication study (2026-06-30).
 *
 * All tests run offline (no network, no database, no server startup).
 */
import {describe, it, expect} from 'vitest';
import {SYSTEM_AUTHOR_ID} from '../../../node/improvements/constants';
import {
  HEX_COLOR_RE, isValidHexColor, isInt, checkValidRev, assertRevInRange,
} from '../../../node/improvements/validators';
import {safeDecodeURIComponent} from '../../../node/improvements/sanitizers';
import * as barrel from '../../../node/improvements/index';

// ── constants ──────────────────────────────────────────────────────────────
describe('improvements/constants', () => {
  it('SYSTEM_AUTHOR_ID is a non-empty string starting with a.', () => {
    expect(typeof SYSTEM_AUTHOR_ID).toBe('string');
    expect(SYSTEM_AUTHOR_ID.length).toBeGreaterThan(0);
    expect(SYSTEM_AUTHOR_ID.startsWith('a.')).toBe(true);
  });
  it('SYSTEM_AUTHOR_ID equals canonical value', () => {
    expect(SYSTEM_AUTHOR_ID).toBe('a.etherpad-system');
  });
});

// ── validators/isInt ───────────────────────────────────────────────────────
describe('improvements/validators -- isInt', () => {
  it('returns true for integers', () => {
    expect(isInt(0)).toBe(true);
    expect(isInt(1)).toBe(true);
    expect(isInt(1000000)).toBe(true);
  });
  it('returns false for floats', () => {
    expect(isInt(1.5)).toBe(false);
    expect(isInt(0.1)).toBe(false);
  });
  it('returns false for NaN', () => {
    expect(isInt(NaN)).toBe(false);
  });
});

// ── validators/checkValidRev ───────────────────────────────────────────────
describe('improvements/validators -- checkValidRev', () => {
  it('returns valid integer rev unchanged', () => {
    expect(checkValidRev(0)).toBe(0);
    expect(checkValidRev(999)).toBe(999);
  });
  it('parses numeric string', () => {
    expect(checkValidRev('42')).toBe(42);
  });
  it('throws for NaN input', () => {
    expect(() => checkValidRev('abc')).toThrow(/not a number/);
  });
  it('throws for negative rev', () => {
    expect(() => checkValidRev(-1)).toThrow(/negative/);
    expect(() => checkValidRev('-5')).toThrow(/negative/);
  });
  it('throws for float rev', () => {
    expect(() => checkValidRev(1.5)).toThrow(/float/);
  });
  it('error name is apierror', () => {
    try { checkValidRev(-1); expect.fail('should throw'); }
    catch (e: any) { expect(e.name).toBe('apierror'); }
  });
});

// ── validators/assertRevInRange ────────────────────────────────────────────
describe('improvements/validators -- assertRevInRange', () => {
  it('does not throw when rev <= headRev', () => {
    expect(() => assertRevInRange(5, 5)).not.toThrow();
    expect(() => assertRevInRange(0, 100)).not.toThrow();
  });
  it('throws when rev > headRev', () => {
    expect(() => assertRevInRange(10, 5)).toThrow(/head revision/);
  });
  it('error name is apierror', () => {
    try { assertRevInRange(100, 50); expect.fail('should throw'); }
    catch (e: any) { expect(e.name).toBe('apierror'); }
  });
});

// ── validators/isValidHexColor ────────────────────────────────────────────
describe('improvements/validators -- isValidHexColor and HEX_COLOR_RE', () => {
  it('accepts valid 6-digit hex colours', () => {
    expect(isValidHexColor('#FFFFFF')).toBe(true);
    expect(isValidHexColor('#000000')).toBe(true);
    expect(isValidHexColor('#aAbBcC')).toBe(true);
  });
  it('accepts valid 3-digit hex colours', () => {
    expect(isValidHexColor('#FFF')).toBe(true);
    expect(isValidHexColor('#abc')).toBe(true);
  });
  it('rejects strings without leading #', () => {
    expect(isValidHexColor('FFFFFF')).toBe(false);
  });
  it('rejects wrong-length hex strings', () => {
    expect(isValidHexColor('#FF')).toBe(false);
    expect(isValidHexColor('#FFFFFFF')).toBe(false);
  });
  it('rejects non-hex characters', () => {
    expect(isValidHexColor('#GGGGGG')).toBe(false);
  });
  it('rejects empty string and non-string input', () => {
    expect(isValidHexColor('')).toBe(false);
    expect(isValidHexColor(null as any)).toBe(false);
    expect(isValidHexColor(42 as any)).toBe(false);
  });
  it('HEX_COLOR_RE is consistent with isValidHexColor', () => {
    const samples = ['#FFFFFF', '#000', '#abc', 'FFFFFF', '#FF', '#GGGGGG', ''];
    for (const s of samples) {
      expect(HEX_COLOR_RE.test(s)).toBe(isValidHexColor(s));
    }
  });
});

// ── sanitizers/safeDecodeURIComponent ────────────────────────────────────
describe('improvements/sanitizers -- safeDecodeURIComponent', () => {
  it('decodes valid percent-encoded strings', () => {
    expect(safeDecodeURIComponent('hello%20world')).toBe('hello world');
    expect(safeDecodeURIComponent('caf%C3%A9')).toBe('caf\u00e9');
  });
  it('returns string unchanged when no escapes present', () => {
    expect(safeDecodeURIComponent('plaintext')).toBe('plaintext');
    expect(safeDecodeURIComponent('')).toBe('');
  });
  it('returns null for malformed percent sequences', () => {
    expect(safeDecodeURIComponent('%ZZ')).toBeNull();
    expect(safeDecodeURIComponent('bad%2')).toBeNull();
  });
  it('returns null for non-string input', () => {
    expect(safeDecodeURIComponent(null)).toBeNull();
    expect(safeDecodeURIComponent(undefined)).toBeNull();
    expect(safeDecodeURIComponent(42)).toBeNull();
  });
});

// ── barrel (index.ts) re-exports ──────────────────────────────────────────
describe('improvements/index (barrel re-exports)', () => {
  it('exports SYSTEM_AUTHOR_ID', () => { expect(barrel.SYSTEM_AUTHOR_ID).toBe(SYSTEM_AUTHOR_ID); });
  it('exports HEX_COLOR_RE', () => { expect(barrel.HEX_COLOR_RE).toBe(HEX_COLOR_RE); });
  it('exports isValidHexColor', () => { expect(barrel.isValidHexColor('#FFF')).toBe(true); });
  it('exports isInt', () => { expect(barrel.isInt(3)).toBe(true); });
  it('exports checkValidRev', () => { expect(barrel.checkValidRev(7)).toBe(7); });
  it('exports assertRevInRange', () => { expect(() => barrel.assertRevInRange(5, 5)).not.toThrow(); });
  it('exports safeDecodeURIComponent', () => { expect(barrel.safeDecodeURIComponent('hi')).toBe('hi'); });
});

// ── backwards-compatibility shim (checkValidRev.ts) ──────────────────────
describe('utils/checkValidRev shim -- backwards compatibility', () => {
  it('loads and exports isInt and checkValidRev', async () => {
    const mod = await import('../../../node/utils/checkValidRev');
    const fn = (mod as any).isInt ?? (mod as any).default?.isInt;
    const fn2 = (mod as any).checkValidRev ?? (mod as any).default?.checkValidRev;
    expect(typeof fn).toBe('function');
    expect(typeof fn2).toBe('function');
  });
  it('shim isInt works correctly', async () => {
    const mod = await import('../../../node/utils/checkValidRev');
    const fn = (mod as any).isInt ?? (mod as any).default?.isInt;
    expect(fn(1)).toBe(true);
    expect(fn(1.5)).toBe(false);
    expect(fn(NaN)).toBe(false);
  });
  it('shim checkValidRev accepts and rejects correctly', async () => {
    const mod = await import('../../../node/utils/checkValidRev');
    const fn = (mod as any).checkValidRev ?? (mod as any).default?.checkValidRev;
    expect(fn(5)).toBe(5);
    expect(fn('10')).toBe(10);
    expect(() => fn(-1)).toThrow();
    expect(() => fn('abc')).toThrow();
  });
});
