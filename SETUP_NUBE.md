# SETUP_NUBE.md — encender el login en la nube (gratis)

Futbolini funciona 100% offline sin esto. El login es **opcional**: si no lo configurás,
el panel "Cuenta en la nube" ni aparece y el juego anda igual con el respaldo por archivo.

Cuando lo prendés, cada jugador puede crear su cuenta (correo + clave) y su partida lo sigue
a cualquier dispositivo. Usa el **free tier de Supabase**: gratis hasta decenas de miles de
usuarios. No hay servidor propio que mantener.

---

## 1. Crear el proyecto (5 min, gratis)

1. Entrá a https://supabase.com y creá una cuenta.
2. **New project** → nombre "futbolini", elegí una región cercana (South America si hay),
   poné una contraseña de base de datos (guardala, no la vas a necesitar en el juego).
3. Esperá a que termine de aprovisionar (~2 min).

## 2. Crear la tabla de partidas

En el panel de Supabase → **SQL Editor** → **New query** → pegá esto y dale **Run**:

```sql
create table if not exists public.saves (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.saves enable row level security;

create policy "cada quien su partida"
  on public.saves
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

Esto crea una fila por usuario y activa **Row Level Security**: cada jugador solo puede leer
y escribir su propia partida. Nadie ve la de otro. Esa es la seguridad real.

## 2b. Blindaje (7.9118) — correlo una vez, aunque ya tengas la tabla

La llave pública va en el juego a propósito, así que **cualquiera puede hablarle a tu proyecto**. Lo que lo protege es
lo de abajo. En **SQL Editor** → **New query** → pegá y **Run**:

```sql
-- 1) una partida no puede pesar más de 8 MB (una carrera larga pesa ~1 MB): nadie te llena la base gratis
alter table public.saves drop constraint if exists saves_tamano;
alter table public.saves add constraint saves_tamano check (pg_column_size(data) < 8000000);

-- 2) sin cuenta no se toca la tabla, ni aunque un día se borre la política por error
revoke all on table public.saves from anon;
grant select, insert, update, delete on table public.saves to authenticated;

-- 3) la regla "cada quien su partida" vale siempre
alter table public.saves force row level security;
```

**Cómo comprobar que nadie puede leer ni borrar partidas ajenas** (también en SQL Editor):

```sql
-- tiene que salir: saves | true | true
select relname, relrowsecurity, relforcerowsecurity from pg_class where relname = 'saves';
-- tiene que salir VACÍO: tablas públicas sin RLS (si aparece alguna, cualquiera la lee y la borra)
select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity;
-- tiene que salir UNA política, la de "cada quien su partida", con auth.uid() = user_id
select policyname, cmd, qual, with_check from pg_policies where schemaname = 'public';
```

Y en el panel: **Advisors → Security Advisor** (te marca en rojo cualquier tabla expuesta), **Authentication →
Rate Limits** (dejá los de fábrica o más bajos), y **Authentication → Providers → Email**: clave mínima de 8 y
"Leaked password protection" encendido si tu plan lo permite.

## 3. (Opcional) Sacar la confirmación por correo

Para que la gente entre al toque sin confirmar el mail:
- **Authentication** → **Sign In / Providers** → **Email** → desactivá *"Confirm email"*.

Si lo dejás activado, al crear cuenta el juego avisa "revisá tu correo" y recién ahí pueden entrar.

## 4. Copiar tus claves al juego

En Supabase → **Project Settings** → **API**:
- Copiá **Project URL** (ej: `https://abcdefgh.supabase.co`).
- Copiá la **anon / public** key (la larga que empieza con `eyJ...`).

Pegalas en `js/nube.js`, arriba de todo:

```js
const NUBE_CONFIG = {
  url: "https://abcdefgh.supabase.co",
  anonKey: "eyJ...tu-anon-key..."
};
```

> La anon key es **pública a propósito**: es seguro dejarla en el repo y en GitHub Pages.
> La que NUNCA se pega en el juego es la `service_role` key. Esa se queda en Supabase.

## 5. Listo

Commiteá `js/nube.js`, subí a Pages, y en **Ajustes** va a aparecer "Cuenta en la nube".
Probá: crear cuenta → subir partida → en otro navegador/celular entrar con la misma cuenta →
bajar partida.

---

## Notas de sustentabilidad

- El free tier de Supabase pausa el proyecto si nadie lo toca en ~1 semana; se reactiva solo
  cuando alguien vuelve a entrar. Para un juego con jugadores activos no es problema.
- El sync es **manual** (botones Subir / Bajar) a propósito: nunca pisa tu partida sin que vos lo pidas.
- Si algún día explota en usuarios, Supabase tiene planes pagos, pero recién ahí — y para entonces
  ya tendrías con qué sostenerlo. Hasta ese punto, es gratis.
