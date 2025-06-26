# Recipe Generator Application

## Overview

This is a full-stack recipe generator application that uses AI to create personalized recipes based on user preferences. The application features a React frontend with shadcn/ui components and an Express.js backend integrated with Google's Gemini AI for recipe generation.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM (configured but not actively used)
- **AI Integration**: Google Gemini AI for recipe generation
- **Session Management**: In-memory storage (development setup)
- **Development**: tsx for TypeScript execution in development

### Data Flow
1. User submits recipe preferences through the React form
2. Frontend validates data using Zod schemas
3. API request sent to Express backend via TanStack Query
4. Backend validates request and calls Gemini AI service
5. AI generates 1-3 personalized recipes based on user input
6. Recipes returned to frontend and displayed in cards

## Key Components

### Frontend Components
- **Home Page**: Main recipe generation interface with form inputs
- **Recipe Form**: Collects cooking time, ingredients, and mood preferences
- **Recipe Display**: Shows generated recipes with ingredients and instructions
- **Toast Notifications**: User feedback for success/error states
- **UI Components**: Comprehensive shadcn/ui component library

### Backend Services
- **Recipe Generation**: `/api/recipes/generate` endpoint
- **Gemini AI Service**: Handles AI communication and response parsing
- **Schema Validation**: Shared Zod schemas for type safety
- **Error Handling**: Comprehensive error handling with user-friendly messages

### Data Models
- **Recipe Request**: Cooking time, ingredients list, mood/style preferences
- **Recipe Response**: Array of recipes with name, description, cook time, ingredients, and instructions
- **User Schema**: Basic user model (configured but not implemented)

## External Dependencies

### AI Integration
- **Google Gemini AI**: Recipe generation using Gemini 2.5 Pro model
- **Structured Output**: JSON schema validation for consistent recipe format
- **API Key**: Required environment variable for Gemini service

### Development Tools
- **Replit Integration**: Configured for Replit development environment
- **PostgreSQL**: Database ready for future user features
- **Vite Plugins**: Runtime error overlay and development enhancements

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend in production
- **Port Configuration**: Runs on port 5000 with external port 80

### Environment Configuration
- **Development**: `npm run dev` runs both frontend and backend concurrently
- **Production**: `npm run build && npm run start` for deployment
- **Database**: PostgreSQL 16 module included in Replit configuration

### Replit Deployment
- **Autoscale Target**: Configured for automatic scaling
- **Workflow**: Parallel execution of development tasks
- **Modules**: Node.js 20, web, and PostgreSQL 16 modules enabled

## Changelog

```
Changelog:
- June 26, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## Technical Notes

### Database Integration
- Drizzle ORM configured with PostgreSQL support
- User authentication schema defined but not implemented
- Ready for future features like recipe saving and user accounts

### AI Service Architecture
- Structured prompts for consistent recipe generation
- JSON schema validation ensures reliable response format
- Error handling for API failures and rate limiting

### Form Validation
- Client-side validation using React Hook Form and Zod
- Server-side validation using shared schema definitions
- Type-safe data flow between frontend and backend

### Styling System
- CSS custom properties for consistent theming
- Light/dark mode support configured
- Responsive design with mobile-first approach