# HerculesAI - AI-Powered Fitness Platform

A comprehensive fitness tracking and AI recommendation platform built with React, Flask, and Supabase. HerculesAI combines traditional fitness tracking with advanced machine learning to provide personalized workout and nutrition recommendations.

## Features

### Core Fitness Tracking
- **Workout Logging**: Track your workouts with duration, type, and notes
- **Nutrition Tracking**: Log meals with detailed macronutrient breakdown
- **Progress Monitoring**: Track weight, body measurements, and body composition
- **Goal Setting**: Set and track fitness goals with progress visualization

### AI-Powered Recommendations
- **Smart Meal Recommendations**: AI-driven meal suggestions based on your goals, dietary preferences, and nutritional needs
- **Exercise Recommendations**: Personalized exercise suggestions based on your experience level, equipment access, and fitness goals
- **Complete Workout Plans**: AI-generated workout plans with sets, reps, and rest periods
- **Content-Based Filtering**: Uses TF-IDF vectorization to find similar meals and exercises
- **Multi-Factor Scoring**: Recommendations scored based on goal alignment, equipment compatibility, and experience level

### User Experience
- **Personalized Onboarding**: Multi-step onboarding process to capture fitness goals and preferences
- **Real-time Dashboard**: Comprehensive overview of your fitness journey
- **Responsive Design**: Modern, mobile-friendly interface
- **Secure Authentication**: Supabase-powered user authentication

## Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Context API** for state management

### Backend
- **Flask** Python web framework
- **scikit-learn** for machine learning
- **pandas** for data processing
- **NumPy** for numerical computations

### Database & Infrastructure
- **Supabase** for PostgreSQL database and authentication
- **Row Level Security** for data protection
- **CORS** enabled for cross-origin requests

### Machine Learning
- **TF-IDF Vectorization** for content-based filtering
- **Cosine Similarity** for recommendation scoring
- **K-means Clustering** for user segmentation
- **Multi-factor Recommendation System**

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Supabase account
- Git

## Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd HerculesAI
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Set Up the Backend
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Flask API Configuration
VITE_FLASK_API_URL=http://localhost:5001/api/recommend
```

### 5. Set Up the Database

1. Go to your [Supabase Dashboard](https://supabase.com/)
2. Create a new project
3. Go to the SQL Editor
4. Copy and paste the contents of `database_setup.sql`
5. Run the script to create all tables, policies, and indexes

### 6. Run the Application

**Start the Flask Backend:**
```bash
# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Start the Flask server
python flask_api.py
```

**Start the React Frontend:**
```bash
npm run dev
```

Your application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

## AI Features

### Machine Learning System

The ML system uses several algorithms to provide personalized recommendations:

#### Content-Based Filtering
- **TF-IDF Vectorization**: Converts meal and exercise descriptions into numerical vectors
- **Cosine Similarity**: Finds similar items based on feature similarity
- **Multi-factor Scoring**: Combines goal alignment, equipment access, and experience level

#### Recommendation Types

1. **Meal Recommendations**
   - Goal-optimized calorie ranges (bulk: 500-800 cal, cut: 300-500 cal, maintain: 400-600 cal)
   - Dietary preference matching
   - Macro-nutrient balancing
   - Meal type filtering

2. **Exercise Recommendations**
   - Equipment-based filtering (full gym, home gym, bodyweight)
   - Experience level matching (beginner, intermediate, advanced)
   - Body part targeting
   - Difficulty progression

3. **Workout Plan Generation**
   - Progressive overload principles
   - Goal-specific rep ranges
   - Optimal rest periods
   - Balanced muscle targeting

### API Endpoints

#### Meal Recommendations
```
POST /api/ml/recommend-meals
{
  "user_profile": {
    "goal": "bulk",
    "experience": "intermediate",
    "equipment_access": "full_gym",
    "diet_preference": "all"
  },
  "meal_type": "Breakfast",
  "n_recommendations": 5
}
```

#### Exercise Recommendations
```
POST /api/ml/recommend-exercises
{
  "user_profile": {
    "goal": "bulk",
    "experience": "intermediate",
    "equipment_access": "full_gym"
  },
  "body_part": "Chest",
  "n_recommendations": 8
}
```

#### Workout Plan Generation
```
POST /api/ml/generate-workout
{
  "user_profile": {
    "goal": "bulk",
    "experience": "intermediate",
    "equipment_access": "full_gym"
  },
  "workout_type": "strength",
  "n_recommendations": 12
}
```

## Database Schema

### Core Tables
- **profiles**: User profile information and preferences
- **workout_logs**: Individual workout sessions
- **nutrition_logs**: Meal and nutrition tracking
- **progress_logs**: Body measurements and progress tracking

### ML Tables
- **ml_recommendation_logs**: Track AI recommendations and user feedback
- **user_preferences**: Store user preferences for ML personalization
- **meal_favorites**: User's favorite meals
- **workout_favorites**: User's favorite workouts
- **user_goals**: Active fitness goals
- **user_insights**: AI-generated insights and recommendations

## Configuration

### Vite Configuration
The frontend is configured with a proxy to forward API calls to the Flask backend:
```javascript

server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5001',
      changeOrigin: true
    }
  }
}
```

### CORS Configuration
The Flask backend is configured to accept requests from the React frontend:
```python
CORS(app, origins=["http://localhost:5173"])
```

## Deployment

### Frontend Deployment
```bash
npm run build
```

### Backend Deployment
The Flask app can be deployed to platforms like:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk

### Environment Variables for Production
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
VITE_FLASK_API_URL=your_production_flask_api_url
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues:
1. Check the browser console for frontend errors
2. Check the Flask server logs for backend errors
3. Verify your Supabase configuration
4. Ensure all environment variables are set correctly

## Future Enhancements

- [ ] Social features and workout sharing
- [ ] Advanced analytics and progress visualization
- [ ] Integration with wearable devices
- [ ] Meal planning and grocery lists
- [ ] Video exercise demonstrations
- [ ] Community challenges and competitions
