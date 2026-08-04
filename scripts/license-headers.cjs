/**
 * SPDX license header tool.
 *
 *   node scripts/license-headers.cjs          # add missing headers
 *   node scripts/license-headers.cjs --check  # exit 1 if any are missing (CI)
 *
 * Header goes at the very top of the file. Comments before 'use client'
 * are legal — directives only need to precede statements.
 */
const fs = require('fs')
const path = require('path')

const SPDX = 'SPDX-License-Identifier: AGPL-3.0-or-later'
const COPYRIGHT = 'Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors'

const HEADERS = {
  slash: `// ${SPDX}\n// ${COPYRIGHT}\n\n`,
  block: `/* ${SPDX}\n * ${COPYRIGHT}\n */\n\n`,
  dash: `-- ${SPDX}\n-- ${COPYRIGHT}\n\n`,
}

const RULES = [
  { ext: ['.ts', '.tsx', '.mts', '.mjs', '.cjs'], header: HEADERS.slash },
  { ext: ['.css'], header: HEADERS.block },
  { ext: ['.sql'], header: HEADERS.dash },
]

const ROOTS = ['src', 'supabase', 'scripts']
const SKIP_DIRS = new Set(['node_modules', '.next', 'components'])
// components/ui holds shadcn-generated primitives; skip only that subtree.
const SKIP_PATHS = [path.join('src', 'components', 'ui')]

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (SKIP_PATHS.some((s) => full.includes(s))) continue
      if (entry.name === 'node_modules' || entry.name === '.next') continue
      yield* walk(full)
    } else {
      yield full
    }
  }
}

const checkOnly = process.argv.includes('--check')
let missing = 0
let added = 0

for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue
  for (const file of walk(root)) {
    const rule = RULES.find((r) => r.ext.includes(path.extname(file)))
    if (!rule) continue
    const content = fs.readFileSync(file, 'utf8')
    if (content.includes('SPDX-License-Identifier')) continue
    missing += 1
    if (!checkOnly) {
      fs.writeFileSync(file, rule.header + content)
      added += 1
      console.log(`added: ${file}`)
    } else {
      console.error(`missing header: ${file}`)
    }
  }
}

if (checkOnly && missing > 0) {
  console.error(`\n${missing} file(s) missing SPDX headers. Run: node scripts/license-headers.cjs`)
  process.exit(1)
}
console.log(checkOnly ? 'all files have SPDX headers' : `done — ${added} header(s) added`)
