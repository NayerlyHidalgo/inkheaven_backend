# 📮 Guía de Uso - Colección Postman Ink Heaven API

## 🚀 Importar la Colección

### 1. Importar Colección
1. Abre Postman
2. Haz clic en **"Import"**
3. Selecciona el archivo `Ink-Heaven-API.postman_collection.json`
4. Haz clic en **"Import"**

### 2. Importar Variables de Entorno
1. En Postman, ve a **"Environments"**
2. Haz clic en **"Import"**
3. Selecciona el archivo `Ink-Heaven-Environment.postman_environment.json`
4. Selecciona el environment **"Ink Heaven - Development"**

## 🔐 Configuración de Autenticación

### Paso 1: Registrar/Entrar con Usuario
La colección incluye 3 tipos de usuarios predefinidos:

#### � Cliente (Permisos básicos)
1. Ejecuta **"Register User"** o **"Login User"**
   - Email: `juan@example.com`
   - Password: `password123`

#### 👨‍🎨 Artista (Permisos de artista)
1. Ejecuta **"Register Artist"** o **"Login Artist"**
   - Email: `carlos@inkheaven.com`
   - Password: `artist123`

#### 👑 Administrador (Permisos completos)
1. Ejecuta **"Register Admin"** o **"Login Admin"**
   - Email: `admin@inkheaven.com`
   - Password: `admin123`

### Paso 2: Verificar Token
- Después del login/registro, el token se guarda automáticamente
- Puedes verificar en **Environment Variables** que `access_token` tiene valor
- Todos los otros endpoints usarán este token automáticamente

### 💡 Tip: Cambiar de Usuario
- Para probar diferentes permisos, simplemente ejecuta el login del usuario que necesites
- El token se actualizará automáticamente

## 📋 Orden Recomendado de Pruebas

### 1️⃣ Health Check (Sin autenticación)
```
GET /health - Estado general
GET /health/postgres - Estado PostgreSQL
GET /health/mongodb - Estado MongoDB  
GET /health/detailed - Información detallada
```

### 2️⃣ Autenticación
```
POST /auth/register - Registrar cliente
POST /auth/login - Login cliente
POST /auth/register - Registrar administrador (admin@inkheaven.com)
POST /auth/login - Login administrador
POST /auth/register - Registrar artista (carlos@inkheaven.com)  
POST /auth/login - Login artista
GET /auth/profile - Ver perfil
GET /auth/me - Información del usuario actual
```

### 3️⃣ Usuarios
```
GET /users - Listar usuarios (requiere rol admin)
GET /users/profile - Mi perfil
GET /users/:id - Usuario específico
PATCH /users/:id - Actualizar usuario
DELETE /users/:id - Eliminar usuario
```

### 4️⃣ Productos
```
POST /products - Crear producto (admin)
GET /products - Listar productos
GET /products/:id - Producto específico
PATCH /products/:id - Actualizar producto
DELETE /products/:id - Eliminar producto
GET /products/style/:style - Por categoría
GET /products/price-range/:min/:max - Por precio
```

### 5️⃣ Artistas
```
POST /artists - Crear artista (admin)
GET /artists - Listar artistas
GET /artists/available - Artistas disponibles
GET /artists/featured - Artistas destacados
GET /artists/me - Mi perfil de artista
GET /artists/:id - Artista específico
PATCH /artists/:id - Actualizar artista
PATCH /artists/:id/toggle-availability - Cambiar disponibilidad
GET /artists/:id/portfolio-summary - Resumen portafolio
DELETE /artists/:id - Eliminar artista
```

### 6️⃣ Citas
```
POST /appointments - Crear cita
GET /appointments - Listar citas
GET /appointments/my-appointments - Mis citas
GET /appointments/upcoming - Citas próximas
GET /appointments/artist/:artistId - Por artista
GET /appointments/user/:userId - Por usuario
GET /appointments/:id - Cita específica
PATCH /appointments/:id - Actualizar cita
PATCH /appointments/:id/status - Cambiar estado
GET /appointments/availability/:artistId/:date - Disponibilidad
DELETE /appointments/:id/cancel - Cancelar cita
DELETE /appointments/:id - Eliminar cita
```

