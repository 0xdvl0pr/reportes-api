# reportes-api

API de reportes de ventas para los coordinadores de cada empresa cliente.
Proyecto de práctica de la capacitación "Flujo de desarrollo con IA".

## Requisitos

- Node 20 o superior
- Claude Code: `curl -fsSL https://claude.ai/install.sh | bash`

## Empezar

```bash
npm install
npm test          # pruebas (Vitest + Supertest)
npm run dev       # servidor en http://localhost:3000
```

Otros comandos: `npm run lint` y `npm run typecheck`.

## Usuarios de prueba

| Correo | Contraseña | Rol | Empresa |
|---|---|---|---|
| ana@andina.co | andina123 | coordinador | Distribuidora Andina |
| luis@andina.co | andina123 | analista | Distribuidora Andina |
| marta@valle.co | valle123 | coordinador | Comercial del Valle |

Los datos viven en memoria (`src/data/db.ts`) y se reinician en cada arranque.

## Endpoints

| Método | Ruta | Quién |
|---|---|---|
| POST | /auth/login | público |
| POST | /auth/logout | con sesión |
| GET | /clientes | coordinador, analista |
| GET | /clientes/:id | coordinador, analista |
| GET | /reportes | coordinador, analista |
| GET | /reportes/:id | coordinador, analista |

Autenticación: `Authorization: Bearer <token>` con el token que devuelve `/auth/login`.

## Probar a mano

```bash
TOKEN=$(curl -s localhost:3000/auth/login -H 'content-type: application/json' \
  -d '{"email":"ana@andina.co","password":"andina123"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')
curl -s localhost:3000/reportes/1 -H "authorization: Bearer $TOKEN"
```
