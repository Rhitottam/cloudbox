# Cloud Box - Chunked File Upload & Download System

A full-stack file storage application with chunked uploads, user authentication, and real-time storage monitoring. Built with React, TypeScript, Express, and SQLite.

## Project Structure

### [Backend](./backend/README.md)
Express backend with Better-Auth, Drizzle ORM, and chunked file upload support. Handles authentication, file storage, and stream-based downloads.

**Tech:** Express, TypeScript, SQLite, Better-Auth, Drizzle ORM

### [Frontend](./frontend/README.md)
React frontend with drag-and-drop uploads, real-time progress tracking, and dark-themed UI. Features Zustand state management and shadcn/ui components.

**Tech:** React, Vite, TypeScript, Tailwind CSS, Zustand, shadcn/ui

## Quick Start

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run db:push
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3001
   - Backend: http://localhost:3000
