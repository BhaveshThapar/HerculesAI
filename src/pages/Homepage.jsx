import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <nav className="flex justify-between items-center px-8 py-4 bg-gray-800 shadow">
        <Link to="/" className="text-2xl font-bold text-teal-400 hover:text-teal-300 transition">HerculesAI</Link>
        <div className="space-x-4">
          <Link to="/about" className="text-gray-200 hover:text-teal-400">About</Link>
          <Link to="/login">
            <button className="px-5 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition">Sign In</button>
          </Link>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center flex-1 text-center px-4 py-16 bg-gray-900">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
          Channel the Strength of a <span className="text-teal-400">Divine Hero</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-3xl">
          Like Hercules, the greatest hero of Greek mythology, you have untapped potential waiting to be unleashed. 
          Our AI doesn't just create workouts, it forges your path to legendary strength.
        </p>
        <Link to="/login">
          <button className="px-8 py-4 bg-teal-500 text-white rounded-lg font-semibold text-lg hover:bg-teal-600 transition transform hover:scale-105">
            BEGIN YOUR LABORS
          </button>
        </Link>
      </section>

      <section className="py-16 bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">The Path to Divine Strength</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <div className="bg-teal-900 text-teal-400 rounded-full p-6 mb-4 text-4xl font-bold">1</div>
            <div className="font-bold mb-3 text-white text-xl">Reveal Your Quest</div>
            <div className="text-gray-300">Share your goals, experience, and what equipment you have. Every hero's journey starts with understanding their mission.</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-teal-900 text-teal-400 rounded-full p-6 mb-4 text-4xl font-bold">2</div>
            <div className="font-bold mb-3 text-white text-xl">Receive Divine Guidance</div>
            <div className="text-gray-300">Our AI crafts your personalized training and nutrition plan, drawing from the wisdom of thousands of successful transformations.</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-teal-900 text-teal-400 rounded-full p-6 mb-4 text-4xl font-bold">3</div>
            <div className="font-bold mb-3 text-white text-xl">Forge Your Legend</div>
            <div className="text-gray-300">Execute your plan, track your progress, and watch as you transform into the strongest version of yourself.</div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">The Tools of a Hero</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
          <div className="bg-gray-800 p-8 rounded-lg border border-teal-900 text-center">
            <div className="text-4xl mb-4"></div>
            <div className="font-bold mb-3 text-white text-xl">Adaptive Workouts</div>
            <div className="text-gray-300">Whether you have a full gym or just your body weight, we create workouts that match your equipment and push your limits.</div>
          </div>
          <div className="bg-gray-800 p-8 rounded-lg border border-teal-900 text-center">
            <div className="text-4xl mb-4"></div>
            <div className="font-bold mb-3 text-white text-xl">Strategic Nutrition</div>
            <div className="text-gray-300">Fuel your strength with meal plans that align with your goals, dietary preferences, and lifestyle.</div>
          </div>
          <div className="bg-gray-800 p-8 rounded-lg border border-teal-900 text-center">
            <div className="text-4xl mb-4"></div>
            <div className="font-bold mb-3 text-white text-xl">Progress Tracking</div>
            <div className="text-gray-300">See your transformation unfold with detailed analytics and visual progress tracking that keeps you motivated.</div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Heroes in Training</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
          <div className="bg-gray-900 p-6 rounded-lg shadow text-center border border-teal-900">
            <div className="font-bold mb-3 text-white text-lg">"I went from struggling with push-ups to deadlifting 300 pounds. This isn't just a fitness app, it's a transformation."</div>
            <div className="text-teal-400 font-semibold">- Marcus, 28</div>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg shadow text-center border border-teal-900">
            <div className="font-bold mb-3 text-white text-lg">"The meal plans are actually enjoyable and sustainable. I've never felt stronger or more energized."</div>
            <div className="text-teal-400 font-semibold">- Sarah, 34</div>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg shadow text-center border border-teal-900">
            <div className="font-bold mb-3 text-white text-lg">"After 6 months, I'm not just stronger, I'm a completely different person. This app changed my life."</div>
            <div className="text-teal-400 font-semibold">- David, 31</div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center py-16 bg-gradient-to-r from-teal-700 to-teal-800">
        <h2 className="text-3xl font-bold text-white mb-6">Ready to Begin Your Hero's Journey?</h2>
        <p className="text-teal-100 mb-8 text-lg max-w-2xl text-center">
          Join thousands of others who have discovered their inner strength. Your transformation starts now.
        </p>
        <Link to="/login">
          <button className="px-10 py-5 bg-white text-teal-700 rounded-lg font-bold text-xl hover:bg-gray-100 transition transform hover:scale-105 shadow-lg">
            UNLEASH YOUR STRENGTH
          </button>
        </Link>
      </section>
    </div>
  );
};

export default Homepage; 