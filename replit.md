# ChronoChef - Recipe Generator Application

## Overview

ChronoChef is a full-stack recipe generator application that uses AI to create personalized recipes based on user preferences. The application features a React frontend with shadcn/ui components and an Express.js backend integrated with Google's Gemini AI for recipe generation. Users can save their favorite recipes to a PostgreSQL database and manage their personal recipe collection.

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
- **Database**: PostgreSQL with Drizzle ORM (fully integrated)
- **AI Integration**: Google Gemini 2.5 Flash for recipe generation
- **Storage**: Database-backed recipe persistence with user collections
- **Development**: tsx for TypeScript execution in development

### Data Flow
1. User submits recipe preferences through the React form
2. Frontend validates data using Zod schemas
3. API request sent to Express backend via TanStack Query
4. Backend validates request and calls Gemini AI service
5. AI generates 1-3 personalized recipes based on user input
6. Recipes returned to frontend and displayed in cards
7. Users can save favorite recipes to PostgreSQL database
8. Saved recipes are accessible through dedicated collection page

## Key Components

### Frontend Components
- **Home Page**: Main recipe generation interface with form inputs, navigation, and surprise feature
- **Recipe Form**: Collects cooking time, ingredients, and mood preferences
- **Surprise Me Feature**: One-click recipe generation with chef's choice ingredients
- **Recipe Display**: Shows generated recipes with save functionality
- **Saved Recipes Page**: Personal collection management with delete options
- **Navigation**: Seamless routing between recipe generation and saved collections
- **Toast Notifications**: User feedback for success/error states
- **UI Components**: Comprehensive shadcn/ui component library

### Backend Services
- **Recipe Generation**: `/api/recipes/generate` endpoint with Gemini AI integration
- **Recipe Persistence**: `/api/recipes/save` endpoint for saving favorites
- **Recipe Retrieval**: `/api/recipes/saved/:userId` endpoint for user collections
- **Recipe Management**: `/api/recipes/saved/:id/:userId` DELETE endpoint
- **Database Layer**: Drizzle ORM with PostgreSQL integration
- **Schema Validation**: Shared Zod schemas for type safety
- **Error Handling**: Comprehensive error handling with user-friendly messages

### Data Models
- **Recipe Request**: Cooking time, ingredients list, mood/style preferences
- **Recipe Response**: Array of recipes with name, description, cook time, ingredients, and instructions
- **User Schema**: Basic user model for authentication (configured)
- **Saved Recipe Schema**: Complete recipe data with user association and timestamps
- **Database Relations**: User-to-recipes relationship with proper foreign keys

## External Dependencies

### AI Integration
- **Google Gemini AI**: Recipe generation using Gemini 2.5 Flash model (optimized for speed and rate limits)
- **Structured Output**: JSON schema validation for consistent recipe format
- **API Key**: Configured via Replit Secrets for secure access

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
- June 26, 2025. Initial setup with recipe generation
- June 26, 2025. Added PostgreSQL database integration
- June 26, 2025. Implemented recipe saving and collection management
- June 26, 2025. Added saved recipes page with CRUD operations
- June 26, 2025. Switched from Gemini 2.5 Pro to 2.5 Flash for better rate limits
- June 26, 2025. Fixed dropdown text visibility issues in select components
- June 26, 2025. Added "Surprise Me!" feature for instant chef's choice recipes
- June 26, 2025. Implemented sophisticated dark theme with glassmorphism effects
- June 26, 2025. Fixed button text visibility issues in dark theme
- June 26, 2025. Created comprehensive README.md documentation
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## Technical Notes

### Database Integration
- Drizzle ORM fully integrated with PostgreSQL
- User schema configured for future authentication features
- Saved recipes table with user relationships implemented
- Complete CRUD operations for recipe persistence

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