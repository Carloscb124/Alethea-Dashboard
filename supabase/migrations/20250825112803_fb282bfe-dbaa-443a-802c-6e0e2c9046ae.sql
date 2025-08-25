-- Harden function by fixing search_path
create or replace function public.set_timestamp_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;