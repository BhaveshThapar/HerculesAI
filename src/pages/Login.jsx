import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signInUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await signInUser(email, password);
    if (!result.success) {
      setError(result.error);
      setTimeout(() => setError(null), 3000);
    } else {
      navigate('/dashboard', { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-gray-800 shadow">
        <Link to="/" className="text-2xl font-bold text-teal-400 hover:text-teal-300 transition">HerculesAI</Link>
        <div className="space-x-4">
          <Link to="/about" className="text-gray-200 hover:text-teal-400">About</Link>
          <Link to="/login">
            <button className="px-5 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition">Sign In</button>
          </Link>
        </div>
      </nav>
      <div className="flex flex-1 items-center justify-center">
        <form onSubmit={handleSignIn} className="bg-gray-800 p-8 rounded-lg shadow max-w-md w-full text-white">
          <h2 className="text-2xl font-bold mb-4 text-center text-teal-400">Sign In to HerculesAI</h2>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-teal-700 rounded mb-2 bg-gray-900 text-white placeholder-gray-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-teal-700 rounded bg-gray-900 text-white placeholder-gray-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full py-3 bg-teal-700 text-white rounded font-semibold hover:bg-teal-800 transition" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          {error && <p className="text-red-400 text-center pt-4">{error}</p>}
          <p className="text-center mt-4 text-gray-300">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-teal-400 hover:underline">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login; 