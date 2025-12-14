# CloudBox Backend

A secure, scalable file storage backend built with Express and TypeScript. Supports chunked file uploads, user authentication, and file management operations.

## Features

- ✅ **User Authentication** - Secure authentication using Better-Auth
- ✅ **Chunked File Uploads** - Support for large file uploads with resumable chunks
- ✅ **File Management** - Upload, download, view, and delete files
- ✅ **Stream-based Downloads** - Memory-efficient file streaming
- ✅ **SQLite Database** - Lightweight database with Drizzle ORM
- ✅ **Type Safety** - Full TypeScript coverage with strict mode
- ✅ **Input Validation** - Zod schema validation for all endpoints

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express 4
- **Language**: TypeScript 5
- **Database**: SQLite with Better-SQLite3
- **ORM**: Drizzle ORM
- **Authentication**: Better-Auth
- **Validation**: Zod
- **File Handling**: Express-Fileupload

## Prerequisites

- Node.js >= 20.x
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cloud_box/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the backend directory using the template `.env.example`:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Better-Auth Configuration
   BETTER_AUTH_SECRET=<any-simple-string>
   BETTER_AUTH_URL=http://localhost:3000

   # CORS Configuration
   FRONTEND_URL=http://localhost:5173

   # File Storage Configuration
   CHUNK_SIZE=5242880

   # Pagination
   RETRIEVAL_LIMIT=10
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
Server runs on `http://localhost:3000` with hot reload enabled.

### Production Build
```bash
npm run build
npm start
```

### Database Management
```bash
# Open Drizzle Studio (visual database editor)
npm run db:studio

# Push schema changes to database
npm run db:push
```

## Project Structure

```
backend/
├── src/
│   ├── config/           # Environment configuration
│   ├── database/         # Database setup and schemas
│   │   ├── schemas/      # Drizzle table schemas
│   │   └── setup.ts      # Database connection
│   ├── lib/              # Shared utilities
│   │   ├── auth.ts       # Better-auth setup
│   │   └── utils.ts      # Helper functions
│   ├── middleware/       # Express middleware
│   ├── models/           # TypeScript interfaces/types
│   ├── repositories/     # Database access layer
│   │   ├── interfaces.ts # Repository contracts
│   │   ├── file.repository.ts
│   │   └── upload.repository.ts
│   ├── routes/           # API route handlers
│   │   ├── auth.ts       # Authentication routes
│   │   └── file.ts       # File operation routes
│   ├── services/         # Business logic layer
│   │   ├── file.service.ts
│   │   └── storage.service.ts
│   ├── validators/       # Zod validation schemas
│   └── index.ts          # Application entry point
├── uploads/              # File storage (gitignored)
├── chunks/               # Temporary chunk storage (gitignored)
├── .env                  # Environment variables (gitignored)
└── package.json
```

## API Endpoints

### Authentication
All file endpoints require authentication via session cookies.

- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get current session

### File Operations

#### List Files
```http
GET /api/files/list?limit=10&offset=0&sortBy=createdAt&sortOrder=desc
```

**Query Parameters:**
- `limit` (optional): Number of files to return (default: 10)
- `offset` (optional): Pagination offset (default: 0)
- `sortBy` (optional): Sort field - `name`, `size`, `createdAt` (default: `createdAt`)
- `sortOrder` (optional): Sort order - `asc`, `desc` (default: `desc`)

#### Upload File (Chunked)

**1. Initiate Upload**
```http
POST /api/files/upload/initiate
Content-Type: application/json

{
  "data": {
    "name": "document.pdf",
    "size": 1048576,
    "type": "application/pdf",
    "mimeType": "application/pdf"
  }
}
```

**2. Upload Chunk**
```http
POST /api/files/upload/part
Content-Type: multipart/form-data

data: {"uploadId": "uuid", "index": 0}
chunk: <binary-data>
```

**3. Complete Upload**
```http
POST /api/files/upload/complete
Content-Type: application/json

{
  "data": {
    "uploadId": "uuid"
  }
}
```

**4. Abort Upload (Optional)**
```http
POST /api/files/upload/abort
Content-Type: application/json

{
  "data": {
    "uploadId": "uuid"
  }
}
```

#### Download File
```http
GET /api/files/download/:fileId
```
Downloads file with `Content-Disposition: attachment`

#### View File (Inline)
```http
GET /api/files/view/:fileId
```
Streams file for inline viewing (images, videos, PDFs)

#### Delete File
```http
DELETE /api/files/:fileId
```

## Architecture

### Layered Architecture

```
Routes → Services → Repositories → Database
  ↓         ↓           ↓
Validators  Storage    Drizzle ORM
```

**Routes**: Handle HTTP requests, validation, and responses
**Services**: Business logic and orchestration
**Repositories**: Data access layer (abstraction over Drizzle)
**Storage Service**: File system operations (local/S3-ready)

### Key Design Patterns

- **Repository Pattern**: Abstracts database access
- **Service Layer**: Separates business logic from HTTP concerns
- **Dependency Injection**: Services receive dependencies via constructor

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3000` | No |
| `NODE_ENV` | Environment | `development` | No |
| `BETTER_AUTH_SECRET` | Secret for JWT signing | - | Yes |
| `BETTER_AUTH_URL` | Auth callback URL | - | Yes |
| `FRONTEND_URL` | CORS origin | - | Yes |
| `CHUNK_SIZE` | Upload chunk size limit | `5MB` | No |
| `RETRIEVAL_LIMIT` | Default pagination limit | `10` | No |

## Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   NODE_ENV=production
   BETTER_AUTH_SECRET=<strong-secret>
   BETTER_AUTH_URL=https://your-domain.com
   ```

3. **Run the production server**
   ```bash
   npm start
   ```

### Production Considerations

- Use a process manager (PM2, systemd)
- Configure reverse proxy (nginx, Apache)
- Enable HTTPS with SSL certificates
- Use PostgreSQL/MySQL instead of SQLite for scalability
- Migrate to S3 for file storage (StorageService is designed for easy swap)
- Add rate limiting and DDoS protection
- Enable logging and monitoring
- Add maximum storage quota for users based on tiers
