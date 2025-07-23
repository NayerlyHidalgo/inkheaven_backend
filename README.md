<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# 🎨 Ink Heaven API - Backend

API REST para gestión de estudio de tatuajes con sistema de citas, portfolio y e-commerce.

## 🚀 Características

- 🔐 **Autenticación JWT** con roles (Cliente, Artista, Admin)
- 👥 **Gestión de usuarios** y artistas
- 📅 **Sistema de citas** con disponibilidad
- 🛒 **E-commerce** de productos relacionados
- ⭐ **Sistema de reseñas** y ratings
- 🎨 **Portfolio** de trabajos de tatuajes
- 📊 **Base de datos dual** PostgreSQL + MongoDB
- 🔍 **Health checks** completos
- 📮 **Colección Postman** incluida

## 🐳 Despliegue Rápido con Docker

### Opción 1: Docker Compose (Recomendado para desarrollo)
```bash
# Iniciar todo el stack (API + PostgreSQL + MongoDB)
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down
```

### Opción 2: Render.com (Producción)
```bash
# 1. Push tu código a GitHub
git add .
git commit -m "Ready for Render deployment"
git push origin main

# 2. Sigue la guía en RENDER_DEPLOY_GUIDE.md
```

### Opción 3: Docker manual
```bash
# Windows
test-docker.bat

# Linux/Mac
chmod +x build.sh
./build.sh
```

## 📋 Setup Local

### Prerrequisitos
- Node.js 18+
- PostgreSQL 15+
- MongoDB 6+
- npm o yarn

### Instalación
```bash
# Clonar repositorio
git clone <tu-repo>
cd ink-heaven-backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Ejecutar en desarrollo
npm run start:dev
```

## 🗄️ Base de Datos

### PostgreSQL (Datos relacionales)
- Usuarios, productos, artistas, citas
- Relaciones entre entidades

### MongoDB (Logs y reseñas)
- Logs de sistema
- Reseñas y comentarios
- Datos no relacionales

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Testing
npm run test
npm run test:e2e

# Docker
docker-compose up --build
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 📮 API Testing

### Postman Collection
Importa `Ink-Heaven-API.postman_collection.json` en Postman y sigue la guía en `POSTMAN_GUIDE.md`.

### Health Check
```bash
# API Status
GET /api/v1/health

# Database Status
GET /api/v1/health/postgres
GET /api/v1/health/mongodb
```

## 🔐 Autenticación

### Usuarios Predefinidos
```bash
# Cliente
Email: juan@example.com
Password: password123

# Artista  
Email: carlos@inkheaven.com
Password: artist123

# Administrador
Email: admin@inkheaven.com
Password: admin123
```

## 🌐 Endpoints Principales

### Auth
- `POST /auth/register` - Registro
- `POST /auth/login` - Login  
- `GET /auth/profile` - Perfil actual

### Users
- `GET /users` - Listar usuarios (admin)
- `GET /users/profile` - Mi perfil
- `PATCH /users/:id` - Actualizar usuario

### Products
- `GET /products` - Listar productos
- `POST /products` - Crear producto (admin)
- `PATCH /products/:id` - Actualizar producto (admin)

### Artists
- `GET /artists` - Listar artistas
- `POST /artists` - Crear artista (admin)
- `GET /artists/me` - Mi perfil de artista

### Appointments
- `POST /appointments` - Crear cita
- `GET /appointments/my-appointments` - Mis citas
- `PATCH /appointments/:id/status` - Cambiar estado

### Reviews
- `POST /reviews` - Crear reseña
- `GET /reviews/artist/:id` - Reseñas de artista
- `PATCH /reviews/:id/moderate` - Moderar (admin)

### Portfolio
- `POST /portfolio` - Subir trabajo
- `GET /portfolio/artist/:id` - Portfolio de artista
- `PATCH /portfolio/:id/like` - Dar like

## 📁 Estructura del Proyecto

```
src/
├── auth/          # Autenticación JWT
├── users/         # Gestión de usuarios
├── products/      # E-commerce productos
├── artists/       # Gestión de artistas
├── appointments/  # Sistema de citas
├── reviews/       # Sistema de reseñas
├── portfolio/     # Portfolio de trabajos
├── common/        # Utilidades comunes
├── entities/      # Entidades TypeORM
├── schemas/       # Esquemas MongoDB
└── main.ts        # Punto de entrada
```

## 🚀 Despliegue en Producción

Ver guía completa en `RENDER_DEPLOY_GUIDE.md`

### Variables de Entorno Requeridas
```bash
NODE_ENV=production
PORT=3000
DB_HOST=tu-postgres-host
DB_PASSWORD=tu-password-segura
MONGODB_URI=mongodb://...
JWT_SECRET=tu-secreto-super-seguro
```

## 🤝 Contributing

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia UNLICENSED - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

- 📧 Email: support@inkheaven.com
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/ink-heaven-backend/issues)
- 📮 Postman: Importa la colección para testing completo

---

⚡ **Desarrollado con NestJS** | 🎨 **Para Ink Heaven Studio**
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
