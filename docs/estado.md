# Estado — núcleo v0.2, autenticación
Fecha: 2026-11-25
Decisiones: D-001 a D-010 respetadas.

## Implementado
- Adaptador Supabase Auth basado en signInWithPassword, onAuthStateChange y signOut.
- Estados sin configuración, cargando, sin sesión, denegado y autorizado.
- Pantalla de correo/contraseña, cierre de sesión y bloqueo de módulos al no estar autenticado.
- Restricción visual por UUID, sin registro público desde la UI.

## Verificación
- Pruebas unitarias del núcleo y política de identidad: 8/8 localmente.
- Control de independencia: 13 archivos TS/TSX, sin infracciones.
- Compilación real en CI con la nueva dependencia: pendiente de revisión.

## Bloqueos y pendientes
- Proyecto Supabase creado en organización PYME Digital LM: ref `tqtxfkulnmulvzyxexcz`, región `us-west-1`, estado `ACTIVE_HEALTHY`, costo de creación confirmado $0 USD/mes. URL: `https://tqtxfkulnmulvzyxexcz.supabase.co`. Falta configurar clave pública y UUID de usuario.
- La política por UUID en frontend NO equivale a autorización de servidor. Falta RLS, esquema SQL y pruebas de acceso permitido/prohibido. No introducir datos comerciales reales.
- No están habilitados registro, recuperación de contraseña ni gestión de usuarios en UI. En Supabase deshabilitar registros públicos y crear el usuario autorizado desde un panel seguro cuando exista el proyecto.
- Falta lockfile reproducible, integración real y despliegue Cloudflare.

## Supabase — comprobación del 2026-11-25
- Proyecto `CRM-Modular` creado con costo cotizado de $0 USD/mes; sin gasto contratado.
- `get_project`: `ACTIVE_HEALTHY`.
- `public`: 0 tablas al comprobar.
- Avisos de seguridad: 0 en el estado actual (sin tablas de CRM).
- Todavía no se ha creado usuario autorizado, ni se ha aplicado SQL/RLS, ni probado inicio de sesión.
- No subir claves secretas ni datos personales a GitHub.


## Supabase — esquema CRM seguro (2026-11-25)
- Migración aplicada: `crm_fase1_acceso_cerrado`. Versión SQL: `supabase/migrations/20261125_crm_fase1_acceso_cerrado.sql`.
- Tablas `contacto` e `interaccion` con RLS, propietario, estados controlados y borrado lógico; tabla privada `crm_private.usuario_autorizado` con 0 cuentas.
- Comprobado: las tres tablas tienen RLS, 6 políticas en las tablas públicas, rol `anon` sin acceso SELECT a contactos y `authenticated` sin lectura de la lista privada.
- Prueba negativa: usuario autenticado simulado no autorizado obtuvo error PostgreSQL `42501` al intentar INSERT; 0 contactos almacenados tras la prueba.
- Asesor de seguridad: observación informativa `rls_enabled_no_policy` en lista privada, **intencional** porque no se permite lectura directa a roles cliente.
- Pendiente: deshabilitar registro público en Auth (no hay acción administrativa disponible en la conexión actual), crear usuario inicial desde panel seguro, incorporar su UUID a la lista privada y probar acceso autorizado + denegado.
- No hay cuenta autorizada todavía: por diseño toda escritura CRM sigue bloqueada.

## Supabase — cuenta inicial autorizada (2026-11-25)
- Verificado un usuario en `auth.users` con correo confirmado. Incorporado a `crm_private.usuario_autorizado` por operación administrativa restringida.
- Prueba bajo rol `authenticated` e identidad autorizada simulada: `crm_private.acceso_permitido()` devolvió `true`; inserción transaccional de contacto permitida y revertida.
- Prueba bajo identidad distinta: `crm_private.acceso_permitido()` devolvió `false`; inserción denegada con PostgreSQL 42501.
- Validación tras pruebas: 0 contactos persistidos.
- **Pendientes:** verificar desde panel que el registro público de Auth está deshabilitado; configurar variables públicas Vite en un entorno de despliegue seguro, comprobar login real desde Android y confirmar compilación CI. Las políticas RLS se verificaron por SQL simulado, no por sesiones HTTP reales.

## Auth — actualización de configuración (2026-11-25)
- Usuario comunicó que deshabilitó el registro público de Supabase Auth. **Confirmación del usuario; no verificada directamente por API** (la conexión no expone esa opción).
- Estado de cuenta única y políticas RLS previamente probado mediante SQL.
- Conexión Cloudflare comprobada: cuenta disponible, cero Workers existentes al consultar.
- Aplicación React v0.2 aún no desplegada ni conectada mediante variables de entorno del frontend.
- Siguiente: aprovisionar compilación y despliegue de Static Assets con `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` y `VITE_ALLOWED_USER_ID` inyectados durante build, sin claves secretas ni datos reales en Git.

## Despliegue Cloudflare Workers (2026-11-25)
- Cuenta Cloudflare conectada y repositorio GitHub vinculado mediante integración Builds.
- Worker creado: `crm-modular-pyme`. Static Assets configurados con `wrangler.jsonc`, rama `main`, `npm run build` y `npx --yes wrangler@4 deploy`.
- Build `444c7918-59f3-463f-9754-df3cd4d0fc5a`: `stopped` / `success`. Logs confirman `tsc --noEmit`, compilación Vite, carga de archivos y despliegue completados.
- URL entregada por Cloudflare: `https://crm-modular-pyme.pymedigital.workers.dev`. Dominio workers.dev habilitado, previews deshabilitadas.
- Cloudflare consulta que el Worker tiene Static Assets asociados. Verificación HTTP directa externa: no disponible mediante el navegador de investigación en este turno.
- Variables de build configuradas: `VITE_SUPABASE_URL`, `VITE_ALLOWED_USER_ID`. **PENDIENTE: `VITE_SUPABASE_PUBLISHABLE_KEY`**, porque el control de seguridad bloqueó la transferencia automática del valor entre servicios. La aplicación debe mostrar estado no configurado; NO está validado el inicio de sesión real.
- No existen contraseñas ni claves `service_role` en GitHub o Worker. La clave publishable, al incluirse en Vite, será visible públicamente en el navegador cuando se configure.
- El build sin `package-lock.json` fue correcto, pero no tiene dependencias reproducibles ni caché estable; generar lockfile y cambiar a `npm ci` antes de dar por estable.
- **No declara el proyecto terminado**: falta configurar esa variable en Cloudflare Builds, reconstruir, confirmar visualmente acceso y prueba de sesión real desde Android.
