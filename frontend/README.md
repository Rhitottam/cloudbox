# CloudBox Frontend

A modern, responsive file storage web application built with React and TypeScript. Features drag-and-drop uploads, chunked file processing, real-time progress tracking, and a sleek dark-themed interface.

## Features

- ✅ **User Authentication** - Secure auth with Better-Auth integration
- ✅ **Drag & Drop Upload** - Intuitive file upload with visual feedback
- ✅ **Chunked Uploads** - Support for large files with progress tracking
- ✅ **File Management** - View, download, and delete files with ease
- ✅ **Storage Monitoring** - Real-time storage usage tracking
- ✅ **Responsive Design** - Mobile-first, works on all screen sizes
- ✅ **Dark Theme** - Modern dark UI with green accent colors (OKLCH)
- ✅ **Type Safety** - Full TypeScript coverage with strict mode
- ✅ **Form Validation** - Zod schema validation with React Hook Form
- ✅ **Toast Notifications** - User-friendly feedback with Sonner

## Tech Stack

- **Framework**: React 18.3
- **Build Tool**: Vite 6.0
- **Language**: TypeScript 5.6
- **Routing**: React Router DOM 7
- **State Management**: Zustand 5.0
- **Styling**: Tailwind CSS 3.4 + shadcn/ui
- **Forms**: React Hook Form 7.68 + Zod 4.1
- **Authentication**: Better-Auth 1.4
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Password Strength**: zxcvbn-ts

## Prerequisites

- Node.js >= 20.x
- npm or yarn
- Backend API running on port 3000

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cloud_box/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the frontend directory using the template `.env.example`:
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:3000/

   # Pagination
   VITE_PAGE_SIZE=10

   # Upload Configuration (in bytes)
   # Default: 50GB (53687091200 bytes)
   VITE_MAX_UPLOAD_SIZE=53687091200
   ```

   **Note:** Vite requires all client-side environment variables to be prefixed with `VITE_` for security.

## Running the Application

### Development Mode
```bash
npm run dev
```
Application runs on `http://localhost:3001` with hot module replacement.

### Production Build
```bash
npm run build
npm run preview
```

### Linting
```bash
npm run lint
```

## Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ...
│   │   └── ...
│   ├── features/          # Feature-based modules
│   │   ├── auth/          # Authentication feature
│   │   │   ├── api/       # Auth API calls
│   │   │   ├── components/# Auth components (Login, Signup)
│   │   │   └── validators/# Zod schemas
│   │   ├── files/         # File list feature
│   │   │   ├── api/       # File API calls
│   │   │   ├── components/# File list components
│   │   │   ├── store/     # Zustand store
│   │   │   └── types/     # TypeScript types
│   │   └── upload/        # Upload feature
│   │       ├── api/       # Upload API calls
│   │       ├── components/# Upload UI components
│   │       ├── store/     # Upload state management
│   │       └── types/     # Upload types
│   ├── lib/               # Shared utilities
│   │   ├── auth-client.ts # Better-auth client setup
│   │   └── utils.ts       # Helper functions (cn, etc.)
│   ├── pages/             # Route pages
│   │   ├── Auth.tsx       # Login/Signup page
│   │   └── Home.tsx       # Main dashboard
│   ├── shared/            # Shared components/logic
│   │   └── components/
│   │       └── RequireAuth.tsx # Protected route wrapper
│   ├── App.tsx            # Root component with routing
│   ├── index.css          # Global styles + Tailwind
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── .env                   # Environment variables (gitignored)
├── .env.example           # Environment template
├── index.html             # HTML entry point
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Feature Modules

### Authentication (`features/auth`)
- Email/password authentication
- Sign up and sign in flows
- Password strength validation
- Session management with cookies

### File Management (`features/files`)
- Paginated file listing
- Sort by name, size, or date
- File download and deletion
- Storage space monitoring

### Upload (`features/upload`)
- Drag-and-drop file selection
- Chunked multipart upload
- Real-time progress tracking
- Upload abort functionality
- Storage quota validation

## Key Design Patterns

- **Feature-Based Architecture**: Code organized by feature (auth, files, upload)
- **Zustand for State**: Lightweight state management with minimal boilerplate
- **shadcn/ui Components**: Accessible, customizable UI components
- **Protected Routes**: Authentication wrapper using Better-Auth sessions
- **API Layer Separation**: Dedicated API modules for each feature

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/` | Yes |
| `VITE_PAGE_SIZE` | Files per page in list | `10` | No |
| `VITE_MAX_UPLOAD_SIZE` | Max file size in bytes | `53687091200` (50GB) | No |

**Important:** All environment variables must be prefixed with `VITE_` to be accessible in the browser.

## Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   VITE_API_BASE_URL=https://api.your-domain.com/
   ```

3. **Preview production build locally**
   ```bash
   npm run preview
   ```

4. **Deploy the `dist/` folder** to your hosting provider:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

### Production Considerations

- Use environment-specific `.env.production` files
- Enable gzip/brotli compression on the server
- Configure CDN caching for static assets
- Set proper CORS headers on the backend
- Use HTTPS for all API requests
- Implement error tracking (Sentry, LogRocket)
- Add analytics (Google Analytics, Plausible)
- Consider lazy loading routes for better performance
- Optimize images and assets
- Enable service worker for offline support (optional)

## Browser Support

- Chrome/Edge >= 90
- Firefox >= 88
- Safari >= 14
- Mobile browsers (iOS Safari, Chrome Mobile)