# 🐳 Guía de Despliegue Docker - Ink Heaven API

## 🚀 Despliegue en Render

### 📋 Prerrequisitos
- Cuenta en [Render.com](https://render.com/)
- Repositorio Git (GitHub, GitLab, etc.)
- Bases de datos externas configuradas

### 🔧 Configuración de Variables de Entorno en Render

En el dashboard de Render, configura estas variables de entorno:

#### 🌐 Variables Generales
```bash
NODE_ENV=production
PORT=3000
API_PREFIX=api/v1
```

#### 🗄️ Base de Datos PostgreSQL
```bash
# Usar servicio PostgreSQL de Render o externo
DB_HOST=tu-postgres-host.render.com
DB_PORT=5432
DB_USERNAME=tu-usuario
DB_PASSWORD=tu-password-segura
DB_NAME=ink_heaven_db
```

#### 📊 Base de Datos MongoDB
```bash
# Usar MongoDB Atlas o servicio externo
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ink_heaven_logs?retryWrites=true&w=majority
```

#### 🔐 Autenticación JWT
```bash
# Genera una clave segura para producción
JWT_SECRET=tu-super-secreto-jwt-para-produccion-muy-largo-y-seguro
JWT_EXPIRES_IN=7d
```

### 📦 Pasos para Desplegar en Render

#### 1. Preparar el Repositorio
```bash
# Asegúrate de que todos los archivos estén commiteados
git add .
git commit -m "Add Docker configuration for Render deployment"
git push origin main
```

#### 2. Crear el Servicio en Render
1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Haz clic en **"New +"** → **"Web Service"**
3. Conecta tu repositorio Git
4. Selecciona la rama `main`

#### 3. Configuración del Servicio
```yaml
# Configuración automática detectada por Render
Build Command: docker build -t ink-heaven-backend .
Start Command: docker run -p 3000:3000 ink-heaven-backend
```

**O usa la configuración manual:**
- **Environment**: Docker
- **Build Command**: `npm run build`
- **Start Command**: `npm run start:prod`
- **Node Version**: 18

#### 4. Variables de Entorno
Añade todas las variables listadas arriba en la sección **"Environment Variables"**

#### 5. Configuración Avanzada
```yaml
# En el archivo render.yaml (opcional)
services:
  - type: web
    name: ink-heaven-backend
    env: docker
    plan: starter
    buildCommand: docker build -t ink-heaven-backend .
    startCommand: docker run -p $PORT:3000 ink-heaven-backend
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        fromService:
          type: web
          name: ink-heaven-backend
          property: port
```

## 🗄️ Configuración de Bases de Datos

### PostgreSQL en Render
1. Crea un servicio **PostgreSQL** en Render
2. Copia las credenciales de conexión
3. Actualiza las variables `DB_*` en tu servicio web

### MongoDB Atlas (Recomendado)
1. Crea un cluster en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Configura un usuario de base de datos
3. Obtén la cadena de conexión
4. Actualiza `MONGODB_URI`

## 🔧 Desarrollo Local con Docker

### Iniciar todo el stack
```bash
# Construir e iniciar todos los servicios
docker-compose up --build

# En modo detached (background)
docker-compose up -d --build
```

### Comandos útiles
```bash
# Ver logs de la aplicación
docker-compose logs -f app

# Ver logs de PostgreSQL
docker-compose logs -f postgres

# Ver logs de MongoDB
docker-compose logs -f mongodb

# Acceder al contenedor de la aplicación
docker-compose exec app sh

# Parar todos los servicios
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v
```

### Verificar que todo funciona
```bash
# Health check
curl http://localhost:3000/api/v1/health

# Base de datos PostgreSQL
curl http://localhost:3000/api/v1/health/postgres

# Base de datos MongoDB
curl http://localhost:3000/api/v1/health/mongodb
```

## 🚀 Scripts de Despliegue

### Build local
```bash
# Construir imagen Docker
docker build -t ink-heaven-backend .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env ink-heaven-backend
```

### Push a Registry (opcional)
```bash
# Tag para registry
docker tag ink-heaven-backend your-registry.com/ink-heaven-backend:latest

# Push
docker push your-registry.com/ink-heaven-backend:latest
```

## 🔍 Troubleshooting

### Problemas Comunes

#### Error de conexión a BD
```bash
# Verificar variables de entorno
docker-compose exec app printenv | grep DB_

# Verificar conectividad
docker-compose exec app ping postgres
```

#### Puerto ocupado
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Cambiar 3000 por 3001
```

#### Problemas de memoria
```bash
# Limpiar Docker
docker system prune -a

# Verificar uso de recursos
docker stats
```

### Logs y Debugging
```bash
# Logs detallados
docker-compose logs --tail=100 -f

# Acceder al contenedor para debug
docker-compose exec app sh
cd /app
npm run start:debug
```

## 📋 Checklist de Despliegue

### ✅ Pre-despliegue
- [ ] Variables de entorno configuradas
- [ ] Bases de datos creadas y accesibles
- [ ] JWT_SECRET generado para producción
- [ ] Dockerfile optimizado
- [ ] .dockerignore configurado
- [ ] Código commiteado y pusheado

### ✅ Post-despliegue
- [ ] Health checks funcionando
- [ ] Conectividad a bases de datos
- [ ] Endpoints de autenticación funcionando
- [ ] CORS configurado correctamente
- [ ] Logs sin errores críticos

### 🔒 Seguridad
- [ ] JWT_SECRET seguro y único
- [ ] Passwords de BD seguras
- [ ] Variables sensibles como secretos
- [ ] HTTPS habilitado en Render
- [ ] Rate limiting configurado

## 🌐 URLs de Producción
Después del despliegue, tu API estará disponible en:
```
https://tu-servicio.onrender.com/api/v1/
```

### Health Check
```
GET https://tu-servicio.onrender.com/api/v1/health
```

### Documentación
```
GET https://tu-servicio.onrender.com/api/v1/
```

## 💡 Tips de Optimización

1. **Use PostgreSQL y MongoDB externos** para mejor rendimiento
2. **Configure Redis** para caché si es necesario
3. **Habilite logging estructurado** para producción
4. **Configure monitoring** con Render Analytics
5. **Use CDN** para assets estáticos si los tienes

¡Tu API Ink Heaven está lista para producción! 🎉
