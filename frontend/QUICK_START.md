# 🚀 QUICK START - Gems SIMCE API Platform

## Objetivos
Tener el MVP (backend + frontend) corriendo localmente y testeado en **1 hora**.

## Requisitos
- Node.js 18+
- Git
- API Keys: GEMINI_API_KEY (gratis en Google AI Studio)
- Terminal/CLI

## PASO 1: Clonar Repositorio (2 min)

```bash
git clone https://github.com/juancerdasanmartin-cell/gems-simce-api-platform.git
cd gems-simce-api-platform
```

## PASO 2: Setup Backend (10 min)

```bash
cd backend
npm install
cp .env.example .env
# IMPORTANTE: Edita .env y agrega tu GEMINI_API_KEY
npm run dev
```

**Resultado esperado**:
```
✅ Gems SIMCE API corriendo en puerto 3000
🔑 POST /gems/simce-lenguaje
💺 GET /health
```

## PASO 3: Testear Backend (5 min)

En otra terminal:

```bash
# Health check
curl http://localhost:3000/health

# Test completo (POST)
curl -X POST http://localhost:3000/gems/simce-lenguaje \
  -H "Content-Type: application/json" \
  -d '{
    "nivel": "8B",
    "resultado": 45,
    "estudiantes": 28,
    "vulnerabilidad": "75%",
    "recursos": "1 sala TIC, 2 docentes"
  }'
```

**Esperado**: Respuesta JSON con gem_simce completo (30-40 segundos)

## PASO 4: Setup Frontend (10 min)

```bash
cd ../frontend
npm install
npm run dev
```

**Resultado esperado**:
```
  ✅ Local: http://localhost:5173
```

## PASO 5: Verificar Todo Está Funcionando (5 min)

1. ✅ Backend levantado: http://localhost:3000/health
2. ✅ Frontend levantado: http://localhost:5173
3. ✅ Curl test exitoso (Step 3)

## Estructura de Carpetas

```
gems-simce-api-platform/
├── backend/          # Express + Gemini API
│   ├── src/
│   │   └── index.ts      # Servidor principal
│   ├── package.json
│   └── .env.example
├── frontend/         # React + Vite
│   ├── package.json
│   └── (src/ pendiente)
├── README.md         # Documentación principal
├── STATUS_FINAL.md   # Estado del proyecto
└── QUICK_START.md    # Esta guía
```

## Próximos Pasos (Después de QUICK START)

1. **Frontend Components**: Crear Dashboard, Login, Payment (2 días)
2. **Firebase Auth**: Integrar autenticación (1 día)
3. **Stripe Checkout**: Implementar pagos (1 día)
4. **Docker + Cloud Run**: Deployar backend (1 día)
5. **Jumpseller Webhook**: Conectar venta (1 día)

## Troubleshooting

### Error: `GEMINI_API_KEY not found`
```bash
# Asegúrate que .env tiene tu API key
cat backend/.env | grep GEMINI_API_KEY
```

### Error: `Port 3000 already in use`
```bash
# Cambiar puerto en backend/src/index.ts
const PORT = process.env.PORT || 3001;
```

### Error: `npm not found`
```bash
# Instala Node.js desde nodejs.org
node --version  # Debe ser v18+
```

## Comandos Rapidos

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev

# Terminal 3 - Testing
curl -X POST http://localhost:3000/gems/simce-lenguaje \
  -H "Content-Type: application/json" \
  -d '{"nivel":"8B","resultado":45}'
```

## Meta

✅ Backend operacional  
✅ Frontend estructura lista  
✅ MVP en GitHub público  
🜏 Timeline a venta: 2-3 semanas

## Soporte

Para problemas, revisa:
1. README.md
2. EXECUTION_PLAN_ALFA_1.md
3. STATUS_FINAL.md
4. backend/.env.example

---

**Status**: 🚀 Ready for execution  
**Duración esperada**: 1 hora  
**Dificultad**: 😊 Muy fácil
