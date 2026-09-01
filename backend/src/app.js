// [TV 7] Khởi tạo ứng dụng Express
import express from 'express';
import { helmetMiddleware, corsMiddleware, rateLimiter } from './middlewares/security.middleware.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';

// ── Import Routes (sẽ được thêm bởi các TV tương ứng) ─────
// import authRoutes from './routes/auth.routes.js';
// import productRoutes from './routes/product.routes.js';
// import cartRoutes from './routes/cart.routes.js';
// import orderRoutes from './routes/order.routes.js';
// import paymentRoutes from './routes/payment.routes.js';
// import adminRoutes from './routes/admin.routes.js';

const app = express();

// ── Security Middlewares ───────────────────────
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(rateLimiter);

// ── Body Parsers ──────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Health Check ──────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'EcoGreen API', timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/payment', paymentRoutes);
// app.use('/api/admin', adminRoutes);

// ── Error Handling ────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
