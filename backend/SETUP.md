# Guía de Configuración del Backend (VideoConf Manager)

Esta guía te ayudará a levantar el proyecto backend desde cero, configurando la base de datos y ejecutando las migraciones necesarias.

## Requisitos Previos

Asegúrate de tener instalado en tu sistema:
- **Node.js** (v18 o superior)
- **npm** (o bun/yarn)
- **PostgreSQL** (instancia local o remota corriendo)

## Paso 1: Instalación de Dependencias

Ejecuta el siguiente comando en la terminal dentro de la carpeta `backend/`:

```bash
npm install
```

## Paso 2: Configuración de Variables de Entorno

1.  Crea un archivo `.env` en la raíz de `backend/` (puedes copiar el `.env.example` si existe).
2.  Configura la URL de conexión a tu base de datos PostgreSQL.

Ejemplo de contenido para `.env`:

```env
# Formato: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://usuario:password@localhost:5432/videoconf_db"

# JWT Secret para autenticación
JWT_SECRET="tu_secreto_super_seguro"

# Puerto (opcional, por defecto 3001)
PORT=3001
```

> **Nota:** Asegúrate de que la base de datos `videoconf_db` (o el nombre que elijas) exista, o que el usuario tenga permisos para crearla.

## Paso 3: Migraciones de Base de Datos (Prisma)

Para crear las tablas en tu base de datos basándote en el esquema (`prisma/schema.prisma`), ejecuta las migraciones:

```bash
# Opción A: Desarrollo (crea migraciones y aplica)
npx prisma migrate dev --name init

# Opción B: Producción/Despliegue (aplica migraciones existentes sin crear nuevas)
npx prisma migrate deploy
```

Si todo sale bien, verás un mensaje indicando que la base de datos está sincronizada.

## Paso 4: Poblar la Base de Datos (Opcional)

Si tienes un script de "seed" configurado en `package.json` -> `prisma.seed`, puedes correr:

```bash
npx prisma db seed
```

*Actualmente el proyecto no parece tener un seed configurado por defecto, pero puedes verificarlo en `package.json`.*

## Paso 5: Levantar el Servidor

Para iniciar el servidor en modo desarrollo (con recarga automática):

```bash
npm run dev
```

Deberías ver:
`🚀 Server running on http://localhost:3001`

## Comandos Útiles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor en modo desarrollo (ts-node-dev). |
| `npm run build` | Compila el proyecto TypeScript a JavaScript. |
| `npm start` | Inicia el servidor compilado (producción). |
| `npm test` | Ejecuta las pruebas unitarias y de integración (Vitest). |
| `npx prisma studio` | Abre una interfaz web para ver y editar tus datos. |

## Solución de Problemas Comunes

*   **Error de conexión a BD:** Verifica que Postgres esté corriendo y que las credenciales en `.env` sean correctas.
*   **puerto en uso:** Cambia el `PORT` en `.env` si el 3001 está ocupado.
