/**
 * Conventional Commits enforcement.
 * @see https://www.conventionalcommits.org
 *
 * Format: <type>(<scope>): <subject>
 * Example: feat(auth): add google authentication
 */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-case': [2, 'always', 'lower-case'],
  },
}

export default config
