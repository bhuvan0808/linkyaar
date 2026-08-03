-- ============================================================
-- LinkYaar — Account management
-- ============================================================

-- Self-service account deletion. Cascades wipe profile, links,
-- socials, settings, and analytics via existing foreign keys.
create or replace function public.delete_user()
returns void
language sql
security definer set search_path = ''
as $$
  delete from auth.users where id = auth.uid();
$$;

grant execute on function public.delete_user() to authenticated;
