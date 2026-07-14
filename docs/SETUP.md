# Setup Guide

## Prerequisites
- Node.js 20+
- Docker and Docker Compose
- PostgreSQL 15+ (or use Docker)

## Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/tamasgp/ffmpeg.git
cd ffmpeg

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
# WebSocket: ws://localhost:3002
```

## Manual Development Setup

### Backend

```bash
cd backend
npm install

# Create .env with your database credentials
cat > .env <<'EOF'
NODE_ENV=development
DATABASE_URL=******localhost:5432/ffmpeg_manager
PORT=3001
WS_PORT=3002
LOG_LEVEL=info
EOF

# Start development server
npm run dev
```

### Frontend

```bash
cd frontend
npm install

# Optional environment file
cat > .env <<'EOF'
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3002
EOF

# Start development server
npm run dev
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
DATABASE_URL=******localhost:5432/ffmpeg_manager
PORT=3001
WS_PORT=3002
LOG_LEVEL=info
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3002
```

## Database Setup

The backend uses TypeORM with `synchronize: true` in development mode, which automatically creates or updates the database schema. For production, use migrations:

```bash
cd backend
npm run migration:generate
npm run migration:run
```
