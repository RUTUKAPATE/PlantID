# PlantID - AI-Powered Plant Identification Application

## Overview

PlantID is a modern full-stack web application that allows users to identify plants by uploading photos. The application uses Google's Gemini AI to analyze plant images and provide detailed identification results including care instructions. Built with React, TypeScript, Express.js, and PostgreSQL, it features a clean, responsive UI using shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **File Uploads**: react-dropzone for drag-and-drop file handling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20
- **File Processing**: Multer for file uploads, Sharp for image optimization
- **AI Integration**: Google Generative AI (Gemini) for plant identification
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)

### Key Components

#### Database Schema
- **Users Table**: Basic user management with username/password
- **Plant Identifications Table**: Stores identification results with detailed plant information including:
  - Common and scientific names
  - Plant family and origin
  - Confidence scores
  - Care instructions (watering, light, temperature, humidity, soil)
  - Care tips array
  - Image URLs and timestamps

#### API Endpoints
- **POST /api/identify-plant**: Main endpoint for plant identification
  - Accepts multipart/form-data with image file
  - Processes and optimizes images using Sharp
  - Sends to Gemini AI for analysis
  - Returns structured plant identification data

#### Storage Layer
- **Interface-based Design**: IStorage interface allows for multiple storage implementations
- **Memory Storage**: Development/testing implementation
- **Database Storage**: Production implementation using Drizzle ORM
- **Image Handling**: File uploads with size limits (10MB) and type validation

#### UI Components
- **PlantIdentifier**: Main component handling file upload and identification workflow
- **PlantResults**: Displays detailed identification results with care instructions
- **FileUpload**: Drag-and-drop file upload component with preview
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Data Flow

1. **Image Upload**: User selects/drops image file in FileUpload component
2. **File Processing**: Frontend validates file type and size, creates preview
3. **API Request**: Image sent to /api/identify-plant endpoint as FormData
4. **Server Processing**: 
   - Multer handles file upload
   - Sharp optimizes and resizes image
   - Image converted to base64 for Gemini API
5. **AI Analysis**: Gemini AI analyzes image and returns plant identification
6. **Data Storage**: Results saved to database with user association
7. **Response**: Structured plant data returned to frontend
8. **UI Update**: PlantResults component displays identification and care information

## External Dependencies

### AI Services
- **Google Generative AI (Gemini)**: Primary plant identification service
- **API Key Management**: Supports multiple environment variable names for flexibility

### Database
- **Neon Database**: Serverless PostgreSQL for production
- **Connection**: Uses DATABASE_URL environment variable
- **Migrations**: Drizzle Kit for schema management

### Image Processing
- **Sharp**: Server-side image optimization and resizing (max 1024x1024)
- **File Validation**: Client and server-side validation for image types and sizes

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **React Hook Form**: Form state management with Zod validation
- **Date-fns**: Date formatting utilities

## Deployment Strategy

### Development Environment
- **Replit Integration**: Configured for Replit development environment
- **Hot Reload**: Vite HMR for frontend, tsx for backend development
- **Port Configuration**: Development server on port 5000

### Production Build
- **Frontend**: Vite builds static assets to dist/public
- **Backend**: esbuild bundles server code to dist/index.js
- **Static Serving**: Express serves built frontend assets
- **Environment**: NODE_ENV-based configuration

### Database Setup
- **Schema Management**: Drizzle migrations in ./migrations directory
- **Push Command**: `npm run db:push` for schema deployment
- **Connection Pooling**: Neon serverless connection handling

### Scaling Considerations
- **Autoscale Deployment**: Configured for Replit's autoscale platform
- **Stateless Design**: Session data in database, not memory
- **Image Optimization**: Server-side processing reduces client load
- **API Rate Limiting**: Implemented through file size limits and validation

The application follows modern full-stack practices with clear separation of concerns, type safety throughout, and a focus on user experience with responsive design and accessibility features.