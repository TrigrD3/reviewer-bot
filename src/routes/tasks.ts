import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

// In-memory "database"
let tasks: Task[] = [
  { id: 1, title: 'Learn OpenClaw', completed: false, priority: 'high' },
  { id: 2, title: 'Create test repo', completed: true, priority: 'medium' },
];

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  completed: z.boolean().optional().default(false),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
});

// GET /api/tasks
router.get('/', (req: Request, res: Response) => {
  res.json(tasks);
});

// GET /api/tasks/summary
router.get('/summary', (req: Request, res: Response) => {
  const summary = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    byPriority: {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    }
  };
  res.json(summary);
});

// POST /api/tasks
router.post('/', (req: Request, res: Response) => {
  const result = taskSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const newTask: Task = {
    id: tasks.length + 1,
    title: result.data.title,
    completed: result.data.completed,
    priority: result.data.priority,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// DELETE /api/tasks/completed
router.delete('/completed', (req: Request, res: Response) => {
  tasks = tasks.filter(task => !task.completed);
  res.status(204).end();
});

export default router;
