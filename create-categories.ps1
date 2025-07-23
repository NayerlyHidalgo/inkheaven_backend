# Script para crear categorías en Ink Heaven
Write-Host "🎯 Creando categorías para Ink Heaven..." -ForegroundColor Green

# 1. Obtener token de autenticación
Write-Host "📋 Paso 1: Obteniendo token de autenticación..." -ForegroundColor Yellow

$loginBody = @{
    email = "melifer.j1995@gmail.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "https://inkheaven-backend.onrender.com/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.access_token
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    Write-Host "✅ Token obtenido exitosamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo token: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Definir las categorías a crear
$categories = @(
    @{
        name = "Máquinas"
        description = "Máquinas de tatuar rotativas, bobinas y equipos principales"
        icono = "⚙️"
        activa = $true
        orden = 1
    },
    @{
        name = "Agujas"
        description = "Agujas, cartuchos y accesorios para tatuar"
        icono = "🔹"
        activa = $true
        orden = 2
    },
    @{
        name = "Tintas"
        description = "Tintas de colores, pigmentos y productos colorantes"
        icono = "🎨"
        activa = $true
        orden = 3
    },
    @{
        name = "Protección"
        description = "Equipos de protección, higiene y seguridad"
        icono = "🛡️"
        activa = $true
        orden = 4
    },
    @{
        name = "Electrónicos"
        description = "Fuentes de poder, cables y accesorios electrónicos"
        icono = "⚡"
        activa = $true
        orden = 5
    },
    @{
        name = "Cuidado"
        description = "Productos de cuidado, aftercare y cicatrización"
        icono = "💊"
        activa = $true
        orden = 6
    }
)

# 3. Crear cada categoría
Write-Host "📋 Paso 2: Creando categorías..." -ForegroundColor Yellow

$createdCategories = @()
foreach ($category in $categories) {
    try {
        Write-Host "   Creando: $($category.name)..." -ForegroundColor Cyan
        
        $categoryBody = $category | ConvertTo-Json
        $result = Invoke-RestMethod -Uri "https://inkheaven-backend.onrender.com/categories" -Method POST -Body $categoryBody -Headers $headers
        
        $createdCategories += $result
        Write-Host "   ✅ $($category.name) creada exitosamente (ID: $($result.id))" -ForegroundColor Green
        
        # Pequeña pausa entre creaciones
        Start-Sleep -Milliseconds 500
        
    } catch {
        Write-Host "   ❌ Error creando $($category.name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 4. Verificar categorías creadas
Write-Host "📋 Paso 3: Verificando categorías creadas..." -ForegroundColor Yellow

try {
    $allCategories = Invoke-RestMethod -Uri "https://inkheaven-backend.onrender.com/categories" -Method GET
    Write-Host "✅ Total de categorías en base de datos: $($allCategories.Count)" -ForegroundColor Green
    
    Write-Host "`n📋 Lista de categorías:" -ForegroundColor Cyan
    foreach ($cat in $allCategories) {
        Write-Host "   $($cat.icono) $($cat.name) - $($cat.description)" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Error obteniendo categorías: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 ¡Proceso completado!" -ForegroundColor Green
Write-Host "Ahora puedes usar estas categorías en tu aplicación." -ForegroundColor White
