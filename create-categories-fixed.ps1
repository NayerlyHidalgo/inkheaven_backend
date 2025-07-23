Write-Host "Creando categorias para Ink Heaven..." -ForegroundColor Green

# Obtener token
$loginBody = '{"email":"melifer.j1995@gmail.com","password":"admin123"}'
$loginResponse = Invoke-RestMethod -Uri "https://inkheaven-backend.onrender.com/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.access_token
$headers = @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"}

Write-Host "Token obtenido exitosamente" -ForegroundColor Green

# Crear categoria 1: Maquinas
$cat1 = '{"name":"Maquinas","description":"Maquinas de tatuar rotativas, bobinas y equipos principales","activa":true,"orden":1}'
try {
    $result1 = Invoke-RestMethod -Uri "https://inkheaven-backend.onrender.com/categories" -Method POST -Body $cat1 -Headers $headers
    Write-Host "Categoria Maquinas creada exitosamente" -ForegroundColor Green
} catch {
    Write-Host "Error creando Maquinas: $($_.Exception.Message)" -ForegroundColor Red
}

# Crear categoria 2: Agujas
$cat2 = '{"name":"Agujas","description":"Agujas, cartuchos y accesorios para tatuar","activa":true,"orden":2}'
try {
    $result2 = Invoke-RestMethod -Uri "https://inkheaven-backend.onrender.com/categories" -Method POST -Body $cat2 -Headers $headers
    Write-Host "Categoria Agujas creada exitosamente" -ForegroundColor Green
} catch {
    Write-Host "Error creando Agujas: $($_.Exception.Message)" -ForegroundColor Red
}

# Crear categoria 3: Tintas
$cat3 = '{"name":"Tintas","description":"Tintas de colores, pigmentos y productos colorantes","activa":true,"orden":3}'
try {
    $result3 = Invoke-RestMethod -Uri "https://inkheaven-backend.onrender.com/categories" -Method POST -Body $cat3 -Headers $headers
    Write-Host "Categoria Tintas creada exitosamente" -ForegroundColor Green
} catch {
    Write-Host "Error creando Tintas: $($_.Exception.Message)" -ForegroundColor Red
}

# Crear categoria 4: Proteccion
$cat4 = '{"name":"Proteccion","description":"Equipos de proteccion, higiene y seguridad","activa":true,"orden":4}'
try {
    $result4 = Invoke-RestMethod -Uri "https://inkheaven-backend.onrender.com/categories" -Method POST -Body $cat4 -Headers $headers
    Write-Host "Categoria Proteccion creada exitosamente" -ForegroundColor Green
} catch {
    Write-Host "Error creando Proteccion: $($_.Exception.Message)" -ForegroundColor Red
}

# Crear categoria 5: Electronicos
$cat5 = '{"name":"Electronicos","description":"Fuentes de poder, cables y accesorios electronicos","activa":true,"orden":5}'
try {
    $result5 = Invoke-RestMethod -Uri "https://inkheaven-backend.onrender.com/categories" -Method POST -Body $cat5 -Headers $headers
    Write-Host "Categoria Electronicos creada exitosamente" -ForegroundColor Green
} catch {
    Write-Host "Error creando Electronicos: $($_.Exception.Message)" -ForegroundColor Red
}

# Crear categoria 6: Cuidado
$cat6 = '{"name":"Cuidado","description":"Productos de cuidado, aftercare y cicatrizacion","activa":true,"orden":6}'
try {
    $result6 = Invoke-RestMethod -Uri "https://inkheaven-backend.onrender.com/categories" -Method POST -Body $cat6 -Headers $headers
    Write-Host "Categoria Cuidado creada exitosamente" -ForegroundColor Green
} catch {
    Write-Host "Error creando Cuidado: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar categorias creadas
Write-Host "" -ForegroundColor White
Write-Host "Verificando categorias creadas..." -ForegroundColor Yellow
try {
    $allCategories = Invoke-RestMethod -Uri "https://inkheaven-backend.onrender.com/categories" -Method GET
    Write-Host "Total de categorias: $($allCategories.Count)" -ForegroundColor Green
    Write-Host "Lista de categorias:" -ForegroundColor Cyan
    foreach ($cat in $allCategories) {
        Write-Host "  - $($cat.name): $($cat.description)" -ForegroundColor White
    }
} catch {
    Write-Host "Error obteniendo categorias: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "" -ForegroundColor White
Write-Host "Proceso completado!" -ForegroundColor Green
