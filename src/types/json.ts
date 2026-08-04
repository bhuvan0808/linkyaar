// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

export type Json =
  string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
