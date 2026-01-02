# 🚀 LOCAL_SETUP - Guía de Configuración Local

## Estado Actual (Enero 2, 2026)

**MVP Completamente Funcional y Listo para Ejecutar**

✅ Backend API Rest con Express.js + TypeScript + Firestore
✅ Frontend React con formulario interactivo
✅ Integración con Vertex AI Gemini configurada
✅ Estructura full-stack documentada
✅ 30+ archivos documentales

---

## 📋 Requisitos Previos

- **Node.js 18+** (verificar con `node --version`)
- **npm 9+** (verificar con `npm --version`)
- **Git** instalado
- **Cuenta Google Cloud** con Vertex AI habilitado
- **Firebase Project** (Google Cloud)
- **Editor de código** (VS Code recomendado)

---

## ⚡ Setup Rápido (5 Minutos)

### 1️⃣ Clonar Repositorio

```bash
git clone https://github.com/juancerdasanmartin-cell/gems-simce-api-platform.git
cd gems-simce-api-platform
```

### 2️⃣ Configurar Backend

```bash
cd backend
npm install
cp .env.example .env
```

**Editar `.env` con tus credenciales:**

```bash
PORT=3001
NODE_ENV=development

# Gemini API
GEMINI_API_KEY=tu-clave-aqui  # Obtener en https://console.cloud.google.com/apis

# Firebase
FIREBASE_PROJECT_ID=prueba-general-login
FIREBASE_PRIVATE_KEY="tu-private-key"
FIREBASE_CLIENT_EMAIL="tu-email"

# Jumpseller (Fase 2)
JUMPSELLER_API_KEY=tu-jumpseller-key
```

### 3️⃣ Configurar Frontend

```bash
cd ../frontend
npm install
```

**El frontend se conecta automáticamente a `http://localhost:3001`**

Si necesitas cambiar el puerto, edita en `frontend/src/App.tsx`:

```typescript
const API_URL = 'http://localhost:3001';  // Cambiar aquí
```

---

## 🎯 Ejecutar en Modo Desarrollo

### Terminal 1 - Backend

```bash
cd backend
npm start
# Resultado: ✅ Backend corriendo en http://localhost:3001
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
# Resultado: ✅ Frontend corriendo en http://localhost:5173
```

---

## 🧪 Probar la Aplicación

1. Abre http://localhost:5173 en tu navegador
2. Ingresa datos de prueba:
   - **Nombre de Escuela:** "Liceo Nacional"
   - **Asignatura:** "Matemáticas"
3. Haz clic en "✨ Generar Gema"
4. Verás el plan de mejora generado por IA

---

## 🔌 API Endpoints para Testing

```bash
# Health Check
curl http://localhost:3001/health

# Listar todas las gemas generadas
curl http://localhost:3001/api/v1/gems

# Crear nueva gema (con Gemini)
curl -X POST http://localhost:3001/api/v1/gems \
  -H "Content-Type: application/json" \
  -d '{
    "schoolName": "Liceo Santiago",
    "subject": "Lenguaje",
    "currentLevel": 180,
    "targetLevel": 220
  }'

# Obtener gema específica
curl http://localhost:3001/api/v1/gems/{id}
```

---

## 🔐 Obtener Credenciales

### Google Cloud API Key

1. Ve a https://console.cloud.google.com
2. Selecciona tu proyecto "prueba-general-login"
3. Ve a APIs & Services → Credentials
4. Crea una API Key (si no existe)
5. Copia la clave en `.env` → `GEMINI_API_KEY`

### Firebase Credentials

1. Ve a https://console.firebase.google.com
2. Selecciona "prueba-general-login"
3. Project Settings → Service Accounts
4. Generate New Private Key (si es necesario)
5. Descarga el JSON y copia los valores al `.env`

---

## 🐛 Troubleshooting

### "Error: listen EADDRINUSE :::3001"

**Solución:** El puerto 3001 ya está en uso

```bash
# Cambiar puerto en .env
PORT=3002

# O matar el proceso
lsof -ti:3001 | xargs kill -9
```

### "Error: GEMINI_API_KEY not found"

**Solución:** Agregar la clave en `.env`

```bash
cd backend
nano .env  # Editar archivo
# Agregar: GEMINI_API_KEY=tu-clave-aqui
```

### "CORS Error"

**Solución:** Ya está configurado en backend

Si persiste, verifica que el frontend esté en puerto 5173 y backend en 3001

### Frontend no conecta con Backend

**Solución:** Verificar URL en `frontend/src/App.tsx`

```typescript
const API_URL = 'http://localhost:3001';  // Asegurar que es correcta
```

---

## 📁 Estructura de Carpetas

```
Gems SIMCE API Platform/
├── backend/
│   ├── src/
│   │   └── app.ts              # Backend principal (Express + Gemini)
│   ├── .env.example            # Template de variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   └── App.tsx             # Componente React principal
│   ├── vite.config.ts          # Config de Vite
│   └── package.json
├── QUICK_RUN.md                # Guía rápida (5 min)
├── LOCAL_SETUP.md              # Esta guía
├── ARCHITECTURE.md             # Diseño técnico
└── README.md                   # Documentación completa
```

---

## 🚀 Próximos Pasos

Después de confirmar que funciona localmente:

1. **Fase 2:** Agregar Dashboard con gráficos
2. **Fase 3:** Autenticación Firebase
3. **Fase 4:** Integración Jumpseller
4. **Fase 5:** Deploy a Cloud Run

---

## 📞 Referencias Documentales

- **QUICK_RUN.md** - Ejecución en 5 minutos
- **ARCHITECTURE.md** - Diseño técnico y decisiones
- **API_EXAMPLES.md** - Ejemplos de API con cURL
- **DEPLOYMENT.md** - Guía de deploy a Cloud Run

---

**Última actualización:** Enero 2, 2026
**Estado:** ✅ Listo para desarrollo local
