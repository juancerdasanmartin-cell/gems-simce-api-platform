import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Initialize Firebase (assuming already initialized in main app)
const db = admin.firestore();

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// Utility function to generate API Key
function generateApiKey(): string {
  return 'sk_' + crypto.randomBytes(32).toString('hex');
}

// Webhook endpoint for Jumpseller
router.post('/jumpseller', async (req: Request, res: Response) => {
  try {
    const { event, data } = req.body;

    // Verify webhook signature
    const signature = crypto
      .createHmac('sha256', process.env.JUMPSELLER_WEBHOOK_SECRET || '')
      .update(JSON.stringify(data))
      .digest('hex');

    if (signature !== req.headers['x-webhook-signature']) {
      console.warn('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Handle order.completed event
    if (event === 'order.completed') {
      const { client_email, order_id, product_id, client_name } = data;

      // 1. Generate unique API Key
      const apiKey = generateApiKey();

      // 2. Save subscription to Firestore
      await db.collection('subscriptions').doc(client_email).set(
        {
          email: client_email,
          name: client_name || 'Cliente',
          apiKey,
          status: 'active',
          plan: 'pro',
          createdAt: admin.firestore.Timestamp.now(),
          updatedAt: admin.firestore.Timestamp.now(),
          jumpsellerId: order_id,
          productId: product_id,
          gems_used: 0,
          gems_limit: 20, // Pro plan limit
        },
        { merge: true }
      );

      // 3. Send email with API Key credentials
      const emailContent = `
        <h2>¡Bienvenido a Gems SIMCE! 🎉</h2>
        <p>Hola ${client_name || 'Cliente'},</p>
        <p>Tu compra ha sido confirmada. Aquí están tus credenciales de acceso:</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Tu API Key:</strong></p>
          <code style="font-size: 14px; background: white; padding: 10px; display: block; border-radius: 4px;">${apiKey}</code>
        </div>
        <p>Usa esta clave para acceder a la plataforma:</p>
        <p><a href="${process.env.FRONTEND_URL || 'https://gems.app'}/login" style="background: #667eea; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none;">Acceder a Gems SIMCE</a></p>
        <hr style="margin: 30px 0;">
        <p><strong>¿Tienes dudas?</strong> Contáctanos en support@gemsimce.cl</p>
      `;

      await sgMail.send({
        to: client_email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@gemsimce.cl',
        subject: '¡Tu acceso a Gems SIMCE está listo! 🎓',
        html: emailContent,
      });

      console.log(`✅ New subscription created for ${client_email}`);
      return res.status(200).json({ success: true, message: 'Subscription created' });
    }

    // Handle other events if needed
    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
