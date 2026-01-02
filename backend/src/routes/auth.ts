import { Router, Request, Response } from 'express';
import * as admin from 'firebase-admin';
import jwt from 'jsonwebtoken';

const router = Router();
const db = admin.firestore();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * POST /auth/validate-key
 * Validates an API Key and returns a JWT token
 */
router.post('/validate-key', async (req: Request, res: Response) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API Key requerida' });
    }

    // Find subscription by API Key
    const snapshot = await db
      .collection('subscriptions')
      .where('apiKey', '==', apiKey)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ error: 'API Key inválida' });
    }

    const subscription = snapshot.docs[0];
    const data = subscription.data();

    // Check if subscription is active
    if (data.status !== 'active') {
      return res.status(403).json({ error: 'Suscripción inactiva' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: data.email,
        apiKey,
        plan: data.plan,
        gems_limit: data.gems_limit,
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        email: data.email,
        name: data.name,
        plan: data.plan,
        gems_used: data.gems_used,
        gems_limit: data.gems_limit,
      },
    });
  } catch (error: any) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Middleware to verify JWT token
 */
export const verifyToken = (req: Request, res: Response, next: any) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        console.error('Token verification failed:', err);
        return res.status(403).json({ error: 'Token inválido' });
      }
      (req as any).user = decoded;
      next();
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export default router;
