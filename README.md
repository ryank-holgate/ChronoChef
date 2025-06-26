# ChronoChef 🍳

> **AI-Powered Recipe Generator for Time-Conscious Cooking**

ChronoChef is an innovative web application that creates personalized recipes tailored to your available cooking time, ingredients on hand, and current culinary mood. Powered by Google's Gemini AI, it transforms the everyday question "What should I cook?" into a delightful discovery experience.

![ChronoChef Preview](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=ChronoChef+Screenshot)

## ✨ Features

### 🎯 **Smart Recipe Generation**
- **Time-Based Suggestions**: Get recipes that fit your schedule (15 minutes to 2+ hours)
- **Ingredient-Aware**: Input what you have, get recipes that use those ingredients
- **Mood-Driven**: Choose from comfort food, healthy options, international cuisine, and more
- **AI-Powered**: Leverages Google Gemini 2.5 Flash for fast, creative recipe generation

### 🎲 **Surprise Me! Feature**
- One-click recipe generation without any input required
- Perfect for culinary adventurers and decision-fatigued moments
- Curated by AI chef's choice for delightful discoveries

### 💾 **Personal Recipe Collection**
- Save your favorite generated recipes to your personal collection
- Full recipe details including ingredients, instructions, and cook time
- Easy management with delete functionality
- Persistent storage with PostgreSQL database

### 🎨 **Premium Dark Theme**
- Sophisticated glassmorphism design with subtle transparency effects
- Professional gradient buttons with smooth hover animations
- High contrast ratios for excellent readability
- Responsive design that works beautifully on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- PostgreSQL database
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chronochef
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type-safe development
- **Wouter** for lightweight client-side routing
- **TanStack Query** for efficient server state management
- **shadcn/ui** component library with Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design system
- **React Hook Form** + **Zod** for robust form handling and validation
- **Vite** for fast development and optimized production builds

### Backend Stack
- **Node.js 20** with Express.js framework
- **TypeScript** with ES modules for modern JavaScript
- **PostgreSQL** database with Drizzle ORM
- **Google Gemini AI** integration for recipe generation
- **Session-based architecture** ready for future authentication

### Key Design Patterns
- **Type-Safe Data Flow**: Shared Zod schemas between frontend and backend
- **Optimistic UI Updates**: Immediate feedback with TanStack Query mutations
- **Glassmorphism Design**: Modern visual effects with backdrop blur and transparency
- **Responsive Design**: Mobile-first approach with breakpoint-aware layouts

## 📁 Project Structure

```
chronochef/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components (shadcn/ui)
│   │   ├── pages/          # Page components (Home, SavedRecipes)
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions and configurations
├── server/                 # Express.js backend
│   ├── services/           # Business logic (Gemini AI integration)
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database interface and operations
│   └── db.ts               # Database connection and configuration
├── shared/                 # Shared type definitions and schemas
│   └── schema.ts           # Zod schemas for data validation
└── package.json            # Dependencies and scripts
```

## 🎯 How It Works

1. **Recipe Discovery**: Users input their available cooking time, ingredients, and preferred mood
2. **AI Processing**: The Gemini AI analyzes inputs and generates 1-3 personalized recipes
3. **Smart Display**: Recipes are presented with detailed ingredients, instructions, and timing
4. **Personal Collection**: Users can save favorites to their persistent recipe collection
5. **Easy Management**: Saved recipes are accessible anytime with full CRUD operations

## 🔧 API Endpoints

### Recipe Generation
```http
POST /api/recipes/generate
Content-Type: application/json

{
  "cookingTime": "30-60 minutes",
  "ingredients": "chicken, rice, tomatoes",
  "mood": "comfort food"
}
```

### Save Recipe
```http
POST /api/recipes/save
Content-Type: application/json

{
  "recipeName": "Chicken Fried Rice",
  "recipeDescription": "Comfort food classic...",
  "cookTime": "45 minutes",
  "ingredients": ["chicken", "rice", "eggs"],
  "instructions": ["Cook rice...", "Fry chicken..."],
  "userId": 1
}
```

### Get Saved Recipes
```http
GET /api/recipes/saved/:userId
```

### Delete Saved Recipe
```http
DELETE /api/recipes/saved/:recipeId/:userId
```

## 🎨 Design System

### Color Palette
- **Primary**: Orange gradient (#FF6B00 to variants)
- **Secondary**: Green accent (#22C55E)
- **Background**: Dark slate with elevated surfaces
- **Typography**: High contrast foreground colors
- **Interactive**: Smooth transitions and hover effects

### Visual Effects
- **Glassmorphism**: Subtle transparency with backdrop blur
- **Gradient Buttons**: Eye-catching call-to-action elements
- **Smooth Animations**: 300ms cubic-bezier transitions
- **Responsive Grid**: Adaptive layouts for all screen sizes

## 🔮 Future Enhancements

- **User Authentication**: Personal accounts with secure login
- **Recipe Sharing**: Social features to share favorite discoveries
- **Dietary Filters**: Vegetarian, vegan, gluten-free options
- **Shopping Lists**: Auto-generate grocery lists from recipes
- **Meal Planning**: Weekly meal planning with saved recipes
- **Nutrition Info**: Calorie and macro information
- **Recipe Ratings**: Community ratings and reviews
- **Photo Upload**: Visual recipe documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/chronochef/issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs

## 🌟 Acknowledgments

- **Google Gemini AI** for powerful recipe generation capabilities
- **shadcn/ui** for the beautiful component library
- **Replit** for the excellent development environment
- **Open Source Community** for the amazing tools and libraries

---

**Built with ❤️ for food lovers who value both time and taste**