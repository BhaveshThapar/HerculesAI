import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import pickle
import os
from datetime import datetime, timedelta
import warnings
import time
warnings.filterwarnings('ignore')

class MLRecommendationSystem:
    def __init__(self):
        self.meals_df = None
        self.exercises_df = None
        self.profiles_df = None
        self.workout_logs_df = None
        self.progress_logs_df = None
        
        self.meal_vectorizer = None
        self.meal_similarity_matrix = None
        self.exercise_vectorizer = None
        self.exercise_similarity_matrix = None
        
        self.user_clusters = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        
        self.load_data()
        self.preprocess_data()
        self.build_models()
    
    def load_data(self):
        data_path = 'src/data/'
        self.meals_df = pd.read_csv(data_path + 'meals.csv')
        self.exercises_df = pd.read_csv(data_path + 'exercises.csv')
        self.profiles_df = pd.read_csv(data_path + 'profiles.csv')
        self.workout_logs_df = pd.read_csv(data_path + 'workout_logs.csv')
        self.progress_logs_df = pd.read_csv(data_path + 'progress_logs.csv')
        
        print(f"Loaded {len(self.meals_df)} meals, {len(self.exercises_df)} exercises, {len(self.profiles_df)} profiles")
    
    def preprocess_data(self):
        self.meals_df = self.meals_df.fillna('')
        self.exercises_df = self.exercises_df.fillna('')
        self.profiles_df = self.profiles_df.fillna('')
        
        # Convert numeric columns to proper types
        numeric_columns = ['calories', 'protein_g', 'carbs_g', 'fat_g']
        for col in numeric_columns:
            if col in self.meals_df.columns:
                self.meals_df[col] = pd.to_numeric(self.meals_df[col], errors='coerce').fillna(0)
        
        # Convert profile numeric columns
        profile_numeric_columns = ['age', 'height_cm', 'initial_weight_kg', 'goal_weight_kg']
        for col in profile_numeric_columns:
            if col in self.profiles_df.columns:
                self.profiles_df[col] = pd.to_numeric(self.profiles_df[col], errors='coerce').fillna(0)
        
        # Convert workout logs numeric columns
        if 'weight_kg' in self.workout_logs_df.columns:
            self.workout_logs_df['weight_kg'] = pd.to_numeric(self.workout_logs_df['weight_kg'], errors='coerce').fillna(0)
        if 'reps_completed' in self.workout_logs_df.columns:
            self.workout_logs_df['reps_completed'] = pd.to_numeric(self.workout_logs_df['reps_completed'], errors='coerce').fillna(0)
        
        self.meals_df['combined_features'] = (
            self.meals_df['meal_name'] + ' ' + 
            self.meals_df['meal_type'] + ' ' + 
            self.meals_df['dietary_tags']
        )
        
        self.exercises_df['combined_features'] = (
            self.exercises_df['exercise_name'] + ' ' + 
            self.exercises_df['body_part'] + ' ' + 
            self.exercises_df['equipment'] + ' ' + 
            self.exercises_df['difficulty']
        )
        
        self.label_encoders['goal'] = LabelEncoder()
        self.label_encoders['experience_level'] = LabelEncoder()
        self.label_encoders['equipment_access'] = LabelEncoder()
        self.label_encoders['gender'] = LabelEncoder()
        
        self.profiles_df['goal_encoded'] = self.label_encoders['goal'].fit_transform(self.profiles_df['goal'])
        self.profiles_df['experience_encoded'] = self.label_encoders['experience_level'].fit_transform(self.profiles_df['experience_level'])
        self.profiles_df['equipment_encoded'] = self.label_encoders['equipment_access'].fit_transform(self.profiles_df['equipment_access'])
        self.profiles_df['gender_encoded'] = self.label_encoders['gender'].fit_transform(self.profiles_df['gender'])
    
    def build_models(self):
        self.build_meal_recommendations()
        self.build_exercise_recommendations()
        self.build_user_clusters()
    
    def build_meal_recommendations(self):
        self.meal_vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
        meal_features = self.meal_vectorizer.fit_transform(self.meals_df['combined_features'])
        self.meal_similarity_matrix = cosine_similarity(meal_features)
        print("Built meal recommendation model")
    
    def build_exercise_recommendations(self):
        self.exercise_vectorizer = TfidfVectorizer(stop_words='english', max_features=500)
        exercise_features = self.exercise_vectorizer.fit_transform(self.exercises_df['combined_features'])
        self.exercise_similarity_matrix = cosine_similarity(exercise_features)
        print("Built exercise recommendation model")
    
    def build_user_clusters(self):
        user_features = self.profiles_df[['goal_encoded', 'experience_encoded', 'equipment_encoded', 'gender_encoded', 'age', 'height_cm', 'initial_weight_kg']].copy()
        user_features_scaled = self.scaler.fit_transform(user_features)
        
        n_clusters = min(5, len(user_features))
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        self.user_clusters = kmeans.fit_predict(user_features_scaled)
        self.profiles_df['cluster'] = self.user_clusters
        print(f"Built user clustering model with {n_clusters} clusters")
    
    def get_meal_recommendations(self, user_profile, n_recommendations=5, meal_type=None, dietary_preference='all'):
        np.random.seed(int(time.time() * 1000) % 1000000)
        
        user_goal = user_profile.get('goal', 'maintain')
        user_diet = user_profile.get('diet_preference', 'all')
        
        filtered_meals = self.meals_df.copy()
        
        if meal_type:
            filtered_meals = filtered_meals[filtered_meals['meal_type'].str.lower() == meal_type.lower()]
        
        if dietary_preference != 'all':
            filtered_meals = filtered_meals[filtered_meals['dietary_tags'].str.contains(dietary_preference, case=False, na=False)]
        
        if len(filtered_meals) == 0:
            filtered_meals = self.meals_df
        
        goal_calorie_ranges = {
            'bulk': (500, 800),
            'cut': (300, 500),
            'maintain': (400, 600)
        }
        
        min_cal, max_cal = goal_calorie_ranges.get(user_goal, (300, 600))
        filtered_meals = filtered_meals[
            (filtered_meals['calories'] >= min_cal) & 
            (filtered_meals['calories'] <= max_cal)
        ]
        
        if len(filtered_meals) == 0:
            filtered_meals = self.meals_df
        
        meal_scores = []
        for idx, meal in filtered_meals.iterrows():
            score = 0
            
            if user_goal == 'bulk' and meal['protein_g'] > 30:
                score += 2
            elif user_goal == 'cut' and meal['calories'] < 500:
                score += 2
            
            if user_diet in meal['dietary_tags']:
                score += 3
            
            meal_scores.append(score)
        
        filtered_meals['score'] = meal_scores
        
        if len(filtered_meals) > n_recommendations:
            top_meals = filtered_meals.nlargest(min(n_recommendations * 2, len(filtered_meals)), 'score')
            recommended_meals = top_meals.sample(n=min(n_recommendations, len(top_meals)))
        else:
            recommended_meals = filtered_meals
        
        return recommended_meals[['meal_id', 'meal_name', 'meal_type', 'calories', 'protein_g', 'carbs_g', 'fat_g', 'dietary_tags']].to_dict('records')
    
    def get_exercise_recommendations(self, user_profile, n_recommendations=8, body_part=None):
        np.random.seed(int(time.time() * 1000) % 1000000)
        
        user_goal = user_profile.get('goal', 'maintain')
        user_experience = user_profile.get('experience', 'beginner')
        user_equipment = user_profile.get('equipment_access', 'full_gym')
        
        filtered_exercises = self.exercises_df.copy()
        
        if body_part:
            filtered_exercises = filtered_exercises[filtered_exercises['body_part'].str.lower() == body_part.lower()]
        
        equipment_mapping = {
            'full_gym': ['Barbell', 'Dumbbell', 'Machine', 'Cable', 'Kettlebell', 'Other'],
            'home_gym': ['Dumbbell', 'Kettlebell', 'Other'],
            'bodyweight': ['Bodyweight', 'Other']
        }
        
        allowed_equipment = equipment_mapping.get(user_equipment, ['Bodyweight', 'Other'])
        filtered_exercises = filtered_exercises[filtered_exercises['equipment'].isin(allowed_equipment)]
        
        if len(filtered_exercises) == 0:
            filtered_exercises = self.exercises_df[self.exercises_df['equipment'] == 'Bodyweight']
        
        experience_difficulty_mapping = {
            'beginner': ['Beginner'],
            'intermediate': ['Beginner', 'Intermediate'],
            'advanced': ['Beginner', 'Intermediate', 'Advanced']
        }
        
        allowed_difficulties = experience_difficulty_mapping.get(user_experience, ['Beginner'])
        filtered_exercises = filtered_exercises[filtered_exercises['difficulty'].isin(allowed_difficulties)]
        
        if len(filtered_exercises) == 0:
            filtered_exercises = self.exercises_df[self.exercises_df['difficulty'] == 'Beginner']
        
        exercise_scores = []
        for idx, exercise in filtered_exercises.iterrows():
            score = 0
            
            if user_goal == 'bulk' and exercise['body_part'] in ['Legs', 'Back', 'Chest']:
                score += 2
            elif user_goal == 'cut' and exercise['body_part'] in ['Core', 'Full Body']:
                score += 2
            
            if exercise['difficulty'] == user_experience:
                score += 1
            
            exercise_scores.append(score)
        
        filtered_exercises['score'] = exercise_scores
        
        if len(filtered_exercises) > n_recommendations:
            top_exercises = filtered_exercises.nlargest(min(n_recommendations * 2, len(filtered_exercises)), 'score')
            recommended_exercises = top_exercises.sample(n=min(n_recommendations, len(top_exercises)))
        else:
            recommended_exercises = filtered_exercises
        
        return recommended_exercises[['exercise_id', 'exercise_name', 'body_part', 'equipment', 'difficulty']].to_dict('records')
    
    def get_personalized_workout_plan(self, user_profile, workout_type='strength'):
        exercises = self.get_exercise_recommendations(user_profile, n_recommendations=12)
        
        user_goal = user_profile.get('goal', 'maintain')
        user_experience = user_profile.get('experience', 'beginner')
        
        goal_rep_ranges = {
            'bulk': {'sets': 4, 'reps': '6-8', 'rest': 180},
            'cut': {'sets': 3, 'reps': '12-15', 'rest': 90},
            'maintain': {'sets': 3, 'reps': '8-12', 'rest': 120}
        }
        
        workout_config = goal_rep_ranges.get(user_goal, {'sets': 3, 'reps': '8-12', 'rest': 120})
        
        workout_plan = []
        for exercise in exercises:
            workout_plan.append({
                'exercise_id': exercise['exercise_id'],
                'exercise_name': exercise['exercise_name'],
                'body_part': exercise['body_part'],
                'equipment': exercise['equipment'],
                'difficulty': exercise['difficulty'],
                'sets': workout_config['sets'],
                'reps': workout_config['reps'],
                'rest_seconds': workout_config['rest'],
                'weight': '',
                'notes': ''
            })
        
        return workout_plan
    
    def get_similar_users_recommendations(self, user_profile, n_recommendations=5):
        user_features = np.array([
            self.label_encoders['goal'].transform([user_profile.get('goal', 'maintain')])[0],
            self.label_encoders['experience_level'].transform([user_profile.get('experience', 'beginner')])[0],
            self.label_encoders['equipment_access'].transform([user_profile.get('equipment_access', 'full_gym')])[0],
            self.label_encoders['gender'].transform([user_profile.get('gender', 'male')])[0],
            user_profile.get('age', 25),
            user_profile.get('height_cm', 170),
            user_profile.get('weight', 70)
        ]).reshape(1, -1)
        
        user_features_scaled = self.scaler.transform(user_features)
        
        from sklearn.neighbors import NearestNeighbors
        nn = NearestNeighbors(n_neighbors=min(n_recommendations + 1, len(self.profiles_df)), algorithm='ball_tree')
        nn.fit(self.scaler.transform(self.profiles_df[['goal_encoded', 'experience_encoded', 'equipment_encoded', 'gender_encoded', 'age', 'height_cm', 'initial_weight_kg']]))
        
        distances, indices = nn.kneighbors(user_features_scaled)
        
        similar_users = self.profiles_df.iloc[indices[0][1:]]
        return similar_users[['username', 'goal', 'experience_level', 'equipment_access']].to_dict('records')
    
    def get_progress_based_recommendations(self, user_id, n_recommendations=5):
        user_logs = self.workout_logs_df[self.workout_logs_df['user_id'] == user_id]
        
        if len(user_logs) == 0:
            return self.get_exercise_recommendations({}, n_recommendations)
        
        exercise_performance = user_logs.groupby('exercise_id').agg({
            'weight_kg': 'mean',
            'reps_completed': 'mean',
            'log_date': 'count'
        }).reset_index()
        
        exercise_performance.columns = ['exercise_id', 'avg_weight', 'avg_reps', 'frequency']
        
        exercise_performance = exercise_performance.merge(
            self.exercises_df[['exercise_id', 'exercise_name', 'body_part', 'equipment', 'difficulty']], 
            on='exercise_id'
        )
        
        exercise_performance['progress_score'] = (
            exercise_performance['avg_weight'] * 0.4 + 
            exercise_performance['avg_reps'] * 0.3 + 
            exercise_performance['frequency'] * 0.3
        )
        
        best_exercises = exercise_performance.nlargest(3, 'progress_score')
        
        recommended_exercises = []
        for _, exercise in best_exercises.iterrows():
            similar_exercises = self.get_similar_exercises(exercise['exercise_id'], n=2)
            recommended_exercises.extend(similar_exercises)
        
        return recommended_exercises[:n_recommendations]
    
    def get_similar_exercises(self, exercise_id, n=5):
        if exercise_id not in self.exercises_df['exercise_id'].values:
            return []
        
        exercise_idx = self.exercises_df[self.exercises_df['exercise_id'] == exercise_id].index[0]
        similar_scores = list(enumerate(self.exercise_similarity_matrix[exercise_idx]))
        similar_scores = sorted(similar_scores, key=lambda x: x[1], reverse=True)
        similar_scores = similar_scores[1:n+1]
        
        similar_exercises = []
        for idx, score in similar_scores:
            exercise = self.exercises_df.iloc[idx]
            similar_exercises.append({
                'exercise_id': exercise['exercise_id'],
                'exercise_name': exercise['exercise_name'],
                'body_part': exercise['body_part'],
                'equipment': exercise['equipment'],
                'difficulty': exercise['difficulty'],
                'similarity_score': score
            })
        
        return similar_exercises
    
    def save_models(self, filepath='ml_models/'):
        os.makedirs(filepath, exist_ok=True)
        
        models = {
            'meal_vectorizer': self.meal_vectorizer,
            'meal_similarity_matrix': self.meal_similarity_matrix,
            'exercise_vectorizer': self.exercise_vectorizer,
            'exercise_similarity_matrix': self.exercise_similarity_matrix,
            'scaler': self.scaler,
            'label_encoders': self.label_encoders,
            'user_clusters': self.user_clusters
        }
        
        with open(filepath + 'recommendation_models.pkl', 'wb') as f:
            pickle.dump(models, f)
        
        print(f"Models saved to {filepath}")
    
    def load_models(self, filepath='ml_models/recommendation_models.pkl'):
        if os.path.exists(filepath):
            with open(filepath, 'rb') as f:
                models = pickle.load(f)
            
            self.meal_vectorizer = models['meal_vectorizer']
            self.meal_similarity_matrix = models['meal_similarity_matrix']
            self.exercise_vectorizer = models['exercise_vectorizer']
            self.exercise_similarity_matrix = models['exercise_similarity_matrix']
            self.scaler = models['scaler']
            self.label_encoders = models['label_encoders']
            self.user_clusters = models['user_clusters']
            
            print("Models loaded successfully")
            return True
        return False

if __name__ == "__main__":
    ml_system = MLRecommendationSystem()
    
    test_user = {
        'goal': 'bulk',
        'experience_level': 'intermediate',
        'equipment_access': 'full_gym',
        'gender': 'male',
        'age': 25,
        'height_cm': 180,
        'weight': 75,
        'diet_preference': 'all'
    }
    
    print("\n=== Meal Recommendations ===")
    meals = ml_system.get_meal_recommendations(test_user, n_recommendations=3)
    for meal in meals:
        print(f"- {meal['meal_name']} ({meal['calories']} cal, {meal['protein_g']}g protein)")
    
    print("\n=== Exercise Recommendations ===")
    exercises = ml_system.get_exercise_recommendations(test_user, n_recommendations=5)
    for exercise in exercises:
        print(f"- {exercise['exercise_name']} ({exercise['body_part']}, {exercise['difficulty']})")
    
    print("\n=== Personalized Workout Plan ===")
    workout = ml_system.get_personalized_workout_plan(test_user)
    for exercise in workout[:5]:
        print(f"- {exercise['exercise_name']}: {exercise['sets']} sets x {exercise['reps']} reps")
    
    ml_system.save_models() 