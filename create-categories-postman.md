# Crear Categorías usando Postman

## 1. Primero obtén el token de autenticación

**POST** `https://inkheaven-backend.onrender.com/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "melifer.j1995@gmail.com",
  "password": "admin123"
}
```

**Respuesta:** Copia el `access_token` que recibes.

## 2. Crear Categorías

Para cada categoría, usa:

**POST** `https://inkheaven-backend.onrender.com/categories`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {tu_access_token_aqui}
```

### Categoría 1: Máquinas
```json
{
  "name": "Máquinas",
  "description": "Máquinas de tatuar y equipos principales",
  "icono": "⚙️",
  "activa": true,
  "orden": 1
}
```

### Categoría 2: Agujas
```json
{
  "name": "Agujas",
  "description": "Agujas y cartuchos para tatuar",
  "icono": "🔹",
  "activa": true,
  "orden": 2
}
```

### Categoría 3: Tintas
```json
{
  "name": "Tintas",
  "description": "Tintas de colores y pigmentos",
  "icono": "🎨",
  "activa": true,
  "orden": 3
}
```

### Categoría 4: Protección
```json
{
  "name": "Protección",
  "description": "Equipos de protección e higiene",
  "icono": "🛡️",
  "activa": true,
  "orden": 4
}
```

### Categoría 5: Electrónicos
```json
{
  "name": "Electrónicos",
  "description": "Fuentes de poder y accesorios electrónicos",
  "icono": "⚡",
  "activa": true,
  "orden": 5
}
```

### Categoría 6: Cuidado
```json
{
  "name": "Cuidado",
  "description": "Productos de cuidado y aftercare",
  "icono": "💊",
  "activa": true,
  "orden": 6
}
```

## 3. Verificar las categorías creadas

**GET** `https://inkheaven-backend.onrender.com/categories`

**Headers:**
```
Authorization: Bearer {tu_access_token_aqui}
```

## Notas importantes:
- El token expira después de un tiempo, si obtienes error 401, vuelve a hacer login
- Todas las operaciones de categorías requieren rol de administrador
- Los campos `description`, `icono`, `activa` y `orden` son opcionales
- El campo `name` es obligatorio
