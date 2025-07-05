-- =====================================================
-- HerculesAI Database Setup for Supabase
-- =====================================================
-- Run this in your Supabase SQL editor to set up the entire database

-- =====================================================
-- 1. CORE TABLES
-- =====================================================

-- Create profiles table (main user profile)
CREATE TABLE IF NOT EXISTS profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    goal TEXT,
    gender TEXT,
    age INTEGER,
    height DECIMAL(5,2), -- Height in centimeters (e.g., 180.50)
    weight DECIMAL(5,2), -- Weight in pounds (e.g., 165.30)
    gym_access TEXT,
    experience TEXT,
    diet_preference TEXT,
    nut_allergy BOOLEAN DEFAULT FALSE,
    dairy_allergy BOOLEAN DEFAULT FALSE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_logs table
CREATE TABLE IF NOT EXISTS workout_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_type TEXT,
    duration_minutes INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nutrition_logs table
CREATE TABLE IF NOT EXISTS nutrition_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    meal_type TEXT,
    meal_name TEXT,
    calories INTEGER,
    protein_g DECIMAL,
    carbs_g DECIMAL,
    fat_g DECIMAL,
    fiber_g DECIMAL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create progress_logs table
CREATE TABLE IF NOT EXISTS progress_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    weight_lbs DECIMAL,
    body_fat_percentage DECIMAL,
    muscle_mass_lbs DECIMAL,
    chest_inches DECIMAL,
    waist_inches DECIMAL,
    arms_inches DECIMAL,
    legs_inches DECIMAL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. ML AND RECOMMENDATION TABLES
-- =====================================================

-- Create ml_recommendation_logs table
CREATE TABLE IF NOT EXISTS ml_recommendation_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    recommendation_data JSONB,
    user_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    preference_type TEXT NOT NULL,
    preference_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, preference_type)
);

-- Create meal_favorites table
CREATE TABLE IF NOT EXISTS meal_favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    meal_id TEXT,
    meal_name TEXT NOT NULL,
    meal_type TEXT,
    calories INTEGER,
    protein_g DECIMAL,
    carbs_g DECIMAL,
    fat_g DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_favorites table
CREATE TABLE IF NOT EXISTS workout_favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_name TEXT NOT NULL,
    workout_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_goals table
