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
- Prueba real en Android y resultado de ejecución de CI GitHub.
- Estrategia de respaldo y restauración.
- Registro definitivo y verificación de licencias y cuotas.

## CI GitHub Actions (2026-11-25)
- Workflow `.github/workflows/ci.yml` publicado en la rama `main` (commit `c67eb5297814c9942f91cebb69f9940e1f6367ae`).
- Ejecuta en Ubuntu estándar con Node 22: instalación, cinco pruebas de núcleo, control de fronteras y compilación TypeScript + Vite.
- Validación local de sintaxis YAML: correcta. Archivo remoto leído y confirmado.
- **PENDIENTE:** resultado del primer workflow (la interfaz de consulta disponible no muestra ejecuciones disparadas por `push`; ausencia de resultados de PR no equivale a éxito).
- **DEUDA:** no existe `package-lock.json`; se usa temporalmente `npm install`, pendiente generar lockfile verificado para pasar a `npm ci` y reproducibilidad.

## Advertencia
No se declara completada la Fase 1. Esta entrega contiene únicamente la estructura inicial del núcleo.