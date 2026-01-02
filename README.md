# 🎯 Gems SIMCE API Platform

**IA Generativa para Planes de Mejora Educativa Basados en SIMCE**

Plataforma completa que integra Gemini API, Firebase Auth, Stripe, y SendGrid para crear, gestionar y vender planes de mejora educativa (Gems SIMCE) a escuelas chilenas.

## 🚀 Stack Tecnológico (Opción B - Completo)

- **Backend**: Node.js + Express + TypeScript
- **Frontend Dashboard**: React 18 + TypeScript + Vite
- **IA Generativa**: Gemini 3 API (Vertex AI)
- **Autenticación**: Firebase Auth
- **Base de Datos**: Firestore
- **Pagos**: Stripe
- **Notificaciones**: SendGrid
- **Infraestructura**: Google Cloud Run
- **E-commerce**: Jumpseller (webhook)

## 📁 Estructura del Proyecto

```
gems-simce-api-platform/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── gems.routes.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── schools.routes.ts
│   │   │   │   └── subscriptions.routes.ts
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   └── services/
│   │   ├── services/
│   │   │   ├── gemini.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── stripe.service.ts
│   │   │   └── sendgrid.service.ts
│   │   ├── models/
│   │   ├── utils/
│   │   └── index.ts
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   ├── GemsHistory/
│   │   │   ├── PaymentForm/
│   │   │   └── Auth/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   ├── API.md
│   ├── INSTALLATION.md
│   ├── DEPLOYMENT.md
│   └── WEBHOOK.md
└── README.md
```

## 🔑 Características Principales

### 1. **Generador de Gems SIMCE**
- Endpoint POST `/gems/simce-lenguaje` que consume Gemini API
- Genera planes de mejora educativa en 6 secciones
- Almacena en Firestore con historial

### 2. **Dashboard para Escuelas**
- Visualización de Gems generados
- Historial y exportación (PDF/Word)
- Métricas de progreso
- Gestión de usuarios

### 3. **Notificaciones por Email**
- Envío automático de Gems vía SendGrid
- Recordatorios de suscripción
- Alertas de vencimiento

### 4. **Sistema de Suscripción (Stripe)**
- Plan Free: 3 Gems/mes
- Plan Pro: 20 Gems/mes + Dashboard
- Plan Enterprise: Ilimitado + Soporte

### 5. **Integración Jumpseller**
- Webhook post-venta
- Generación automática de API keys
- Envío de credenciales por email

## 🛠️ Setup Rápido

### Requisitos
- Node.js 18+
- npm/yarn
- Cuenta GCP (Vertex AI + Firestore)
- Cuenta Stripe
- Cuenta SendGrid
- Cuenta Firebase

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Completa variables de entorno
npm run dev # Desarrollo
npm run build && npm start # Producción
```

### Frontend

```bash
cd frontend
npm install
npm run dev # Desarrollo
npm run build # Producción
```

## 📋 Variables de Entorno

**Backend (.env)**
```
GEMINI_API_KEY=xxx
FIREBASE_PROJECT_ID=xxx
FIREBASE_PRIVATE_KEY=xxx
STRIPE_SECRET_KEY=xxx
SENDGRID_API_KEY=xxx
JUMPSELLER_WEBHOOK_SECRET=xxx
CLOUD_RUN_URL=https://xxx.run.app
NODE_ENV=production
```

## 🚀 Deployment a Cloud Run

```bash
# Build Docker image
docker build -t gems-simce-api .

# Deploy a Cloud Run
gcloud run deploy gems-simce-api \
  --image gems-simce-api \
  --platform managed \
  --region us-central1 \
  --set-env-vars GEMINI_API_KEY=$GEMINI_API_KEY
```

## 📊 Endpoints Principales

### Gems
- `POST /gems/simce-lenguaje` - Generar Gem SIMCE
- `GET /gems/:id` - Obtener Gem
- `GET /gems/school/:schoolId` - Historial de escuela

### Auth
- `POST /auth/register` - Registro
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout

### Schools
- `POST /schools` - Crear escuela
- `GET /schools/:id` - Datos escuela
- `PUT /schools/:id` - Actualizar

### Subscriptions
- `POST /subscriptions` - Crear suscripción
- `GET /subscriptions/:id` - Estado
- `POST /subscriptions/webhook` - Webhook Stripe

## 💰 Modelo de Ingresos

| Plan | Precio CLP | Gems/mes | Dashboard | Soporte |
|------|-----------|----------|-----------|----------|
| Free | $0 | 3 | ✓ Básico | Email |
| Pro | $49.900 | 20 | ✓ Completo | Email |
| Enterprise | Custom | ∞ | ✓ Plus | Phone + Chat |

## 📝 Documentación Completa

Véase carpeta `/docs/`:
- [API Reference](docs/API.md)
- [Installation Guide](docs/INSTALLATION.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Webhook Jumpseller](docs/WEBHOOK.md)

## 👥 Autor

**Juan Cerda** - Hackaton HT
- Email: contact@hackatonht.cl
- LinkedIn: /in/juancerda

## 📄 Licencia

MIT - Libre para uso comercial

## 🎯 Estado del Proyecto

✅ Prompt SIMCE testeado en Vertex Studio (2,651 tokens)
✅ Backend estructura creada
⏳ Dashboard en desarrollo
⏳ Integración Stripe
⏳ Deployment Cloud Run
⏳ Webhook Jumpseller