CREATE TABLE IF NOT EXISTS user_goals (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_type TEXT NOT NULL,
    target_value DECIMAL,
    current_value DECIMAL,
    target_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_insights table
CREATE TABLE IF NOT EXISTS user_insights (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_type TEXT NOT NULL,
    insight_title TEXT NOT NULL,
    insight_content TEXT NOT NULL,
    insight_data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_recommendation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_insights ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. DROP EXISTING POLICIES (TO AVOID CONFLICTS)
-- =====================================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Workout logs policies
DROP POLICY IF EXISTS "Users can view own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can insert own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can update own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can delete own workout logs" ON workout_logs;

-- Nutrition logs policies
DROP POLICY IF EXISTS "Users can view own nutrition logs" ON nutrition_logs;
DROP POLICY IF EXISTS "Users can insert own nutrition logs" ON nutrition_logs;
DROP POLICY IF EXISTS "Users can update own nutrition logs" ON nutrition_logs;
DROP POLICY IF EXISTS "Users can delete own nutrition logs" ON nutrition_logs;

-- Progress logs policies
DROP POLICY IF EXISTS "Users can view own progress logs" ON progress_logs;
DROP POLICY IF EXISTS "Users can insert own progress logs" ON progress_logs;
DROP POLICY IF EXISTS "Users can update own progress logs" ON progress_logs;
DROP POLICY IF EXISTS "Users can delete own progress logs" ON progress_logs;

-- ML recommendation logs policies
DROP POLICY IF EXISTS "Users can view own ml logs" ON ml_recommendation_logs;
DROP POLICY IF EXISTS "Users can insert own ml logs" ON ml_recommendation_logs;

-- User preferences policies
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can delete own preferences" ON user_preferences;

-- Meal favorites policies
DROP POLICY IF EXISTS "Users can view own meal favorites" ON meal_favorites;
DROP POLICY IF EXISTS "Users can insert own meal favorites" ON meal_favorites;
DROP POLICY IF EXISTS "Users can delete own meal favorites" ON meal_favorites;

-- Workout favorites policies
DROP POLICY IF EXISTS "Users can view own workout favorites" ON workout_favorites;
DROP POLICY IF EXISTS "Users can insert own workout favorites" ON workout_favorites;
DROP POLICY IF EXISTS "Users can delete own workout favorites" ON workout_favorites;

-- User goals policies
DROP POLICY IF EXISTS "Users can view own goals" ON user_goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON user_goals;
DROP POLICY IF EXISTS "Users can update own goals" ON user_goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON user_goals;

-- User insights policies
DROP POLICY IF EXISTS "Users can view own insights" ON user_insights;
DROP POLICY IF EXISTS "Users can insert own insights" ON user_insights;
DROP POLICY IF EXISTS "Users can update own insights" ON user_insights;

-- =====================================================
-- 5. CREATE ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Workout logs policies
CREATE POLICY "Users can view own workout logs" ON workout_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout logs" ON workout_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout logs" ON workout_logs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout logs" ON workout_logs
    FOR DELETE USING (auth.uid() = user_id);

-- Nutrition logs policies
CREATE POLICY "Users can view own nutrition logs" ON nutrition_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition logs" ON nutrition_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition logs" ON nutrition_logs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own nutrition logs" ON nutrition_logs
    FOR DELETE USING (auth.uid() = user_id);

-- Progress logs policies
CREATE POLICY "Users can view own progress logs" ON progress_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress logs" ON progress_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress logs" ON progress_logs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress logs" ON progress_logs
    FOR DELETE USING (auth.uid() = user_id);

-- ML recommendation logs policies
CREATE POLICY "Users can view own ml logs" ON ml_recommendation_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ml logs" ON ml_recommendation_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences" ON user_preferences
    FOR DELETE USING (auth.uid() = user_id);

-- Meal favorites policies
CREATE POLICY "Users can view own meal favorites" ON meal_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal favorites" ON meal_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal favorites" ON meal_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Workout favorites policies
CREATE POLICY "Users can view own workout favorites" ON workout_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout favorites" ON workout_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout favorites" ON workout_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- User goals policies
CREATE POLICY "Users can view own goals" ON user_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON user_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON user_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON user_goals
    FOR DELETE USING (auth.uid() = user_id);

-- User insights policies
CREATE POLICY "Users can view own insights" ON user_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insights" ON user_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insights" ON user_insights
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- User ID indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_id ON workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_id ON nutrition_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_logs_user_id ON progress_logs(user_id);

-- Date indexes for time-based queries
CREATE INDEX IF NOT EXISTS idx_workout_logs_created_at ON workout_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_created_at ON nutrition_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_progress_logs_created_at ON progress_logs(created_at);

-- ML recommendation indexes
CREATE INDEX IF NOT EXISTS idx_ml_recommendation_logs_user_id ON ml_recommendation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ml_recommendation_logs_type ON ml_recommendation_logs(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_ml_recommendation_logs_created_at ON ml_recommendation_logs(created_at);

-- User preferences indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_type ON user_preferences(preference_type);

-- Meal favorites indexes
CREATE INDEX IF NOT EXISTS idx_meal_favorites_user_id ON meal_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_favorites_created_at ON meal_favorites(created_at);

-- Workout favorites indexes
CREATE INDEX IF NOT EXISTS idx_workout_favorites_user_id ON workout_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_favorites_created_at ON workout_favorites(created_at);

-- User goals indexes
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_type ON user_goals(goal_type);
CREATE INDEX IF NOT EXISTS idx_user_goals_active ON user_goals(is_active);

-- User insights indexes
CREATE INDEX IF NOT EXISTS idx_user_insights_user_id ON user_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_user_insights_type ON user_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_user_insights_read ON user_insights(is_read);
CREATE INDEX IF NOT EXISTS idx_user_insights_created_at ON user_insights(created_at);

-- =====================================================
-- 7. CREATE TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for tables with updated_at columns
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at
    BEFORE UPDATE ON user_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. CREATE FUNCTIONS FOR COMMON OPERATIONS
-- =====================================================

-- Function to get user's daily nutrition summary
CREATE OR REPLACE FUNCTION get_daily_nutrition(user_uuid UUID, target_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    total_calories BIGINT,
    total_protein DECIMAL,
    total_carbs DECIMAL,
    total_fat DECIMAL,
    total_fiber DECIMAL,
    meal_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(nl.calories), 0) as total_calories,
        COALESCE(SUM(nl.protein_g), 0) as total_protein,
        COALESCE(SUM(nl.carbs_g), 0) as total_carbs,
        COALESCE(SUM(nl.fat_g), 0) as total_fat,
        COALESCE(SUM(nl.fiber_g), 0) as total_fiber,
        COUNT(*) as meal_count
    FROM nutrition_logs nl
    WHERE nl.user_id = user_uuid 
    AND DATE(nl.created_at) = target_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's weekly workout summary
CREATE OR REPLACE FUNCTION get_weekly_workouts(user_uuid UUID, start_date DATE DEFAULT CURRENT_DATE - INTERVAL '7 days')
RETURNS TABLE (
    workout_count BIGINT,
    total_duration BIGINT,
    avg_duration DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as workout_count,
        COALESCE(SUM(wl.duration_minutes), 0) as total_duration,
        COALESCE(AVG(wl.duration_minutes), 0) as avg_duration
    FROM workout_logs wl
    WHERE wl.user_id = user_uuid 
    AND DATE(wl.created_at) >= start_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. VERIFICATION QUERIES
-- =====================================================

-- Check if all tables were created successfully
SELECT 
    table_name,
    CASE 
        WHEN table_name IN (
            'profiles', 'workout_logs', 'nutrition_logs', 'progress_logs',
            'ml_recommendation_logs', 'user_preferences', 'meal_favorites',
            'workout_favorites', 'user_goals', 'user_insights'
        ) THEN '✅ Created'
        ELSE '❌ Missing'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'profiles', 'workout_logs', 'nutrition_logs', 'progress_logs',
    'ml_recommendation_logs', 'user_preferences', 'meal_favorites',
    'workout_favorites', 'user_goals', 'user_insights'
);

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'profiles', 'workout_logs', 'nutrition_logs', 'progress_logs',
    'ml_recommendation_logs', 'user_preferences', 'meal_favorites',
    'workout_favorites', 'user_goals', 'user_insights'
);