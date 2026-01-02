import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google-cloud/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import authRoutes from './routes/auth';
import jumpsellerfRoutes from './routes/jumpseller';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);

const SIMCE_SYSTEM_PROMPT = `Eres experto en SIMCE y curriculum. Genera un plan Gem SIMCE con 6 secciones: Diagnostico, Objetivos, Plan de Accion, Rubrica, Cronograma, Indicadores. Formato: claro, practico, espanol.`;

// POST /gems/simce-lenguaje - Endpoint principal
app.post('/gems/simce-lenguaje', async (req, res) => {
  try {
    const { nivel, resultado, estudiantes, vulnerabilidad, recursos } = req.body;

    if (!nivel || resultado === undefined) {
      return res.status(400).json({ error: 'Faltan: nivel, resultado' });
    }

    const userPrompt = `SIMCE ${nivel} LENGUAJE: ${resultado}% logro, ${estudiantes} estudiantes, ${vulnerabilidad} vulnerabilidad. Genera Gem SIMCE.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction: SIMCE_SYSTEM_PROMPT,
      generationConfig: { temperature: 0.7, maxOutputTokens: 4000 }
    });

    const gemText = result.response.text();

    return res.status(200).json({
      status: 'success',
      gem_id: uuidv4(),
      gem_simce: gemText,
      nivel,
      resultado,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// GET /health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gems-simce-api', version: '1.0.0' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/webhook', jumpsellerfRoutes);

app.listen(PORT, () => {
  console.log(`✅ Gems SIMCE API puerto ${PORT}`);
});

export default app;
