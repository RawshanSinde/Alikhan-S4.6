'use strict';
/**
 * Centralised input-validation helpers for the Etherpad server.
 *
 * These functions were previously inlined or duplicated across
 * `src/node/db/API.ts`, `src/node/handler/PadMessageHandler.ts`,
 * `src/node/utils/checkValidRev.ts`, and others. Gathering them here
 * improves maintainability (single fix point) and testability (pure
 * functions with no side-effects).
 *
 * Every function in this module is a pure predicate or a pure transformer
 * that throws on invalid input. None of them access the database, the
 * network, or global mutable state.
 */

// Import CustomError for api-style error tagging.
// customError.ts uses module.exports so we import via a namespace import.
import CustomErrorMod from '../utils/customError';
// The module uses module.exports = CustomError, so the default IS the class.
const CustomError: new (message: string, name?: string) => Error = CustomErrorMod as any;

// ─── Colour validation ──────────────────────────────────────────────

/**
 * Regex that matches a valid 3- or 6-digit hex colour string.
 *
 * Previously hard-coded in `PadMessageHandler.handleUserInfoUpdate`.
 * Exposed as a constant so other modules (and tests) can reference the
 * same pattern without duplication.
 */
export const HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$/;

/**
 * Returns `true` when `color` is a syntactically valid hex colour string
 * (`#RGB` or `#RRGGBB`, case-insensitive).
 *
 * @param color - The string to validate.
 */
export const isValidHexColor = (color: string): boolean =>
  typeof color === 'string' && HEX_COLOR_RE.test(color);

// ─── Revision validation ────────────────────────────────────────────

/**
 * Returns `true` when `value` is an integer (or a string that represents
 * one).  Equivalent to the `isInt` helper previously in
 * `src/node/utils/checkValidRev.ts`.
 *
 * @param value - The value to check.
 */
export const isInt = (value: number): boolean =>
  parseFloat(String(value)) === parseInt(String(value), 10) && !isNaN(value);

/**
 * Parses and validates a revision number.
 *
 * Replaces the duplicated rev-checking logic in `API.ts`,
 * `ExportHandler.ts`, `ExportHelper.ts`, and `PadMessageHandler.ts`.
 *
 * @param rev - A revision number or its string representation.
 * @returns The validated revision as a `number`.
 * @throws {CustomError} with name `apierror` when the input is not a
 *     non-negative integer.
 */
export const checkValidRev = (rev: number | string): number => {
  if (typeof rev !== 'number') {
    rev = parseInt(rev as string, 10);
  }

  if (isNaN(rev)) {
    throw new CustomError('rev is not a number', 'apierror');
  }

  // The original message read "rev is not a negative number" which is the
  // opposite of what is meant. Corrected to "rev is a negative number".
  if (rev < 0) {
    throw new CustomError('rev is a negative number', 'apierror');
  }

  if (!isInt(rev)) {
    throw new CustomError('rev is a float value', 'apierror');
  }

  return rev;
};

/**
 * Validates that `rev` does not exceed `headRev`.
 *
 * This two-line pattern was repeated in at least five API endpoints
 * (`getRevisionChangeset`, `getText`, `getHTML`, `saveRevision`,
 * `restoreRevision`). Centralising it removes duplication and ensures a
 * consistent error message.
 *
 * @param rev - The requested revision number (already validated by
 *     `checkValidRev`).
 * @param headRev - The pad's current head revision.
 * @throws {CustomError} with name `apierror` when `rev > headRev`.
 */
export const assertRevInRange = (rev: number, headRev: number): void => {
  if (rev > headRev) {
    throw new CustomError(
      'rev is higher than the head revision of the pad',
      'apierror',
    );
  }
};
