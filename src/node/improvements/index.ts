'use strict';
/**
 * `src/node/improvements/` -- shared utilities extracted during the
 * SURFS replication study (2026-06-30).
 *
 * This barrel re-exports every public symbol so consumers can write:
 *
 *     import { SYSTEM_AUTHOR_ID, checkValidRev } from '../improvements';
 *
 * Individual sub-modules can also be imported directly when only a
 * narrow subset is needed.
 */

export { SYSTEM_AUTHOR_ID } from './constants';
export {
  HEX_COLOR_RE,
  isValidHexColor,
  isInt,
  checkValidRev,
  assertRevInRange,
} from './validators';
export { safeDecodeURIComponent } from './sanitizers';
