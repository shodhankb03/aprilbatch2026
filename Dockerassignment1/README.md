# Docker Assignment 1

This simple app has three parts:

1. Frontend: HTML page served by Nginx
2. Backend: Node.js API that talks to PostgreSQL
3. Database: PostgreSQL container

## Run

```bash
docker compose up --build
```

Open:
- Frontend: http://localhost:3000
- Backend health: http://localhost:3001/api/health
