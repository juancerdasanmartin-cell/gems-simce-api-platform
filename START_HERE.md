# START HERE - Gems SIMCE MVP

Bienvenido a Gems SIMCE API Platform

Este archivo te guia a traves de los pasos mas rapidos para ejecutar el MVP.

---

## RAPIDO: 5 Minutos

Si tienes prisa, esta es tu ruta:

```bash
cd backend
npm install && cp .env.example .env
# IMPORTANTE: Edita .env y agrega tu GEMINI_API_KEY
npm start

# Terminal 2 - Frontend
cd frontend
npm install && npm run dev
```

Luego abre: http://localhost:5173

---

## GUIAS COMPLETAS

Segun tu necesidad:

- Si quieres **ejecutar rapidamente** (5 min) -> Lee: QUICK_RUN.md
- Si quieres **todo configurado correctamente** -> Lee: LOCAL_SETUP.md
- Si quieres **entender la arquitectura** -> Lee: ARCHITECTURE.md
- Si quieres **ver ejemplos de API** -> Lee: API_EXAMPLES.md
- Si quieres **saber el estado actual** -> Lee: MVP_STATUS.md

---

## Requisitos Previos

- Node.js 18+
- npm 9+
- Cuenta Google Cloud (para Gemini API)
- Editor de codigo (VS Code recomendado)

---

## Obtener Credenciales

Google Gemini API Key:

1. Ve a: https://console.cloud.google.com
2. Selecciona proyecto: prueba-general-login
3. Ve a: APIs & Services > Credentials
4. Copia tu API Key en backend/.env:

GEMINI_API_KEY=tu-clave-aqui

---

## Flujo Completo

1. Usuario abre http://localhost:5173
2. Ingresa nombre de escuela + asignatura
3. Hace clic en Generar Gema
4. Frontend envia peticion al backend (localhost:3001)
5. Backend llama a Vertex AI Gemini
6. Gemini genera plan de mejora educativa
7. Se guarda en Firestore
8. Frontend muestra resultado

---

## Estructura del Proyecto

backend/              # Express.js + Firestore + Gemini
  src/app.ts        # API principal
  .env.example      # Variables de entorno
frontend/            # React + Vite
  src/App.tsx       # Componente principal
  .env.example      # Variables de entorno
QUICK_RUN.md         # Ejecucion rapida
LOCAL_SETUP.md       # Setup detallado
MVP_STATUS.md        # Estado del proyecto
README.md            # Documentacion completa

---

## Errores Comunes

Error: Puerto 3001 ya esta en uso
- Cambiar puerto en backend/.env: PORT=3002

Error: GEMINI_API_KEY not found
- Verifica que agregaste la clave en backend/.env

Frontend no se conecta al backend
- Backend corriendo en puerto 3001
- Frontend tiene URL correcta: http://localhost:3001

---

## Ultimo Paso

Despues de ejecutar exitosamente:

1. Abre http://localhost:5173
2. Prueba el formulario
3. Verifica que recibas un plan generado por IA

Si todo funciona: Felicidades! El MVP esta listo.

---

Plan Alfa 1 completado: Enero 2, 2026
Estado: LISTO PARA USAR
Proximos pasos: Fase 2 (Dashboard + Autenticacion)
