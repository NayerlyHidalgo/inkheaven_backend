#!/bin/bash

# Build script para Render
echo "🚀 Starting Ink Heaven API build process..."

# Limpiar directorio dist si existe
echo "🧹 Cleaning previous build..."
rm -rf dist

# Instalar dependencias
echo "📦 Installing dependencies..."
npm ci --only=production

# Construir la aplicación
echo "🔨 Building application..."
npm run build

# Verificar que el build fue exitoso
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

if [ ! -f "dist/main.js" ]; then
    echo "❌ Build failed - main.js not found"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📂 Dist directory contents:"
ls -la dist/

echo "🎉 Ready for deployment!"
