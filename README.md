# Kompralo Invitaciones SaaS

SaaS para vender y administrar invitaciones digitales premium en `kompralo.com.mx/invitaciones`.

## Stack

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Prisma
- MySQL
- NextAuth
- Stripe Checkout
- Mercado Pago

## Instalación

```bash
npm install
```

Crear `.env.local`:

```bash
DATABASE_URL=mysql://usuario:password@localhost:3306/kompralo_invitaciones
AUTH_SECRET=cambia_este_secret_en_produccion
NEXT_PUBLIC_BASE_URL=https://deepskyblue-aardvark-168176.hostingersite.com
STRIPE_SECRET_KEY=sk_test_tu_llave_secreta_de_stripe
MERCADO_PAGO_ACCESS_TOKEN=TEST-tu_access_token_de_mercado_pago
```

Preparar base de datos:

```bash
npm run db:push
npm run db:seed
```

Usuario admin inicial:

```txt
admin@kompralo.com.mx
Admin123!
```

## Desarrollo

```bash
npm run dev
```

Abrir:

```bash
http://localhost:3000/invitaciones
```

## Producción

```bash
npm run build
npm run start
```

## Rutas comerciales conservadas

- `/invitaciones`
- `/modelos`
- `/precios`
- `/formulario`
- `/gracias`

## Rutas SaaS

- `/login`
- `/registro`
- `/recuperar`
- `/dashboard`
- `/dashboard/eventos`
- `/dashboard/eventos/[id]`
- `/dashboard/admin`
- `/dashboard/admin/plantillas`
- `/i/[slug]`

## APIs

- `/api/auth/[...nextauth]`
- `/api/auth/register`
- `/api/auth/recover`
- `/api/auth/reset`
- `/api/events`
- `/api/events/[id]`
- `/api/templates`
- `/api/templates/[id]`
- `/api/guests`
- `/api/guests/[id]`
- `/api/rsvp`
- `/api/checkout`
- `/api/payments/mercado-pago`

## Funcionalidad incluida

- Roles `ADMIN` y `CLIENT`.
- Login, registro y recuperación de contraseña.
- Dashboard cliente.
- Dashboard administrador.
- CRUD de eventos.
- CRUD de plantillas.
- CRUD de invitados.
- Sistema RSVP.
- Invitación pública en `/i/[slug]`.
- Stripe Checkout para Básico, Premium e IA Premium.
- Endpoint de Mercado Pago para crear preferencia de pago.

## Hostinger

1. Crear base de datos MySQL.
2. Configurar `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_BASE_URL`, `STRIPE_SECRET_KEY` y `MERCADO_PAGO_ACCESS_TOKEN`.
3. Ejecutar `npm install`.
4. Ejecutar `npm run db:push`.
5. Ejecutar `npm run db:seed`.
6. Ejecutar `npm run build`.
7. Iniciar con `npm run start`.

## Si Hostinger bloquea MySQL remoto

Si `npm run db:push` falla desde tu computadora, importa el SQL manualmente en phpMyAdmin:

1. Abre phpMyAdmin.
2. Selecciona la base `u744456736_kompralo_invit`.
3. Entra a `Importar`.
4. Sube `database/init.sql`.
5. Ejecuta la importación.

Ese archivo crea las tablas, el usuario admin y las plantillas iniciales.
