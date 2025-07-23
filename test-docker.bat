@echo off
echo 🐳 Testing Ink Heaven API Docker Container

echo 🔨 Building Docker image...
docker build -t ink-heaven-backend .

if %ERRORLEVEL% neq 0 (
    echo ❌ Docker build failed!
    pause
    exit /b 1
)

echo ✅ Docker build successful!

echo 🚀 Starting container...
echo 📍 API will be available at: http://localhost:3000/api/v1/health

docker run -p 3000:3000 ^
  -e NODE_ENV=production ^
  -e PORT=3000 ^
  -e API_PREFIX=api/v1 ^
  -e DB_HOST=host.docker.internal ^
  -e DB_PORT=5432 ^
  -e DB_USERNAME=postgres ^
  -e DB_PASSWORD=postgres123 ^
  -e DB_NAME=ink_heaven_db ^
  -e MONGODB_URI=mongodb://admin:admin123@host.docker.internal:27017/ink_heaven_logs?authSource=admin ^
  -e JWT_SECRET=test-jwt-secret-for-local-docker-testing-only ^
  -e JWT_EXPIRES_IN=7d ^
  --name ink-heaven-test ^
  --rm ^
  ink-heaven-backend

echo 🧹 Container stopped. Cleaning up...
docker rmi ink-heaven-backend 2>nul
