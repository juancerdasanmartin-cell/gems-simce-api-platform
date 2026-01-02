# Jumpseller Integration: Plan de Acción Operacional

## Objetivo Inmediato
Conectar Gems SIMCE con Jumpseller para monetizar y comenzar a operar en 48-72 horas.

## Critical Path (No más documentación)

### PASO 1: Setup Backend Jumpseller Webhook (4 horas)

**Archivo**: `backend/src/api/routes/jumpseller.ts`

```typescript
router.post('/webhook/jumpseller', async (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'order.completed') {
    // 1. Verificar firma webhook
    const signature = crypto
      .createHmac('sha256', process.env.JUMPSELLER_WEBHOOK_SECRET)
      .update(JSON.stringify(data))
      .digest('hex');
    
    if (signature !== req.headers['x-webhook-signature']) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // 2. Crear API Key para cliente
    const apiKey = generateApiKey();
    
    // 3. Crear documento en Firestore
    await firestore.collection('subscriptions').doc(data.client_email).set({
      email: data.client_email,
      apiKey,
      status: 'active',
      createdAt: new Date(),
      product: data.product_id,
      jumpsellerId: data.order_id
    });
    
    // 4. Enviar email con credenciales
    await sendgrid.send({
      to: data.client_email,
      subject: 'Tu API Key para Gems SIMCE',
      html: `Tu clave de acceso: ${apiKey}. URL: https://gems.app`
    });
    
    res.json({ success: true });
  }
});
```

### PASO 2: Crear Producto en Jumpseller (30 minutos)

**Acciones Manuales:**
1. Log in a Jumpseller
2. Crear producto:
   - Nombre: "Gems SIMCE - Plan Pro"
   - Precio: $49.900 CLP
   - Descripción: "Acceso ilimitado a generador de gems + dashboard"
3. Ir a Settings > Webhooks
4. Añadir webhook:
   - URL: `https://gems-simce-backend.run.app/webhook/jumpseller`
   - Eventos: `order.completed`
5. Copiar `Webhook Secret` y guardar en `.env`

### PASO 3: Deploy Webhook Endpoint (1 hora)

```bash
# 1. Actualizar backend en Cloud Run
cd backend
gcloud builds submit --tag gcr.io/PROJECT_ID/gems-simce-backend

# 2. Deploy
gcloud run deploy gems-simce-backend \
  --image gcr.io/PROJECT_ID/gems-simce-backend \
  --set-env-vars JUMPSELLER_WEBHOOK_SECRET=xxx

# 3. Probar webhook
curl -X POST https://gems-simce-backend.run.app/webhook/jumpseller \
  -H "Content-Type: application/json" \
  -d '{"event":"order.completed","data":{"client_email":"test@school.cl","order_id":123,"product_id":456}}'
```

### PASO 4: Auth Rápida (Frontend) (2 horas)

**Archivo**: `frontend/src/pages/Login.tsx`

```typescript
const Login = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      });
      
      const { token } = await res.json();
      localStorage.setItem('token', token);
      window.location.href = '/dashboard';
    } catch (e) {
      console.error('Invalid API Key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <input 
        type="text" 
        placeholder="Tu API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <button onClick={handleLogin}>Acceder</button>
    </div>
  );
};
```

### PASO 5: Ir en Vivo (2 horas)

1. **Crear Stripe Connect (Opcional para ahora)** 
   - Saltarse Stripe por ahora, usar Jumpseller directo

2. **Cambiar URL en Jumpseller**
   - Producto link → https://gems.app (tu dominio)

3. **Test completo:**
   ```bash
   # Comprar producto en Jumpseller (test)
   # Esperar webhook
   # Revisar email con API Key
   # Login en gems.app
   # Generar primer Gem
   ```

4. **Monitoring:**
   ```bash
   # Ver logs de webhook
   gcloud logging read "resource.type=cloud_run_managed_service" \
     --limit 50
   
   # Ver Firestore
   # Verificar colección 'subscriptions'
   ```

## Código Backend Mínimo (app.ts)

```typescript
import express from 'express';
import jumpseller from './api/routes/jumpseller';

const app = express();

app.use(express.json());

// Webhook
app.use('/webhook', jumpseller);

// Gems endpoint existente
app.post('/api/gems/create', async (req, res) => {
  const { apiKey, schoolData } = req.body;
  
  // Validar API Key
  const user = await firestore
    .collection('subscriptions')
    .where('apiKey', '==', apiKey)
    .limit(1)
    .get();
  
  if (user.empty) {
    return res.status(401).json({ error: 'Invalid API Key' });
  }
  
  // Generar gem con Gemini
  const gem = await generateGemWithGemini(schoolData);
  
  // Guardar en Firestore
  await firestore.collection('gems').add({
    email: user.docs[0].data().email,
    schoolData,
    gem,
    createdAt: new Date()
  });
  
  res.json({ success: true, gem });
});

app.listen(8080, () => console.log('🚀 Server running'));
```

## Frontend Mínimo (App.tsx)

```typescript
const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [page, setPage] = useState('login');

  if (!authenticated) {
    return <Login onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <div className="app">
      <nav>
        <button onClick={() => setPage('create')}>Crear Gem</button>
        <button onClick={() => setPage('history')}>Mi Historial</button>
      </nav>
      
      {page === 'create' && <CreateGemForm />}
      {page === 'history' && <GemHistory />}
    </div>
  );
};
```

## Timeline de 72 Horas

| Hora | Tarea | Responsable |
|------|-------|-------------|
| 0-1 | Setup Jumpseller product | Tú |
| 1-5 | Implementar webhook backend | Dev |
| 5-7 | Deploy a Cloud Run | Dev + DevOps |
| 7-9 | Implementar auth en Frontend | Dev |
| 9-11 | Testing (orden de prueba) | QA |
| 11-12 | Setup dominio + SSL | DevOps |
| 12-24 | Buffer para fixing | Team |
| 24-72 | Primera versión en vivo | Todo operando |

## Dominio

**Usar**: 
- Temporal: `gems-simce-backend.run.app`
- Producción: Comprar dominio `gems.app` o `gems.edu.cl`

## No Hacer Ahora

❌ Stripe (usar Jumpseller directo)
❌ Firebase Auth (usar API Key simple)
❌ Email verification
❌ Password reset
❌ Admin dashboard
❌ Más documentación

## Si Todo Falla

**Plan B (12 horas)**:
- Manual API Key generation via Firestore admin console
- Email API Key a clientes manualmente
- Test primer Gem
- Iterador con feedback real

---

**Estado**: LISTO PARA EJECUTAR
**Próximo**: Ejecutar Paso 1 ahora mismo
