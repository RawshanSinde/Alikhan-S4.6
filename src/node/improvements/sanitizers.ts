'use strict';
/**
 * Input sanitization helpers for the Etherpad server.
 *
 * These pure functions normalise or clean user-supplied data before it
 * reaches business logic. Extracting them here keeps the sanitisation
 * rules in one reviewable place and makes them independently testable.
 */

/**
 * Safely decodes a URI-encoded string, returning `null` on malformed
 * input instead of throwing a `URIError`.
 *
 * Previously inlined as an anonymous closure inside
 * `PadMessageHandler.handleClientReady`. Extracting it here lets the
 * same guard be reused wherever user-supplied percent-encoded strings
 * appear (cookie values, query parameters, etc.) and makes the edge-case
 * behaviour testable in isolation.
 *
 * @param raw - The percent-encoded string to decode.
 * @returns The decoded string, or `null` when `raw` is not a string or
 *     contains an invalid percent-escape sequence (e.g. `%ZZ`).
 */
export const safeDecodeURIComponent = (raw: unknown): string | null => {
  if (typeof raw !== 'string') return null;
  try {
    return decodeURIComponent(raw);
  } catch (err) {
    if (err instanceof URIError) return null;
    throw err;
  }
};