### 7️⃣ Reseñas
```
POST /reviews - Crear reseña
GET /reviews - Listar reseñas
GET /reviews/featured - Reseñas destacadas
GET /reviews/artist/:artistId - Por artista
GET /reviews/artist/:artistId/stats - Estadísticas
GET /reviews/user/:userId - Por usuario
GET /reviews/:id - Reseña específica
PATCH /reviews/:id - Actualizar reseña
PATCH /reviews/:id/moderate - Moderar (admin)
PATCH /reviews/:id/toggle-featured - Destacar (admin)
DELETE /reviews/:id - Eliminar reseña
```

### 8️⃣ Portafolio
```
POST /portfolio - Crear trabajo
GET /portfolio - Listar trabajos
GET /portfolio/featured - Trabajos destacados
GET /portfolio/popular - Trabajos populares
GET /portfolio/search?q=term - Buscar trabajos
GET /portfolio/style/:style - Por estilo
GET /portfolio/artist/:artistId - Por artista
GET /portfolio/artist/:artistId/stats - Estadísticas
GET /portfolio/my-portfolio - Mi portafolio
GET /portfolio/:id - Trabajo específico
PATCH /portfolio/:id - Actualizar trabajo
PATCH /portfolio/:id/like - Dar like
PATCH /portfolio/:id/unlike - Quitar like
PATCH /portfolio/:id/toggle-featured - Destacar (admin)
DELETE /portfolio/:id - Eliminar trabajo
```

## 🔑 Roles y Permisos

### 👤 Cliente (client)
**Credenciales:** `juan@example.com` / `password123`
- ✅ **Ver contenido público:** productos, artistas, portfolio
- ✅ **Crear:** citas, reseñas  
- ✅ **Gestionar:** su perfil personal
- ✅ **Acceder:** a sus propias citas y reseñas
- ❌ **Prohibido:** crear/editar productos, gestionar otros usuarios

### 👨‍🎨 Artista (artist)  
**Credenciales:** `carlos@inkheaven.com` / `artist123`
- ✅ **Todo lo del cliente** +
- ✅ **Gestionar:** su perfil de artista específico (`/artists/me`)
- ✅ **Ver:** sus citas asignadas (`/appointments/my-appointments`)
- ✅ **Gestionar:** su portafolio personal (`/portfolio/my-portfolio`)
- ✅ **Cambiar:** su disponibilidad (`/artists/:id/toggle-availability`)
- ✅ **Actualizar:** sus datos de artista (solo el suyo)
- ❌ **Prohibido:** funciones administrativas, gestionar otros artistas

### 👑 Administrador (admin)
**Credenciales:** `admin@inkheaven.com` / `admin123`
- ✅ **Acceso completo** a todos los endpoints
- ✅ **PRODUCTOS:** crear, editar, eliminar todos los productos
- ✅ **ARTISTAS:** crear, editar, eliminar cualquier artista
- ✅ **USUARIOS:** ver, editar, eliminar cualquier usuario
- ✅ **CITAS:** ver todas, gestionar cualquier cita
- ✅ **MODERACIÓN:** aprobar/rechazar reseñas, destacar contenido
- ✅ **ESTADÍSTICAS:** acceso a todos los reportes y métricas

## � Tabla de Verificación de Permisos

