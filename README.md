# Reviewer Bot Test App

A simple Node.js (TypeScript) web application with Docker, designed for testing auto PR reviews.

## Getting Started

### Prerequisites
- Node.js (v20+)
- Docker and Docker Compose

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run in development mode:
   ```bash
   npm run dev
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Start the production build:
   ```bash
   npm start
   ```

### Running Tests
```bash
npm test
```

### Docker
To run the application using Docker Compose:
```bash
docker-compose up --build
```
The API will be available at `http://localhost:3000`.

## API Endpoints
- `GET /health`: Health check.
- `GET /api/tasks`: List all tasks.
- `POST /api/tasks`: Create a new task.