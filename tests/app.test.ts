import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('API Endpoints', () => {
  it('GET /health should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/tasks should return list of tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('POST /api/tasks should create a new task with default priority', async () => {
    const newTask = { title: 'Test auto review', completed: false };
    const res = await request(app)
      .post('/api/tasks')
      .send(newTask);
    
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(newTask.title);
    expect(res.body.priority).toBe('medium');
    expect(res.body.id).toBeDefined();
  });

  it('POST /api/tasks should create a new task with specific priority', async () => {
    const newTask = { title: 'High priority task', completed: false, priority: 'high' };
    const res = await request(app)
      .post('/api/tasks')
      .send(newTask);
    
    expect(res.status).toBe(201);
    expect(res.body.priority).toBe('high');
  });

  it('POST /api/tasks should fail with invalid priority', async () => {
    const invalidTask = { title: 'Invalid priority', priority: 'very-high' };
    const res = await request(app)
      .post('/api/tasks')
      .send(invalidTask);
    
    expect(res.status).toBe(400);
  });

  it('POST /api/tasks should fail with invalid data', async () => {
    const invalidTask = { title: '', completed: 'not-a-boolean' };
    const res = await request(app)
      .post('/api/tasks')
      .send(invalidTask);
    
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('DELETE /api/tasks/completed should remove all completed tasks', async () => {
    // Current state: 2 tasks, 1 completed (from initial tasks)
    const res = await request(app).delete('/api/tasks/completed');
    expect(res.status).toBe(204);

    const getRes = await request(app).get('/api/tasks');
    expect(getRes.body.every((task: any) => !task.completed)).toBe(true);
  });

  it('GET /api/tasks/summary should return task statistics', async () => {
    const res = await request(app).get('/api/tasks/summary');
    expect(res.status).toBe(200);
    expect(res.body.total).toBeDefined();
    expect(res.body.byPriority).toBeDefined();
  });
});
