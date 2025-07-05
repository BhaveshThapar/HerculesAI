import React, { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUpNewUser } = UserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || !username) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const trimmedUsername = username.trim();
      if (!trimmedUsername || trimmedUsername.length < 3) {
        setError('Username must be at least 3 characters long');
        setLoading(false);
        return;
      }
      
      if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
        setError('Username can only contain letters, numbers, and underscores');
        setLoading(false);
        return;
      }

      const { data: existing, error: usernameError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', trimmedUsername);

      if (usernameError) {
        console.error('Error checking username:', usernameError);
        setError('Error checking username availability. Please try again.');
        setLoading(false);
        return;
      }

      if (existing && existing.length > 0) {
        setError('Username already taken');
        setLoading(false);
        return;
      }

      const result = await signUpNewUser(email, password);
      
      if (result.success) {
        const userId = result.data.user.id;
        await supabase.from('profiles').upsert({ user_id: userId, username: trimmedUsername });
        navigate('/onboarding');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">H</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Join HerculesAI and start your fitness journey
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-teal-900">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-teal-700 rounded-md shadow-sm placeholder-gray-400 bg-gray-900 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-teal-700 rounded-md shadow-sm placeholder-gray-400 bg-gray-900 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-teal-700 rounded-md shadow-sm placeholder-gray-400 bg-gray-900 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/login')}
                className="w-full flex justify-center py-2 px-4 border border-teal-700 rounded-md shadow-sm text-sm font-medium text-teal-400 bg-transparent hover:bg-teal-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Sign in instead
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 