# Security Policy

## Supported Versions

Only the latest release on `main` receives security fixes.

## Reporting a Vulnerability

**Please do not open a public issue for security vulnerabilities.**

Instead, use GitHub's
[private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
on this repository ("Security" tab → "Report a vulnerability").

You can expect:

- Acknowledgement within 72 hours
- A status update within 7 days
- Credit in the release notes once a fix ships (unless you prefer otherwise)

## Scope Notes

- Never commit real Supabase keys. `.env*` files are git-ignored;
  `.env.example` holds placeholders only.
- Database access is protected by Postgres Row Level Security — see
  `supabase/migrations/`. Report any policy that leaks data across users.
