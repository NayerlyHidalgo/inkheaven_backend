# 🚀 Despliegue Rápido - Ink Heaven API en Render

## ✅ Tu Configuración Actual
- **PostgreSQL**: Neon Database (✅ Configurado)
- **MongoDB**: Atlas Cluster (✅ Configurado)  
- **JWT**: Secret configurado (✅ Configurado)
- **Email**: Gmail SMTP (✅ Configurado)

## 🔥 Pasos para Deploy INMEDIATO

### 1. Verificar Conectividad (Recomendado)
```bash
npm run test:db
```
Esto verificará que todas tus bases de datos funcionen correctamente.

### 2. Preparar para Deploy
```bash
npm run deploy:render
```
Esto ejecutará las pruebas y el build.

### 3. Push a GitHub
```bash
git add .
git commit -m "Ready for Render deployment with Neon and Atlas"
git push origin main
```

### 4. Crear Servicio en Render

#### Opción A: Automática (render.yaml)
1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Conecta tu repo GitHub
4. Render detectará automáticamente el `render.yaml`
5. ✅ ¡Deploy automático!

#### Opción B: Manual
1. **Environment**: Docker
2. **Build Command**: `npm run build`
3. **Start Command**: `npm run start:prod`
4. **Node Version**: 18

### 5. Variables de Entorno CRÍTICAS

En Render Dashboard, añade estas variables como **SECRETS**:

```bash
# 🔒 SECRETS (importantes)
DB_PASSWORD=npg_of5RCcqbj8Ti
MONGODB_URI=mongodb+srv://meliferj1995:M3l5N128.12@clustermongoutenh.m2ekh9a.mongodb.net/ink_heaven_logs?retryWrites=true&w=majority&appName=ClusterMongoUteNH&maxPoolSize=10&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&family=4
JWT_SECRET=npg_XvWzBkJr49UP
GMAIL_APP_PASSWORD=llmm elbg vyac mqrs
```

Variables normales:
```bash
NODE_ENV=production
DB_HOST=ep-lively-sun-aacyqxnp-pooler.westus3.azure.neon.tech
DB_PORT=5432
DB_USERNAME=neondb_owner
DB_NAME=neondb
DB_SSL=true
JWT_EXPIRES_IN=365d
GMAIL_USER=melifer.j1995@gmail.com
API_PREFIX=api/v1
```

### 6. Verificar Deploy

Una vez desplegado, verifica:

```bash
# Health Check General
curl https://tu-app.onrender.com/api/v1/health

# Health Check PostgreSQL
curl https://tu-app.onrender.com/api/v1/health/postgres

# Health Check MongoDB  
curl https://tu-app.onrender.com/api/v1/health/mongodb
```

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
```bash
# Verificar variables en Render
# Asegurar que DB_SSL=true
# Verificar que MONGODB_URI esté completa
```

### Error: "JWT malformed"
```bash
# Verificar que JWT_SECRET esté configurado como SECRET
# Longitud mínima: 16 caracteres
```

### Error: "CORS"
```bash
# Añadir tu dominio frontend a CORS_ORIGIN
CORS_ORIGIN=https://tu-frontend.vercel.app
```

## 📊 Monitoring

Después del deploy, monitorea:
- **Logs** en Render Dashboard
- **Health checks** cada 5 minutos
- **Database connections** (no más de 10 simultáneas)

## 🎯 URLs de Producción

```bash
# API Base
https://tu-servicio.onrender.com/api/v1/

# Health Checks
https://tu-servicio.onrender.com/api/v1/health
https://tu-servicio.onrender.com/api/v1/health/postgres
https://tu-servicio.onrender.com/api/v1/health/mongodb

# Authentication
https://tu-servicio.onrender.com/api/v1/auth/login
https://tu-servicio.onrender.com/api/v1/auth/register

# Postman Collection Base URL
# Actualizar la variable base_url en Postman:
https://tu-servicio.onrender.com
```

## ⚡ Optimizaciones POST-Deploy

1. **Habilitar CDN** en Render para assets estáticos
2. **Configurar alertas** para downtime
3. **Monitorear métricas** de base de datos
4. **Backup automático** (Neon y Atlas ya lo tienen)
5. **Rate limiting** personalizado por endpoint

## 🆘 Support Quick Commands

```bash
# Ver logs en tiempo real
render logs --service=tu-servicio --follow

# Restart servicio
render restart --service=tu-servicio

# Variables de entorno
render env --service=tu-servicio
```

---

## ✅ Checklist Final

- [ ] Bases de datos probadas (`npm run test:db`)
- [ ] Código pusheado a GitHub
- [ ] Servicio creado en Render
- [ ] Variables de entorno configuradas
- [ ] Health checks funcionando
- [ ] Postman collection actualizada con nueva URL

**¡Tu API está lista para producción!** 🎉

### 🔗 Enlaces Útiles
- [Render Dashboard](https://dashboard.render.com)
- [Neon Console](https://console.neon.tech/)
- [MongoDB Atlas](https://cloud.mongodb.com/)
- [Postman Collection](./Ink-Heaven-API.postman_collection.json)
