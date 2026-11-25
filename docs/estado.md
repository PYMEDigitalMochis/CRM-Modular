# Estado del proyecto — núcleo v0.1
Fecha: 2026-11-25
Fuente canónica de decisiones disponible: `05_registro_decisiones_v4.md` (archivo externo al paquete, no modificado).

## Ejecutado
- Contrato tipado v1 para manifiestos y validación.
- Registro y desactivación de módulos en memoria.
- Bus de eventos local con aislamiento de suscriptores.
- Shell de prueba móvil y manifiesto del CRM sin operaciones de datos.
- Comprobaciones automatizadas incluidas.

## Verificación realizada
- `npm test`: 5/5 pruebas pasan con Node 22.16.0.
- `npm run check:boundaries`: 10 archivos TS/TSX revisados, 0 violaciones detectadas.
- `npm install --package-lock-only --offline`: falló porque no existe caché de dependencias; compilación Vite, tipado completo y UI en navegador NO verificados.

## Pendiente
- Supabase Auth y política de cuenta única.
- Esquema SQL, RLS y persistencia CRM.
- Funciones de CRM y exportación.
- PWA instalable y despliegue Cloudflare.
- Prueba real en Android y CI GitHub.
- Estrategia de respaldo y restauración.
- Registro definitivo y verificación de licencias y cuotas.

## Advertencia
No se declara completada la Fase 1. Esta entrega contiene únicamente la estructura inicial del núcleo.