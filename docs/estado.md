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
- La cuenta Supabase conectada no tiene proyectos: falta URL, clave pública y UUID de usuario.
- La política por UUID en frontend NO equivale a autorización de servidor. Falta RLS, esquema SQL y pruebas de acceso permitido/prohibido. No introducir datos comerciales reales.
- No están habilitados registro, recuperación de contraseña ni gestión de usuarios en UI. En Supabase deshabilitar registros públicos y crear el usuario autorizado desde un panel seguro cuando exista el proyecto.
- Falta lockfile reproducible, integración real y despliegue Cloudflare.
