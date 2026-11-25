-- Migración aplicada en Supabase: crm_fase1_acceso_cerrado
-- Versión de registro en GitHub. Mantener sincronizada con la migración aplicada.
-- Principio: acceso denegado hasta autorizar explícitamente un UUID en crm_private.usuario_autorizado.
create schema if not exists crm_private;
revoke all on schema crm_private from public, anon, authenticated;
grant usage on schema crm_private to authenticated;
create table crm_private.usuario_autorizado (
 usuario_id uuid primary key references auth.users(id) on delete cascade,
 creado_en timestamptz not null default now()
);
revoke all on crm_private.usuario_autorizado from public, anon, authenticated;
alter table crm_private.usuario_autorizado enable row level security;
create function crm_private.acceso_permitido()
returns boolean language sql stable security definer set search_path = ''
as $$
 select exists (
  select 1 from crm_private.usuario_autorizado u
  where u.usuario_id = (select auth.uid())
 );
$$;
revoke all on function crm_private.acceso_permitido() from public, anon, authenticated;
grant execute on function crm_private.acceso_permitido() to authenticated;
create table public.contacto (
 id uuid primary key default gen_random_uuid(),
 propietario_id uuid not null default auth.uid() references auth.users(id),
 nombre text not null check (length(btrim(nombre)) between 1 and 200),
 empresa text,
 telefono text,
 correo text,
 origen text not null default 'otro' check (origen in ('referido','redes','web','otro')),
 estado text not null default 'nuevo' check (estado in ('nuevo','contactado','cotizado','cerrado','perdido')),
 notas text,
 creado_en timestamptz not null default now(),
 actualizado_en timestamptz not null default now(),
 eliminado_en timestamptz
);
create index contacto_propietario_estado_idx on public.contacto(propietario_id,estado) where eliminado_en is null;
alter table public.contacto enable row level security;
revoke all on public.contacto from public, anon, authenticated;
grant select, insert, update on public.contacto to authenticated;
create policy contacto_select on public.contacto for select to authenticated
 using ((select crm_private.acceso_permitido()) and propietario_id = (select auth.uid()));
create policy contacto_insert on public.contacto for insert to authenticated
 with check ((select crm_private.acceso_permitido()) and propietario_id = (select auth.uid()));
create policy contacto_update on public.contacto for update to authenticated
 using ((select crm_private.acceso_permitido()) and propietario_id = (select auth.uid()))
 with check ((select crm_private.acceso_permitido()) and propietario_id = (select auth.uid()));
create table public.interaccion (
 id uuid primary key default gen_random_uuid(),
 propietario_id uuid not null default auth.uid() references auth.users(id),
 contacto_id uuid not null references public.contacto(id),
 tipo text not null check(tipo in ('llamada','mensaje','reunión','correo')),
 resumen text not null check (length(btrim(resumen)) between 1 and 5000),
 fecha timestamptz not null default now(),
 proxima_accion text,
 fecha_proxima_accion date,
 creado_en timestamptz not null default now(),
 actualizado_en timestamptz not null default now(),
 eliminado_en timestamptz
);
create index interaccion_propietario_contacto_idx on public.interaccion(propietario_id,contacto_id) where eliminado_en is null;
alter table public.interaccion enable row level security;
revoke all on public.interaccion from public, anon, authenticated;
grant select, insert, update on public.interaccion to authenticated;
create policy interaccion_select on public.interaccion for select to authenticated
 using ((select crm_private.acceso_permitido()) and propietario_id = (select auth.uid())
 and exists (select 1 from public.contacto c where c.id=contacto_id and c.propietario_id=(select auth.uid()) and c.eliminado_en is null));
create policy interaccion_insert on public.interaccion for insert to authenticated
 with check ((select crm_private.acceso_permitido()) and propietario_id = (select auth.uid())
 and exists (select 1 from public.contacto c where c.id=contacto_id and c.propietario_id=(select auth.uid()) and c.eliminado_en is null));
create policy interaccion_update on public.interaccion for update to authenticated
 using ((select crm_private.acceso_permitido()) and propietario_id = (select auth.uid())
 and exists (select 1 from public.contacto c where c.id=contacto_id and c.propietario_id=(select auth.uid()) and c.eliminado_en is null))
 with check ((select crm_private.acceso_permitido()) and propietario_id = (select auth.uid())
 and exists (select 1 from public.contacto c where c.id=contacto_id and c.propietario_id=(select auth.uid()) and c.eliminado_en is null));
