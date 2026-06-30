'use strict';
/**
 * Shared constants for the Etherpad server.
 *
 * Several modules previously duplicated magic strings such as the system author
 * ID. Centralising them here eliminates divergence risk and makes future
 * renames a single-line change.
 *
 * The canonical value lives in `Pad.SYSTEM_AUTHOR_ID` (src/node/db/Pad.ts).
 * Due to circular-import constraints at module init time (API <-> Pad <->
 * PadManager), multiple files inlined the same literal. This module breaks
 * the cycle: every consumer can import from here without triggering circular
 * loads.
 */

/**
 * The synthetic author ID attributed to server-internal inserts (HTTP API
 * setText / appendText / setHTML without an explicit authorId, server-side
 * import flows, and plugins like ep_post_data).
 *
 * No legitimate socket.io session should ever write as this author.
 */
export const SYSTEM_AUTHOR_ID = 'a.etherpad-system';
