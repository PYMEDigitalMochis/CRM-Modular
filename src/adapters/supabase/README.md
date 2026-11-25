# Auth Supabase v0.2
El adaptador usa únicamente URL y clave **publishable** en Vite; la clave service_role nunca debe ir en frontend. `VITE_ALLOWED_USER_ID` permite bloquear la UI a una cuenta preseleccionada, pero es un valor público y no constituye seguridad de servidor. El proyecto Supabase real, usuario administrador, RLS y pruebas reales aún no existen en esta entrega.
