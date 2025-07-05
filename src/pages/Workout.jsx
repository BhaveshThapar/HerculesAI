import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useFitness } from '../context/FitnessContext';
import { useUserProfile } from '../context/UserProfileContext';

const herculesImg = 'https://img.freepik.com/premium-vector/pixel-art-illustration-hercules-pixelated-greek-hercules-greek-mythology-hercules-pixelated_1038602-827.jpg';

const Workout = () => {
  const { workoutLogs, addWorkoutLog, loading } = useFitness();
  const { userProfile } = useUserProfile();
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    document.title = 'HerculesAI - Workout';
    const today = new Date().toISOString().split('T')[0];
    const todayWorkout = workoutLogs.find(log => 
      new Date(log.created_at).toISOString().split('T')[0] === today
    );
    
    if (todayWorkout && !isEditing) {
      setCurrentWorkout(todayWorkout);
      setWorkoutType(todayWorkout.workout_type || '');
      setDuration(todayWorkout.duration_minutes?.toString() || '');
      setNotes(todayWorkout.notes || '');
      generateWorkout();
    } else {
      setCurrentWorkout(null);
      generateWorkout();
    }
  }, [workoutLogs, isEditing]);

  const generateWorkout = async () => {
    if (!userProfile?.goal) {
      return;
    }
    
    try {
      const response = await fetch('/api/ml/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_profile: {
            goal: userProfile.goal,
            experience_level: userProfile.experience_level,
            equipment_access: userProfile.gym_access,
            gender: userProfile.gender,
            age: userProfile.age,
            height_cm: userProfile.height,
            weight: userProfile.weight,
            diet_preference: userProfile.diet_preference
          },
          workout_type: workoutType || 'strength'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const mlWorkoutPlan = data.workout_plan || [];
        
        const exercisesList = mlWorkoutPlan.map(exercise => ({
          name: exercise.exercise_name,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight || '',
          rest: exercise.rest_seconds,
          notes: exercise.notes || ''
        }));
        
        setWorkoutExercises(exercisesList);
      } else {
        console.error('Failed to generate ML workout, using fallback');
        generateFallbackWorkout();
      }
    } catch (error) {
      console.error('Error generating ML workout:', error);
      generateFallbackWorkout();
    }
  };

  const generateFallbackWorkout = () => {
    let exercisesList = [];
    
    if (userProfile.goal === 'bulk') {
      exercisesList = [
        { name: 'Barbell Squat', sets: 4, reps: '6-8', weight: '', rest: 180, notes: '' },
        { name: 'Bench Press', sets: 4, reps: '6-8', weight: '', rest: 180, notes: '' },
        { name: 'Deadlift', sets: 3, reps: '5-6', weight: '', rest: 240, notes: '' },
        { name: 'Overhead Press', sets: 3, reps: '8-10', weight: '', rest: 120, notes: '' },
        { name: 'Pull-ups', sets: 3, reps: '8-12', weight: '', rest: 120, notes: '' }
      ];
    } else if (userProfile.goal === 'cut') {
      exercisesList = [
        { name: 'Barbell Squat', sets: 3, reps: '12-15', weight: '', rest: 90, notes: '' },
        { name: 'Push-ups', sets: 3, reps: '15-20', weight: '', rest: 60, notes: '' },
        { name: 'Lunges', sets: 3, reps: '12-15', weight: '', rest: 90, notes: '' },
        { name: 'Plank', sets: 3, reps: '60s', weight: '', rest: 60, notes: '' },
        { name: 'Bicep Curls', sets: 3, reps: '12-15', weight: '', rest: 60, notes: '' }
      ];
    } else {
      exercisesList = [
        { name: 'Barbell Squat', sets: 3, reps: '8-12', weight: '', rest: 120, notes: '' },
        { name: 'Bench Press', sets: 3, reps: '8-12', weight: '', rest: 120, notes: '' },
        { name: 'Romanian Deadlift', sets: 3, reps: '10-12', weight: '', rest: 120, notes: '' },
        { name: 'Pull-ups', sets: 3, reps: '8-12', weight: '', rest: 120, notes: '' },
        { name: 'Overhead Press', sets: 3, reps: '8-12', weight: '', rest: 120, notes: '' }
      ];
    }

    setWorkoutExercises(exercisesList);
  };

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...workoutExercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setWorkoutExercises(updatedExercises);
  };

  const handleSaveWorkout = async () => {
    try {
      const workoutData = {
        workout_type: workoutType || 'Strength Training',
        duration_minutes: parseInt(duration) || 60,
        notes: notes
      };

      const result = await addWorkoutLog(workoutData);
      if (result.success) {
        alert('Workout saved successfully!');
        setCurrentWorkout(result.data);
        setIsEditing(false);
      } else {
        alert('Error saving workout. Please try again.');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Error saving workout. Please try again.');
    }
  };

  const handleStartNewWorkout = () => {
    setIsEditing(true);
    setCurrentWorkout(null);
    setWorkoutType('');
    setDuration('');
    setNotes('');
    generateWorkout();
  };

  const handleAddExercise = () => {
    const newExercise = {
      name: '',
      sets: 3,
      reps: '8-12',
      weight: '',
      rest: 120,
      notes: ''
    };
    
    setWorkoutExercises([...workoutExercises, newExercise]);
  };

  const handleRemoveExercise = (index) => {
    const updatedExercises = workoutExercises.filter((_, i) => i !== index);
    setWorkoutExercises(updatedExercises);
  };



  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar />
        <main className="ml-[220px] p-8 w-full flex items-center justify-center">
          <div className="text-white">Loading workout data...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="ml-[220px] p-8 w-full">
        <div className="flex flex-col items-center mb-8">
          <img src={herculesImg} alt="Hercules Pixel Art" className="w-20 h-20 rounded-full mb-4 border-4 border-teal-700" />
          <h1 className="text-3xl font-bold mb-2 text-white">Today's Workout</h1>
          {currentWorkout && !isEditing && (
            <p className="text-teal-400">Workout completed on {new Date(currentWorkout.created_at).toLocaleDateString()}</p>
          )}
          {isEditing && (
            <p className="text-teal-400">Creating new workout</p>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-6 mb-8 text-white border border-teal-900">
          <h2 className="text-xl font-semibold mb-4 text-teal-400">Workout Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">Workout Type</label>
              <input
                type="text"
                className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
                value={workoutType}
                onChange={(e) => setWorkoutType(e.target.value)}
                placeholder="e.g., Upper Body, Leg Day"
                disabled={currentWorkout && !isEditing}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Duration (minutes)</label>
              <input
                type="number"
                className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="60"
                disabled={currentWorkout && !isEditing}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Notes</label>
              <input
                type="text"
                className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did it feel?"
                disabled={currentWorkout && !isEditing}
              />
            </div>
          </div>
          
          {currentWorkout && !isEditing && (
            <button
              onClick={handleStartNewWorkout}
              className="w-full py-3 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition"
            >
              Start New Workout
            </button>
          )}
          
          {(!currentWorkout || isEditing) && (
            <button
              onClick={handleSaveWorkout}
              className="w-full py-3 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition"
            >
              Save Workout
            </button>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-6 mb-8 text-white border border-teal-900">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-teal-400">Exercises</h2>
            {(!currentWorkout || isEditing) && (
              <button
                onClick={handleAddExercise}
                className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition"
                style={{ cursor: 'pointer' }}
              >
                Add Exercise (Click me!)
              </button>
            )}
            {currentWorkout && !isEditing && (
              <div className="text-teal-400 text-sm">
                Click "Start New Workout" above to add exercises
              </div>
            )}
          </div>

          {workoutExercises.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              No exercises yet. Click "Add Exercise" to get started!
            </div>
          ) : (
            workoutExercises.map((exercise, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-4 mb-4 border border-teal-800">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div>
                    <label className="block mb-1 text-sm font-medium">Exercise</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-teal-700 rounded bg-gray-800 text-white"
                      value={exercise.name}
                      onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                      placeholder="Exercise name"
                      disabled={currentWorkout && !isEditing}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Sets</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-teal-700 rounded bg-gray-800 text-white"
                      value={exercise.sets}
                      onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                      disabled={currentWorkout && !isEditing}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Reps</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-teal-700 rounded bg-gray-800 text-white"
                      value={exercise.reps}
                      onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                      placeholder="8-12"
                      disabled={currentWorkout && !isEditing}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Weight (lbs)</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-teal-700 rounded bg-gray-800 text-white"
                      value={exercise.weight}
                      onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                      placeholder="0"
                      disabled={currentWorkout && !isEditing}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Rest (sec)</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-teal-700 rounded bg-gray-800 text-white"
                      value={exercise.rest}
                      onChange={(e) => handleExerciseChange(index, 'rest', parseInt(e.target.value))}
                      disabled={currentWorkout && !isEditing}
                    />
                  </div>
                  <div className="flex items-end">
                    {(!currentWorkout || isEditing) && (
                      <button
                        onClick={() => handleRemoveExercise(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block mb-1 text-sm font-medium">Notes</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-teal-700 rounded bg-gray-800 text-white"
                    value={exercise.notes}
                    onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                    placeholder="Exercise notes"
                    disabled={currentWorkout && !isEditing}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {workoutLogs.length > 0 && (
          <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-teal-900">
            <h2 className="text-xl font-semibold mb-4 text-teal-400">Recent Workouts</h2>
            <div className="space-y-2">
              {workoutLogs.slice(0, 5).map((workout, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-900 rounded border border-teal-800">
                  <div>
                    <div className="font-semibold">{workout.workout_type || 'Workout'}</div>
                    <div className="text-sm text-gray-400">{workout.duration_minutes} minutes</div>
                  </div>
                  <div className="text-teal-400 text-sm">
                    {new Date(workout.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Workout; 