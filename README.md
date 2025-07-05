# HerculesAI - AI-Powered Fitness Platform

A comprehensive fitness platform that uses machine learning to provide personalized workout and nutrition recommendations.

## Features

- AI-powered meal and workout recommendations
- Progress tracking and analytics
- Personalized workout plans
- Dietary preference support
- Responsive web interface
- User authentication with Supabase

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Chart.js

### Backend
- Flask
- Python 3.9
- Pandas
- Scikit-learn
- Gunicorn

### Database
- Supabase (PostgreSQL)

## Project Structure

```
HerculesAI/
├── backend/                 # Flask API backend
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── Procfile           # Render deployment config
│   ├── runtime.txt        # Python version
│   ├── ml_models/         # ML model files
│   └── src/data/          # CSV data files
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── ...
├── render.yaml            # Render deployment configuration
└── package.json           # Frontend dependencies
```

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.9+
- Git

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

## Deployment on Render

This project is configured for deployment on Render with both frontend and backend services.

### 1. Backend Deployment

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Name:** `herculesai-backend`
   - **Environment:** `Python`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && gunicorn app:app --bind 0.0.0.0:$PORT`
   - **Root Directory:** Leave empty (deploy from root)

4. **Environment Variables:**
   - `PYTHON_VERSION`: `3.9.16`
   - `FLASK_ENV`: `production`

### 2. Frontend Deployment

1. **Create a new Static Site** on Render
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Name:** `herculesai-frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Root Directory:** Leave empty (deploy from root)

4. **Environment Variables:**
   - `VITE_FLASK_API_URL`: `https://your-backend-service-name.onrender.com/api`

### 3. Using render.yaml (Alternative)

You can also deploy both services at once using the provided `render.yaml`:

1. **Create a new Blueprint Instance** on Render
2. **Connect your GitHub repository**
3. **Render will automatically create both services**

## Environment Variables

### Frontend (.env)
```env
VITE_FLASK_API_URL=https://your-backend-service-name.onrender.com/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend
```env
FLASK_ENV=production
PYTHON_VERSION=3.9.16
```

## API Endpoints

### Health Check
- `GET /api/health` - Service health status

### Recommendations
- `POST /api/recommend/meals` - Get meal recommendations
- `POST /api/recommend/workouts` - Get workout recommendations

### ML Endpoints
- `POST /api/ml/recommend-meals` - ML-powered meal recommendations
- `POST /api/ml/recommend-exercises` - ML-powered exercise recommendations
- `POST /api/ml/generate-workout` - Generate personalized workout plan
- `POST /api/ml/similar-users` - Find similar users
- `POST /api/ml/progress-recommendations` - Progress-based recommendations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

This project is licensed under the MIT License.
