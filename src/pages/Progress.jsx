import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useFitness } from '../context/FitnessContext';

const herculesImg = 'https://img.freepik.com/premium-vector/pixel-art-illustration-hercules-pixelated-greek-hercules-greek-mythology-hercules-pixelated_1038602-827.jpg';

const Progress = () => {
  const { progressLogs, addProgressLog, loading } = useFitness();
  const [showLogForm, setShowLogForm] = useState(false);
  const [newProgress, setNewProgress] = useState({
    weight_lbs: '',
    body_fat_percentage: '',
    muscle_mass_lbs: '',
    chest_inches: '',
    waist_inches: '',
    arms_inches: '',
    legs_inches: '',
    notes: ''
  });

  useEffect(() => {
    document.title = 'HerculesAI - Progress';
  }, []);

  const handleLogProgress = async () => {
    try {
      const result = await addProgressLog(newProgress);
      if (result.success) {
        setNewProgress({
          weight_lbs: '',
          body_fat_percentage: '',
          muscle_mass_lbs: '',
          chest_inches: '',
          waist_inches: '',
          arms_inches: '',
          legs_inches: '',
          notes: ''
        });
        setShowLogForm(false);
        alert('Progress logged successfully!');
      } else {
        alert('Error logging progress. Please try again.');
      }
    } catch (error) {
      console.error('Error logging progress:', error);
      alert('Error logging progress. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setNewProgress(prev => ({ ...prev, [field]: value }));
  };

  const getLatestProgress = () => {
    return progressLogs.length > 0 ? progressLogs[0] : null;
  };

  const getPreviousProgress = () => {
    return progressLogs.length > 1 ? progressLogs[1] : null;
  };

  const calculateChange = (current, previous) => {
    if (!current || !previous) return null;
    const change = current - previous;
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same'
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const latestProgress = getLatestProgress();
  const previousProgress = getPreviousProgress();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar />
        <main className="ml-[220px] p-8 w-full flex items-center justify-center">
          <div className="text-white">Loading progress data...</div>
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
          <h1 className="text-3xl font-bold mb-2 text-white">Your Progress</h1>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowLogForm(true)}
            className="px-6 py-3 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition"
          >
            Log Today's Progress
          </button>
        </div>

        {showLogForm && (
          <div className="bg-gray-800 rounded-lg shadow p-6 mb-8 text-white border border-teal-900">
            <h2 className="text-xl font-semibold mb-4 text-teal-400">Log Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-medium">Weight (lbs)</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
                  value={newProgress.weight_lbs}
                  onChange={(e) => handleInputChange('weight_lbs', e.target.value)}
                  placeholder="180.5"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Body Fat %</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
                  value={newProgress.body_fat_percentage}
                  onChange={(e) => handleInputChange('body_fat_percentage', e.target.value)}
                  placeholder="15.2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Muscle Mass (lbs)</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
                  value={newProgress.muscle_mass_lbs}
                  onChange={(e) => handleInputChange('muscle_mass_lbs', e.target.value)}
                  placeholder="145.0"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Chest (inches)</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
                  value={newProgress.chest_inches}
                  onChange={(e) => handleInputChange('chest_inches', e.target.value)}
                  placeholder="42.5"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Waist (inches)</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
                  value={newProgress.waist_inches}
                  onChange={(e) => handleInputChange('waist_inches', e.target.value)}
                  placeholder="32.0"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Arms (inches)</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
                  value={newProgress.arms_inches}
                  onChange={(e) => handleInputChange('arms_inches', e.target.value)}
                  placeholder="15.5"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Legs (inches)</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
                  value={newProgress.legs_inches}
                  onChange={(e) => handleInputChange('legs_inches', e.target.value)}
                  placeholder="24.0"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Notes</label>
              <textarea
                className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
                value={newProgress.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="How are you feeling? Any observations?"
                rows="3"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleLogProgress}
                className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition"
              >
                Save Progress
              </button>
              <button
                onClick={() => setShowLogForm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {latestProgress && (
          <div className="bg-gray-800 rounded-lg shadow p-6 mb-8 text-white border border-teal-900">
            <h2 className="text-xl font-semibold mb-4 text-teal-400">Latest Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-900 rounded-lg p-4 border border-teal-800">
                <div className="text-sm text-gray-400 mb-1">Weight</div>
                <div className="text-2xl font-bold text-white">{latestProgress.weight_lbs} lbs</div>
                {previousProgress && (
                  <div className={`text-sm ${calculateChange(latestProgress.weight_lbs, previousProgress.weight_lbs)?.direction === 'up' ? 'text-red-400' : 'text-green-400'}`}>
                    {calculateChange(latestProgress.weight_lbs, previousProgress.weight_lbs)?.direction === 'up' ? '+' : '-'}
                    {calculateChange(latestProgress.weight_lbs, previousProgress.weight_lbs)?.value.toFixed(1)} lbs
                  </div>
                )}
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-teal-800">
                <div className="text-sm text-gray-400 mb-1">Body Fat</div>
                <div className="text-2xl font-bold text-white">{latestProgress.body_fat_percentage}%</div>
                {previousProgress && (
                  <div className={`text-sm ${calculateChange(latestProgress.body_fat_percentage, previousProgress.body_fat_percentage)?.direction === 'up' ? 'text-red-400' : 'text-green-400'}`}>
                    {calculateChange(latestProgress.body_fat_percentage, previousProgress.body_fat_percentage)?.direction === 'up' ? '+' : '-'}
                    {calculateChange(latestProgress.body_fat_percentage, previousProgress.body_fat_percentage)?.value.toFixed(1)}%
                  </div>
                )}
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-teal-800">
                <div className="text-sm text-gray-400 mb-1">Muscle Mass</div>
                <div className="text-2xl font-bold text-white">{latestProgress.muscle_mass_lbs} lbs</div>
                {previousProgress && (
                  <div className={`text-sm ${calculateChange(latestProgress.muscle_mass_lbs, previousProgress.muscle_mass_lbs)?.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {calculateChange(latestProgress.muscle_mass_lbs, previousProgress.muscle_mass_lbs)?.direction === 'up' ? '+' : '-'}
                    {calculateChange(latestProgress.muscle_mass_lbs, previousProgress.muscle_mass_lbs)?.value.toFixed(1)} lbs
                  </div>
                )}
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-teal-800">
                <div className="text-sm text-gray-400 mb-1">Date</div>
                <div className="text-lg font-semibold text-white">{formatDate(latestProgress.created_at)}</div>
              </div>
            </div>
            {latestProgress.notes && (
              <div className="mt-4 p-3 bg-gray-900 rounded border border-teal-800">
                <div className="text-sm text-gray-400 mb-1">Notes</div>
                <div className="text-white">{latestProgress.notes}</div>
              </div>
            )}
          </div>
        )}

        {progressLogs.length > 0 && (
          <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-teal-900">
            <h2 className="text-xl font-semibold mb-4 text-teal-400">Progress History</h2>
            <div className="space-y-2">
              {progressLogs.map((progress, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-900 rounded border border-teal-800">
                  <div>
                    <div className="font-semibold">{progress.weight_lbs} lbs</div>
                    <div className="text-sm text-gray-400">{progress.body_fat_percentage}% body fat</div>
                  </div>
                  <div className="text-right">
                    <div className="text-teal-400">{formatDate(progress.created_at)}</div>
                    <div className="text-sm text-gray-400">{progress.muscle_mass_lbs} lbs muscle</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!latestProgress && (
          <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-teal-900">
            <div className="text-center text-gray-400 py-8">
              <div className="text-2xl mb-2"></div>
              <div>No progress data yet</div>
              <div className="text-sm text-gray-500">Log your first progress entry above</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Progress; 