| Endpoint | Cliente | Artista | Admin | Notas |
|----------|---------|---------|-------|-------|
| **PRODUCTOS** |
| `GET /products` | ✅ | ✅ | ✅ | Público |
| `POST /products` | ❌ | ❌ | ✅ | Solo admin |
| `PATCH /products/:id` | ❌ | ❌ | ✅ | Solo admin |
| `DELETE /products/:id` | ❌ | ❌ | ✅ | Solo admin |
| **ARTISTAS** |
| `GET /artists` | ✅ | ✅ | ✅ | Público |
| `POST /artists` | ❌ | ❌ | ✅ | Solo admin |
| `PATCH /artists/:id` | ❌ | ✅* | ✅ | *Solo su perfil |
| `DELETE /artists/:id` | ❌ | ❌ | ✅ | Solo admin |
| `GET /artists/me` | ❌ | ✅ | ❌ | Solo artistas |
| **CITAS** |
| `POST /appointments` | ✅ | ❌ | ✅ | Clientes crean |
| `GET /appointments` | ❌ | ❌ | ✅ | Solo admin ve todas |
| `GET /appointments/my-appointments` | ✅ | ✅ | ✅ | Propias citas |
| **USUARIOS** |
| `GET /users` | ❌ | ❌ | ✅ | Solo admin |
| `GET /users/profile` | ✅ | ✅ | ✅ | Propio perfil |
| **RESEÑAS** |
| `POST /reviews` | ✅ | ✅ | ✅ | Todos pueden crear |
| `PATCH /reviews/:id/moderate` | ❌ | ❌ | ✅ | Solo moderación |
| **PORTFOLIO** |
| `POST /portfolio` | ❌ | ✅ | ✅ | Artistas y admin |
| `GET /portfolio/my-portfolio` | ❌ | ✅ | ❌ | Solo artistas |

## �📝 Variables Dinámicas

La colección incluye scripts que automáticamente:
- **Guardan el token** después del login/registro
- **Actualizan variables** con IDs de recursos creados
- **Manejan la autenticación** en todos los endpoints

## 🛠️ Personalización

### Cambiar la URL base
```json
{
  "key": "base_url",
  "value": "https://tu-api.com" // Cambiar para producción
}
```

### Datos de prueba incluidos
- **Usuario Cliente** para registro/login
- **Usuario Administrador** con permisos completos
- **Usuario Artista** con permisos de artista
- Productos de muestra
- Artistas con especialidades
- Citas con fechas futuras
- Reseñas con ratings
- Portfolio con trabajos realistas

## 🚦 Estados de Respuesta

### ✅ Éxito
- `200` - OK (GET, PATCH)
- `201` - Created (POST)
- `204` - No Content (DELETE)

### ❌ Errores Comunes
- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (token inválido)
- `403` - Forbidden (sin permisos)
- `404` - Not Found (recurso no existe)
- `409` - Conflict (recurso duplicado)

## 🔍 Tips de Uso

1. **Siempre hacer login primero** para obtener el token
2. **Verificar el environment** antes de ejecutar requests
3. **Revisar los logs** en la consola de Postman
4. **Usar los health checks** para verificar conectividad
5. **Probar diferentes roles** cambiando el usuario

### 🚀 Flujo de Pruebas Recomendado

1. **Health Check** - Verificar que todo esté funcionando
2. **Login como Cliente** - Probar funcionalidades básicas (citas, reseñas)
3. **Login como Administrador** - Crear productos y artistas, moderar contenido
4. **Login como Artista** - Gestionar portfolio, ver citas asignadas, actualizar perfil
5. **Probar restricciones** - Intentar acciones no permitidas para verificar seguridad

### 📧 Credenciales Rápidas
- **Cliente:** `juan@example.com` / `password123`
- **Artista:** `carlos@inkheaven.com` / `artist123`  
- **Admin:** `admin@inkheaven.com` / `admin123`

### ✅ Estado de Implementación
- 🔐 **Autenticación JWT:** Implementada
- 🛡️ **Control de Roles:** Verificado y corregido
- 📋 **Validación de DTOs:** Implementada
- 🔗 **Relaciones de BD:** Configuradas
- 📊 **Endpoints avanzados:** Implementados
- 🚨 **Manejo de errores:** Configurado

¡Happy Testing! 🎉
