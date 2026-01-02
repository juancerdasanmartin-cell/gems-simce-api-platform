# Local Development Setup

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git
- Google Cloud SDK (for local Emulator)
- Firebase Emulator Suite (optional for local testing)

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/juancerdasanmartin-cell/gems-simce-api-platform.git
cd gems-simce-api-platform
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Setup Environment Variables

Create `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Google Cloud & Vertex AI
GCP_PROJECT_ID=your-gcp-project
GCP_REGION=us-central1
VERTEX_AI_API_KEY=your-api-key
GEMINI_MODEL=gemini-1.5-pro

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project
FIREBASE_API_KEY=your-firebase-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Email Service
SENDGRID_API_KEY=your-sendgrid-key

# Payment
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx

# Jumpseller
JUMPSELLER_API_KEY=your-jumpseller-key
JUMPSELLER_STORE_ID=your-store-id

# Server
PORT=3000
NODE_ENV=development
```

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 5. Run Backend in Development

```bash
cd backend
npm run dev
```

Backend will start at `http://localhost:3000`

### 6. Run Frontend in Development

In another terminal:

```bash
cd frontend
npm run dev
```

Frontend will typically start at `http://localhost:5173` (Vite default)

## Firebase Emulator Setup (Optional)

For local testing without GCP resources:

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Initialize Emulator

```bash
firebase emulators:start
```

This will start:
- Firestore Emulator (port 8080)
- Authentication Emulator (port 9099)
- Storage Emulator (port 4000)

### 3. Connect Backend to Emulators

Add to `.env`:

```env
FIREBASE_EMULATOR_HOST=localhost:8080
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
```

## Testing

### Backend Tests

```bash
cd backend
npm run test
```

### Integration Tests

```bash
npm run test:integration
```

## API Endpoints - Local

- Health Check: `GET http://localhost:3000/health`
- Create Gem: `POST http://localhost:3000/gems/simce-lenguaje`
- Get Gem: `GET http://localhost:3000/gems/:id`
- User Profile: `GET http://localhost:3000/user`

## Database Seeding

To populate with test data:

```bash
cd backend
npm run seed:dev
```

This creates:
- 10 test schools
- 5 test teachers per school
- Sample subscription plans

## Code Structure

```
backend/
├── src/
│   ├── api/
│   │   ├── gems/
│   │   ├── auth/
│   │   ├── subscriptions/
│   │   └── webhooks/
│   ├── services/
│   │   ├── gemini.service.ts
│   │   ├── firestore.service.ts
│   │   └── email.service.ts
│   ├── middleware/
│   ├── types/
│   └── index.ts
├── tests/
└── package.json

frontend/
├── src/
│   ├── components/
│   │   ├── GemGenerator/
│   │   ├── Dashboard/
│   │   └── Navigation/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   └── App.tsx
├── tests/
└── vite.config.ts
```

## Debugging

### Enable Debug Logging

Add to `.env`:

```env
DEBUG=gems-simce:*
```

### VS Code Debugger Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend",
      "program": "${workspaceFolder}/backend/src/index.ts",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
      "runtimeArgs": ["--loader", "ts-node/esm"]
    }
  ]
}
```

## Common Issues

### Port Already in Use

```bash
# Kill process on port 3000
kill -9 $(lsof -ti:3000)
```

### Firebase Connection Issues

Ensure `GOOGLE_APPLICATION_CREDENTIALS` is set:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

### Module Not Found

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

After setup:
1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
2. Check [API_EXAMPLES.md](./API_EXAMPLES.md) for endpoint examples
3. Review [QUICK_START.md](./QUICK_START.md) for feature walkthrough

## Support

For issues or questions:
1. Check [STATUS_FINAL.md](./STATUS_FINAL.md)
2. Create GitHub issue
3. Contact development team
