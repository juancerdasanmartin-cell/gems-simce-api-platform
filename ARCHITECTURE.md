# 🏗️ ARCHITECTURE - Gems SIMCE API Platform

## System Overview

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │         │  Cloud Run   │         │ Vertex AI   │
│  (React)    │────────▶│  (Backend)   │────────▶│  (Gemini)   │
└─────────────┘         └──────────────┘         └─────────────┘
      │                        │
      │                        │
      ▼                        ▼
┌─────────────┐         ┌──────────────┐
│  Stripe     │         │  Firestore   │
│  (Payments) │         │  (Database)  │
└─────────────┘         └──────────────┘
```

## 1. BACKEND (Node.js + Express)

### Folder Structure
```
backend/
├── src/
│   ├── index.ts              # Main server + endpoints
│   ├── services/
│   │   ├── gemini.service.ts # Gemini API calls
│   │   ├── auth.service.ts   # Firebase Auth
│   │   ├── stripe.service.ts # Stripe payments
│   │   └── email.service.ts  # SendGrid
│   ├── models/
│   │   ├── Gem.ts            # Gem SIMCE schema
│   │   ├── School.ts         # School schema
│   │   └── User.ts           # User schema
│   └── utils/
│       └── logger.ts         # Winston logging
├── package.json
├── .env.example
└── Dockerfile
```

### Key Endpoint

**POST /gems/simce-lenguaje**

```typescript
Request:
{
  "nivel": "8B",
  "resultado": 45,
  "estudiantes": 28,
  "vulnerabilidad": "75%",
  "recursos": "1 sala TIC, 2 docentes"
}

Response:
{
  "status": "success",
  "gem_id": "uuid",
  "gem_simce": "[6-section plan]",
  "timestamp": "ISO-8601"
}
```

Flow:
1. Validate input
2. Build prompt (nivel + resultado + contexto)
3. Call Gemini API with system prompt
4. Stream response (30-40 seconds)
5. Save to Firestore
6. Return gem_simce + metadata

## 2. FRONTEND (React 18 + Vite)

### Pages

**1. Login** (`/auth/login`)
- Firebase Auth integration
- Email + password
- OAuth option (Google)

**2. Dashboard** (`/dashboard`)
- Create new Gem (form)
- View Gems (list with filtering)
- Metrics (% improvement, cases generated)
- User profile

**3. Gem Viewer** (`/gems/:id`)
- Display 6 sections
- Export PDF/Word
- Share via link

**4. Subscription** (`/subscription`)
- Current plan display
- Stripe checkout
- Invoice history

### Component Structure
```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── Dashboard/
│   │   ├── GemForm.tsx
│   │   ├── GemList.tsx
│   │   └── GemViewer.tsx
│   ├── Subscription/
│   │   └── StripeCheckout.tsx
│   └── Layout/
│       ├── Header.tsx
│       └── Sidebar.tsx
├── pages/
├── services/
│   ├── api.ts          # Axios instance
│   ├── auth.ts         # Firebase Auth
│   └── stripe.ts       # Stripe JS
└── App.tsx
```

## 3. DATABASE (Firestore)

### Collections

**gems/** (Gem SIMCE documents)
```json
{
  "id": "uuid",
  "schoolId": "uuid",
  "nivel": "8B",
  "resultado": 45,
  "content": "[6-section markdown]",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**schools/** (School documents)
```json
{
  "id": "uuid",
  "name": "Colegio X",
  "region": "Santiago",
  "users": ["userId1", "userId2"],
  "subscriptionPlan": "pro",
  "gemsUsedThisMonth": 5,
  "createdAt": "timestamp"
}
```

**users/** (User documents)
```json
{
  "id": "firebase-uid",
  "email": "teacher@school.com",
  "schoolId": "uuid",
  "role": "teacher|director|admin",
  "createdAt": "timestamp"
}
```

## 4. PAYMENT FLOW (Stripe)

1. User selects Pro plan ($49.900 CLP/mes)
2. Frontend redirects to Stripe Checkout
3. Stripe confirms payment
4. Webhook (`POST /webhooks/stripe`)
5. Backend updates Firestore: `subscriptionPlan = "pro"`
6. Email sent: invoice + credentials

## 5. NOTIFICATION FLOW (SendGrid)

**Trigger Events:**
- Gem generated → Email with PDF
- Subscription purchased → Welcome email
- Subscription expires → Renewal reminder (7 days before)
- Plan downgraded → Confirmation email

## 6. DEPLOYMENT (Cloud Run + Jumpseller)

### Cloud Run
```bash
docker build -t gems-simce-api .
gcloud run deploy gems-simce-api \
  --image gems-simce-api \
  --platform managed \
  --region us-central1 \
  --set-env-vars GEMINI_API_KEY=$KEY
```

### Jumpseller Webhook
```
POST https://gems-simce-api.run.app/webhooks/jumpseller

Payload (on purchase):
{
  "order_id": "12345",
  "customer_email": "teacher@school.com",
  "product_id": "gem-simce-8b",
  "amount": 49900
}

Action:
1. Create user in Firestore
2. Create school document
3. Set subscriptionPlan = "pro"
4. Generate API key
5. Send credentials via SendGrid
```

## 7. SECURITY

### Authentication
- Firebase Auth (email/password + OAuth)
- JWT tokens in headers
- CORS enabled for frontend domain only

### Data Protection
- .env excludes all API keys
- Firestore security rules:
  - Only logged-in users can read their data
  - Only admins can write school data
- HTTPS enforced (Cloud Run default)

### Rate Limiting
- 100 requests/hour per user (free)
- 500 requests/hour per user (pro)
- Implemented via middleware

## 8. MONITORING

- Winston logging to Cloud Logging
- Error tracking: Sentry
- Performance: Cloud Trace
- Uptime: Cloud Monitoring

## 9. API ENDPOINTS

### Public
- `GET /health` → {status: "ok"}
- `POST /webhooks/stripe` → Stripe events
- `POST /webhooks/jumpseller` → Order events

### Protected (Auth required)
- `POST /gems/simce-lenguaje` → Generate Gem
- `GET /gems/:id` → Get Gem
- `GET /gems/school/:schoolId` → List Gems
- `GET /subscription` → Get plan
- `POST /subscription` → Update plan
- `GET /user` → User profile

## 10. DATA FLOW DIAGRAM

```
Teacher clicks "Generate Gem"
        ↓
Frontend POST /gems/simce-lenguaje
        ↓
Backend validates input
        ↓
Build prompt + call Gemini API
        ↓
Gemini generates 6-section plan (30-40s)
        ↓
Save to Firestore (gems/)
        ↓
Return gem_simce to frontend
        ↓
Frontend displays + allows export
        ↓
SendGrid sends email with PDF
```

---

**Architecture Type**: Microservices-ready (can scale to separate services later)  
**Database**: Real-time (Firestore subscriptions possible)  
**Deployment**: Serverless + Container (Cloud Run)  
**Scalability**: Can handle 1000+ concurrent users
