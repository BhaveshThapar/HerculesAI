import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { useUserProfile } from '../context/UserProfileContext';

const herculesImg = 'https://img.freepik.com/premium-vector/pixel-art-illustration-hercules-pixelated-greek-hercules-greek-mythology-hercules-pixelated_1038602-827.jpg';

const Settings = () => {
  const { session, signOut } = UserAuth();
  const { userProfile, fetchUserProfile, setProfileUsername } = useUserProfile();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [goal, setGoal] = useState('');
  const [experience, setExperience] = useState('');
  const [gymAccess, setGymAccess] = useState('');
  const [dietPreference, setDietPreference] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    document.title = 'HerculesAI - Settings';
    if (userProfile) {
      setEmail(session?.user?.email || '');
      setUsername(userProfile.username || '');
      setGoal(userProfile.goal || '');
      setExperience(userProfile.experience || '');
      setGymAccess(userProfile.gym_access || '');
      setDietPreference(userProfile.diet_preference || '');
      setAge(userProfile.age?.toString() || '');
      setWeight(userProfile.weight?.toString() || '');
      setHeight(userProfile.height?.toString() || '');
      setGender(userProfile.gender || '');
    }
  }, [userProfile, session]);

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      
      if (email && email !== session.user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) throw emailError;
      }
      
      if (password) {
        const { error: passwordError } = await supabase.auth.updateUser({ password });
        if (passwordError) throw passwordError;
      }
      
      if (username && username.trim() !== userProfile?.username) {
        const { data: existingUser, error: usernameError } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username.trim())
          .neq('user_id', session.user.id)
          .single();

        if (existingUser) {
          throw new Error('Username already taken');
        }

        if (userProfile?.username) {
          const { error } = await supabase.from('profiles').update({ username: username.trim() }).eq('user_id', session.user.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('profiles').insert({ user_id: session.user.id, username: username.trim() });
          if (error) throw error;
        }
        
        setProfileUsername(username.trim());
      }

      const onboardingData = {
        goal: goal,
        experience: experience,
        gym_access: gymAccess,
        diet_preference: dietPreference,
        age: age ? parseInt(age) : null,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        gender: gender
      };

      const { data: existingProfile, error: selectError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (existingProfile) {
        const { error } = await supabase
          .from('profiles')
          .update(onboardingData)
          .eq('user_id', session.user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert({ user_id: session.user.id, ...onboardingData });
        if (error) throw error;
      }

      await fetchUserProfile();
      setMessage('Settings saved successfully!');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      setMessage(error.message);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <img src={herculesImg} alt="Hercules" className="w-12 h-12 rounded-full" />
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-gray-400">Manage your account and preferences</p>
            </div>
          </div>

          {showNotification && (
            <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-900/20 border border-green-500 text-green-400' : 'bg-red-900/20 border border-red-500 text-red-400'}`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-teal-900">
              <h2 className="text-xl font-semibold mb-4 text-teal-400">Account Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">Username</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Choose a username"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-teal-900">
              <h2 className="text-xl font-semibold mb-4 text-teal-400">Fitness Preferences</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Fitness Goal</label>
                  <select
                    className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white"
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                  >
                    <option value="">Select your goal</option>
                    <option value="bulk">Build Muscle</option>
                    <option value="cut">Lose Fat</option>
                    <option value="maintain">Maintain</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">Experience Level</label>
                  <select
                    className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white"
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                  >
                    <option value="">Select experience level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">Gym Access</label>
                  <select
                    className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white"
                    value={gymAccess}
                    onChange={e => setGymAccess(e.target.value)}
                  >
                    <option value="">Select gym access</option>
                    <option value="full_gym">Full Gym</option>
                    <option value="limited_equipment">Limited Equipment</option>
                    <option value="bodyweight_only">Bodyweight Only</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">Diet Preference</label>
                  <select
                    className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white"
                    value={dietPreference}
                    onChange={e => setDietPreference(e.target.value)}
                  >
                    <option value="">Select diet preference</option>
                    <option value="all">No Restrictions</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="gluten_free">Gluten Free</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-teal-900">
              <h2 className="text-xl font-semibold mb-4 text-teal-400">Personal Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Age</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="25"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">Weight (lbs)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    placeholder="150"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">Height (inches)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    placeholder="70"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">Gender</label>
                  <select
                    className="w-full p-2 border border-teal-700 rounded bg-gray-900 text-white"
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-teal-900">
              <h2 className="text-xl font-semibold mb-4 text-teal-400">Account Actions</h2>
              
              <div className="space-y-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings; 