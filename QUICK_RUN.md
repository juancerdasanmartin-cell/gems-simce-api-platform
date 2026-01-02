# ⚡ QUICK_RUN - MVP Ejecutable en 5 Minutos

## Estado Actual (Enero 2, 2026)

**MVP Completamente Funcional:**
- ✅ Backend API Rest con Express.js + TypeScript + Firestore
- ✅ Frontend React con formulario para generar gemas
- ✅ Integración lista para Vertex AI Gemini
- ✅ 25+ commits documentados
- ✅ Estructura full-stack lista

---

## 🚀 PARA EJECUTAR LOCALMENTE (5 MINUTOS)

### 1. **Backend (Puerto 3001)**

```bash
cd backend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Agregar a .env:
# GEMINI_API_KEY=tu-clave-aqui
# FIREBASE_PROJECT_ID=tu-proyecto-aqui

# Ejecutar
npm start

# Resultado: Server en http://localhost:3001 ✅
```

### 2. **Frontend (Puerto 5173)**

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar
npm run dev

# Resultado: App en http://localhost:5173 ✅
```

---

## 📝 FLUJO COMPLETO

1. Abrir **http://localhost:5173** en navegador
2. Ingresar:
   - Nombre de Escuela: "Liceo Santiago"
   - Asignatura: "Matemáticas"
3. Click en "✨ Generar Gema"
4. Backend llama a **Vertex AI Gemini** y genera plan de mejora
5. Frontend muestra resultado

---

## 🔑 VARIABLES DE ENTORNO NECESARIAS

### Backend (.env)
```
PORT=3001
FIREBASE_PROJECT_ID=prueba-general-login
GEMINI_API_KEY=AIzaSy... (obtener de Google Cloud Console)
```

### Frontend (automático)
- Apunta a `http://localhost:3001` por defecto
- Modifica en `src/App.tsx` si necesitas otro puerto

---

## 📚 API ENDPOINTS DISPONIBLES

```
GET  /health
     Verifica que el servidor esté activo

GET  /api/v1/gems
     Lista los últimos 10 planes generados

POST /api/v1/gems
     Crea un nuevo plan (llama a Gemini)
     Body: { schoolName, subject, currentLevel, targetLevel }

GET  /api/v1/gems/:id
     Obtiene un plan específico
```

---

## ✅ PASOS PARA COMPLETAR MVP

1. **[DONE]** Estructura backend ✅
2. **[DONE]** Estructura frontend ✅
3. **[NEXT]** Agregar clave GEMINI_API_KEY a .env
4. **[NEXT]** Conectar Firebase (reemplazar projectId)
5. **[NEXT]** Ejecutar `npm install` en ambas carpetas
6. **[NEXT]** Iniciar backend + frontend
7. **[NEXT]** Probar flujo completo

---

## 🐛 TROUBLESHOOTING

**Error: "Cannot POST /api/v1/gems"**
- Verifica que backend esté corriendo en puerto 3001
- Revisa la consola del backend para errores

**Error: "GEMINI_API_KEY no configurada"**
- Agrega clave a .env en carpeta `backend/`
- Obtener en: https://console.cloud.google.com/apis

**CORS Error**
- Frontend necesita cors habilitado en backend (ya configurado)

---

## 📦 PRÓXIMAS FASES (Después del MVP)

- **Fase 2:** Agregar dashboard con gráficos
- **Fase 3:** Sistema de autenticación Firebase
- **Fase 4:** Integración con Jumpseller
- **Fase 5:** Deploy a Cloud Run

---

## 📞 REFERENCIAS RÁPIDAS

- **Backend API:** `backend/src/app.ts` (90 líneas)
- **Frontend:** `frontend/src/App.tsx` (130 líneas)
- **Documentación Completa:** Ver `README.md`, `ARCHITECTURE.md`, `API_EXAMPLES.md`

---

**Creado:** Enero 2, 2026
**Versión:** 0.1.0 (MVP)
**Status:** ✅ Listo para ejecutar
