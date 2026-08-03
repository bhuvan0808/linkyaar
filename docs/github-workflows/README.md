# GitHub Actions Recipes

These workflows are ready to use but are stored here (not in
`.github/workflows/`) because activating them requires pushing with a
token that has the `workflow` scope.

**To activate:** move the `.yml` files into `.github/workflows/` and push
from a machine authenticated with `repo` + `workflow` scopes:

```bash
mkdir -p .github/workflows
git mv docs/github-workflows/ci.yml .github/workflows/ci.yml
git mv docs/github-workflows/supabase-keepalive.yml .github/workflows/supabase-keepalive.yml
git commit -m "ci(github): activate ci and keep-alive workflows"
git push
```

- `ci.yml` — lint, typecheck, and build on every PR to `main`/`develop`.
- `supabase-keepalive.yml` — optional backup for the Vercel Cron keep-alive
  (`/api/keepalive`); pings Supabase every 3 days.
