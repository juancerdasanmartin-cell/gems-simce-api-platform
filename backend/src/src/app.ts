import express, { Request, Response } from 'express';
import cors from 'cors';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(express.json());
app.use(cors());

// Firebase init (reemplazar con tu config)
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'prueba-general-login',
  // ... otros campos
};

let db: any;
try {
  initializeApp({ projectId: firebaseConfig.projectId });
  db = getFirestore();
} catch (e) {
  console.log('Firebase ya inicializado');
  db = getFirestore();
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// GET /api/v1/gems - Listar gemas (SIMCE plans)
app.get('/api/v1/gems', async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('gems').limit(10).get();
    const gems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: gems });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/gems - Crear nueva gema (generar plan SIMCE con IA)
app.post('/api/v1/gems', async (req: Request, res: Response) => {
  try {
    const { schoolName, subject, currentLevel, targetLevel } = req.body;

    // Llamar a Gemini para generar plan de mejora
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Genera un plan de mejora educativa para:
Escuela: ${schoolName}
Asignatura: ${subject}
Nivel actual SIMCE: ${currentLevel}/250
Nivel objetivo: ${targetLevel}/250

Incluye: 1) Diagnóstico, 2) Estrategias, 3) Métricas`;

    const result = await model.generateContent(prompt);
    const plan = result.response.text();

    // Guardar en Firestore
    const docRef = await db.collection('gems').add({
      schoolName,
      subject,
      currentLevel,
      targetLevel,
      plan,
      createdAt: new Date(),
    });

    res.json({ success: true, id: docRef.id, plan });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/gems/:id - Obtener gema específica
app.get('/api/v1/gems/:id', async (req: Request, res: Response) => {
  try {
    const doc = await db.collection('gems').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'No encontrada' });
    }
    res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en puerto ${PORT}`);
});

export default app;
