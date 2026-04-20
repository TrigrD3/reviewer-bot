import express, { Request, Response, NextFunction } from 'express';
import taskRoutes from './routes/tasks';

const app = express();

app.use(express.json());

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Reviewer Bot Test App</title>
        <style>
          body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f0f2f5; }
          .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
          h1 { color: #1a73e8; }
          .links { margin-top: 1rem; }
          a { margin: 0 10px; color: #1a73e8; text-decoration: none; font-weight: bold; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Reviewer Bot Test App 🚀</h1>
          <p>The simple web application for testing OpenClaw auto PR reviews is running!</p>
          <div class="links">
            <a href="/health" target="_blank">Health Check</a>
            <a href="/api/tasks" target="_blank">View Tasks (API)</a>
          </div>
        </div>
      </body>
    </html>
  `);
});

app.use('/api/tasks', taskRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

export default app;
