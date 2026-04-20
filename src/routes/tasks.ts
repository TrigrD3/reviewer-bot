import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// In-memory "database"
let tasks: Task[] = [
  { id: 1, title: 'Learn OpenClaw', completed: false },
  { id: 2, title: 'Create test repo', completed: true },
];

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  completed: z.boolean().optional().default(false),
});

// GET /api/tasks
router.get('/', (req: Request, res: Response) => {
  res.json(tasks);
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
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

export default router;
