# CRM-Modular

Núcleo modular de agencia digital. Versión 0.2.0 (integración de autenticación preparada, **sin configurar**).

## Estado
- React + Vite + TypeScript; módulos compilados conjuntamente.
- Registro, bus de eventos, interfaz móvil y pruebas locales.
- Adaptador Supabase Auth con correo/contraseña, inicio/cierre de sesión y control visual por UUID.
- **No hay un proyecto Supabase conectado, políticas RLS ni base de datos del CRM. No utilizar con datos de clientes.**

## Desarrollo y pruebas
- `npm install` (requiere acceso a npm)
- `npm test`
- `npm run check:boundaries`
- `npm run build`

## Configuración futura
Copiar `.env.example` a `.env` (ignorado por Git), completar `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` y `VITE_ALLOWED_USER_ID`. **Todos los valores VITE_ son visibles en el navegador** y no sustituyen controles de servidor. Nunca usar claves secretas/service_role en Vite.

Para una instalación segura, configurar Supabase Auth, desactivar registro público, crear la cuenta inicial por un mecanismo administrativo seguro y aplicar RLS a todas las tablas antes de habilitar lecturas/escrituras reales.

CI: `.github/workflows/ci.yml`; no requiere Codespaces. No hay `package-lock.json` verificado todavía.

Detalles y pendientes: `docs/estado.md`.
