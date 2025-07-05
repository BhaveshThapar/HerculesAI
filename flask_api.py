from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pandas as pd
import numpy as np
import random
import os
import sys
sys.path.append('.')
from ml_recommendation_system import MLRecommendationSystem

app = Flask(__name__)


CORS(
    app,
    origins=["http://localhost:5173"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True
)

meals_df = pd.read_csv('src/data/meals.csv')
exercises_df = pd.read_csv('src/data/exercises.csv')
workout_plans_df = pd.read_csv('src/data/workout_plans.csv')

meals_df = meals_df.replace({np.nan: None})
exercises_df = exercises_df.replace({np.nan: None})
workout_plans_df = workout_plans_df.replace({np.nan: None})

ml_system = MLRecommendationSystem()
def convert_to_python_types(obj):
    if isinstance(obj, dict):
        return {key: convert_to_python_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_python_types(item) for item in obj]
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    else:
        return obj

def get_today_day_of_week():
    import datetime
    return ((datetime.datetime.today().weekday() + 1) % 7) + 1

@app.route('/api/recommend/meals', methods=['POST', 'OPTIONS'])
@cross_origin(
    origins=["http://localhost:5173"],
    methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True
)
def recommend_meals():
    if request.method == 'OPTIONS':
        return '', 204
    req_json = request.get_json() or {}
    user_profile = req_json.get('user_profile', {})
    diet_pref = user_profile.get('diet_preference', 'all').lower()
    if diet_pref != 'all':
        filtered = meals_df[meals_df['dietary_tags'].str.contains(diet_pref, case=False, na=False)]
    else:
        filtered = meals_df
    if filtered.empty:
        meal = meals_df.sample(1).to_dict(orient='records')[0]
    else:
        meal = filtered.sample(1).to_dict(orient='records')[0]
    return jsonify({'meal': convert_to_python_types(meal)})

@app.route('/api/recommend/workouts', methods=['POST', 'OPTIONS'])
@cross_origin(
    origins=["http://localhost:5173"],
    methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True
)
def recommend_workouts():
    if request.method == 'OPTIONS':
        return '', 204
    req_json = request.get_json() or {}
    user_profile = req_json.get('user_profile', {})
    plan_names = workout_plans_df['plan_name'].unique()
    if len(plan_names) == 0:
        return jsonify({'workout': None})
    plan_name = random.choice(plan_names)
    today = get_today_day_of_week()
    
    all_plan_days = workout_plans_df[workout_plans_df['plan_name'] == plan_name]
    days = all_plan_days['day_of_week'].unique()
    
    plan_day = all_plan_days[all_plan_days['day_of_week'] == today]
    if plan_day.empty:
        plan_day = all_plan_days.head(1)
        today = plan_day.iloc[0]['day_of_week']
    
    recommended_exercises = []
    for _, row in plan_day.iterrows():
        ex = exercises_df[exercises_df['exercise_id'] == row['exercise_id']]
        if not ex.empty:
            ex_row = ex.iloc[0].to_dict()
            recommended_exercises.append({
                'exercise_name': ex_row.get('exercise_name', f"Exercise #{row['exercise_id']}"),
                'body_part': ex_row.get('body_part', ''),
                'equipment': ex_row.get('equipment', ''),
                'difficulty': ex_row.get('difficulty', ''),
                'target_sets': row.get('target_sets', ''),
                'target_reps': row.get('target_reps', '')
            })
    
    all_days = []
    for day in days:
        day_exercises = []
        day_plan = all_plan_days[all_plan_days['day_of_week'] == day]
        for _, row in day_plan.iterrows():
            ex = exercises_df[exercises_df['exercise_id'] == row['exercise_id']]
            if not ex.empty:
                ex_row = ex.iloc[0].to_dict()
                day_exercises.append({
                    'exercise_name': ex_row.get('exercise_name', f"Exercise #{row['exercise_id']}"),
                    'body_part': ex_row.get('body_part', ''),
                    'equipment': ex_row.get('equipment', ''),
                    'difficulty': ex_row.get('difficulty', ''),
                    'target_sets': row.get('target_sets', ''),
                    'target_reps': row.get('target_reps', '')
                })
        all_days.append({
            'day_of_week': day,
            'exercises': day_exercises
        })
    
    workout = {
        'plan_name': plan_name,
        'day_of_week': today,
        'recommended_exercises': recommended_exercises,
        'all_days': all_days
    }
    return jsonify({'workout': convert_to_python_types(workout)})

@app.route('/api/health', methods=['GET'])
@cross_origin(
    origins=["http://localhost:5173"],
    methods=["GET"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True
)
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/ml/recommend-meals', methods=['POST', 'OPTIONS'])
@cross_origin(
    origins=["http://localhost:5173"],
    methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True
)
def ml_recommend_meals():
    if request.method == 'OPTIONS':
        return '', 204
    
    req_json = request.get_json() or {}
    user_profile = req_json.get('user_profile', {})
    meal_type = req_json.get('meal_type')
    n_recommendations = req_json.get('n_recommendations', 5)
    
    try:
        recommendations = ml_system.get_meal_recommendations(
            user_profile, 
            n_recommendations=n_recommendations,
            meal_type=meal_type,
            dietary_preference=user_profile.get('diet_preference', 'all')
        )
        return jsonify({'meals': convert_to_python_types(recommendations)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ml/recommend-exercises', methods=['POST', 'OPTIONS'])
@cross_origin(
    origins=["http://localhost:5173"],
    methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True
)
def ml_recommend_exercises():
    if request.method == 'OPTIONS':
        return '', 204
    
    req_json = request.get_json() or {}
    user_profile = req_json.get('user_profile', {})
    body_part = req_json.get('body_part')
    n_recommendations = req_json.get('n_recommendations', 8)
    
    try:
        recommendations = ml_system.get_exercise_recommendations(
            user_profile,
            n_recommendations=n_recommendations,
            body_part=body_part
        )
        return jsonify({'exercises': convert_to_python_types(recommendations)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ml/generate-workout', methods=['POST', 'OPTIONS'])
@cross_origin(
    origins=["http://localhost:5173"],
    methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True
)
def ml_generate_workout():
    if request.method == 'OPTIONS':
        return '', 204
    
    req_json = request.get_json() or {}
    user_profile = req_json.get('user_profile', {})
    workout_type = req_json.get('workout_type', 'strength')
    
    try:
        workout_plan = ml_system.get_personalized_workout_plan(
            user_profile,
            workout_type=workout_type
        )
        return jsonify({'workout_plan': convert_to_python_types(workout_plan)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ml/similar-users', methods=['POST', 'OPTIONS'])
@cross_origin(
    origins=["http://localhost:5173"],
    methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True
)
def ml_similar_users():
    if request.method == 'OPTIONS':
        return '', 204
    
    req_json = request.get_json() or {}
    user_profile = req_json.get('user_profile', {})
    n_recommendations = req_json.get('n_recommendations', 5)
    
    try:
        similar_users = ml_system.get_similar_users_recommendations(
            user_profile,
            n_recommendations=n_recommendations
        )
        return jsonify({'similar_users': convert_to_python_types(similar_users)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ml/progress-recommendations', methods=['POST', 'OPTIONS'])
@cross_origin(
    origins=["http://localhost:5173"],
    methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True
)
def ml_progress_recommendations():
    if request.method == 'OPTIONS':
        return '', 204
    
    req_json = request.get_json() or {}
    user_id = req_json.get('user_id')
    n_recommendations = req_json.get('n_recommendations', 5)
    
    try:
        recommendations = ml_system.get_progress_based_recommendations(
            user_id,
            n_recommendations=n_recommendations
        )
        return jsonify({'recommendations': convert_to_python_types(recommendations)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=False, host='0.0.0.0', port=port) 