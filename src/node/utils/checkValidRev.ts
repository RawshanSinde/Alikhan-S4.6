'use strict';
/**
 * Thin re-export wrapper kept for backwards compatibility.
 *
 * The canonical implementations now live in `src/node/improvements/validators.ts`.
 * Existing `require('../utils/checkValidRev')` call-sites continue to work
 * without modification; new code should import from `../improvements` instead.
 */

import {
  checkValidRev as _checkValidRev,
  isInt as _isInt,
} from '../improvements/validators';

exports.isInt = _isInt;
exports.checkValidRev = _checkValidRev;
