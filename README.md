# Clankers Books

Una plataforma moderna de recomendaciones de libros donde los usuarios pueden descubrir, comentar y dejar reseñas de sus lecturas favoritas.

## Stack Tecnológico

- **Framework**: [Next.js](https://nextjs.org) - React framework con SSR y optimizaciones
- **Lenguaje**: TypeScript - Para mayor seguridad de tipos
- **Styling**: CSS - Estilos optimizados
- **Autenticación**: Sistema de login/signup integrado
- **Base de datos**: Configurada en `lib/auth.ts`

## Características

- Exploración de libros recomendados
- Sistema de calificación con estrellas
- Reseñas detalladas de usuarios
- Perfil de usuario personalizado
- Autenticación segura
- Búsqueda de libros
- Interfaz responsive

## Instalación

### Requisitos previos
- Node.js 16+ instalado
- npm, yarn, pnpm o bun

### Pasos de instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd clankers-books
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

## Ejecución

Inicia el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Estructura del Proyecto

```
app/
  ├── components/        # Componentes reutilizables
  ├── book/             # Detalles de libros individuales
  ├── discover/         # Página de descubrimiento
  ├── login/            # Página de inicio de sesión
  ├── signup/           # Página de registro
  ├── profile/          # Perfil de usuario
  ├── data/             # Datos de libros
  └── globals.css       # Estilos globales
lib/
  └── auth.ts           # Lógica de autenticación
```

## Componentes Principales

- **BookCard** - Tarjeta para mostrar información del libro
- **ReviewCard** - Muestra reseñas de usuarios
- **ReviewModal** - Modal para crear/editar reseñas
- **StarRating** - Sistema de calificación con estrellas
- **SearchBar** - Búsqueda de libros
- **Header** - Encabezado de navegación

## Edición

Puedes comenzar a editar la aplicación modificando `app/page.tsx`. La página se actualiza automáticamente mientras editas.

## Aprende más

Para aprender más sobre Next.js:

- [Documentación de Next.js](https://nextjs.org/docs) - Características y API
- [Tutorial Next.js](https://nextjs.org/learn) - Tutorial interactivo
- [Repositorio GitHub de Next.js](https://github.com/vercel/next.js)

## Despliegue

La forma más fácil de desplegar esta aplicación es usando [Vercel Platform](https://vercel.com/new?utm_medium=default-template&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Consulta la [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.

## Licencia

Este proyecto está bajo licencia MIT.