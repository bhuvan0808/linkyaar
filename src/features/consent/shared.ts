// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

/**
 * First-party cookie recording a visitor's explicit opt-in to
 * anonymous analytics (DPDP Act 2023). Set only after an affirmative
 * click; read server-side to gate every analytics write.
 */
export const CONSENT_COOKIE = 'ly_analytics_consent'
export const CONSENT_VALUE = '1'
export const CONSENT_MAX_AGE_DAYS = 180
