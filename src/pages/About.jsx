import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <nav className="flex justify-between items-center px-8 py-4 bg-gray-800 shadow">
        <Link to="/" className="text-2xl font-bold text-teal-400 hover:text-teal-300 transition">HerculesAI</Link>
        <div className="space-x-4">
          <Link to="/about" className="text-teal-400 underline">About</Link>
          <Link to="/login">
            <button className="px-5 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition">Sign In</button>
          </Link>
        </div>
      </nav>
      
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
        <div className="bg-gray-800 p-8 rounded-lg shadow max-w-4xl w-full text-center text-white border border-teal-900">
          <h1 className="text-4xl font-bold mb-6 text-teal-400">The Legend of HerculesAI</h1>
          
          <div className="text-left space-y-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-teal-800">
              <h2 className="text-2xl font-bold mb-4 text-teal-300">Why Hercules?</h2>
              <p className="text-gray-200 leading-relaxed">
                In Greek mythology, Hercules was the greatest of all heroes, a demigod whose strength was unmatched. 
                But his true power came not just from his divine heritage, but from his determination, discipline, 
                and the way he approached each of his legendary labors with strategy and purpose.
              </p>
              <p className="text-gray-200 leading-relaxed mt-3">
                We chose Hercules as our inspiration because we believe everyone has that same potential for 
                extraordinary strength and transformation. You don't need to be a demigod to achieve legendary results, you 
                just need the right guidance, the right plan, and the determination to see it through.
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-teal-800">
              <h2 className="text-2xl font-bold mb-4 text-teal-300">Our Mission</h2>
              <p className="text-gray-200 leading-relaxed">
                We're not just another fitness app. We're a team of people who've been where you are, frustrated with 
                generic plans, confused by conflicting advice, and tired of feeling like we're not making real progress. 
                We built HerculesAI because we believe everyone deserves a fitness journey that actually works.
              </p>
              <p className="text-gray-200 leading-relaxed mt-3">
                Our mission is simple: to give you the tools, knowledge, and personalized guidance you need to unlock 
                your true strength potential. Whether you're just starting out or you're a seasoned athlete looking to 
                break through plateaus, we're here to help you forge your own legend.
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-teal-800">
              <h2 className="text-2xl font-bold mb-4 text-teal-300">The Science Behind the Strength</h2>
              <p className="text-gray-200 leading-relaxed">
                We combine cutting-edge artificial intelligence with proven exercise science and nutrition principles. 
                Our system analyzes thousands of successful transformations to understand what actually works for real people 
                with real lives, real schedules, and real challenges.
              </p>
              <p className="text-gray-200 leading-relaxed mt-3">
                But here's what makes us different: we don't just give you a plan and walk away. We adapt with you, 
                learn from your progress, and continuously refine your approach. Your success becomes part of our 
                collective wisdom, helping others on their own hero's journey.
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-teal-800">
              <h2 className="text-2xl font-bold mb-4 text-teal-300">Join the Fellowship of Strength</h2>
              <p className="text-gray-200 leading-relaxed">
                When you join HerculesAI, you're not just getting a fitness app, you're joining a community of people 
                who are committed to becoming stronger, healthier versions of themselves. People who understand that 
                true strength isn't just about muscles, but about discipline, resilience, and the courage to keep 
                pushing forward even when it's hard.
              </p>
              <p className="text-gray-200 leading-relaxed mt-3">
                We're here to remind you that you're capable of more than you think. That the person you want to become 
                is already inside you, waiting to be unleashed. Your labors await, are you ready to begin?
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-teal-800">
            <Link to="/login">
              <button className="px-8 py-4 bg-teal-600 text-white rounded-lg font-bold text-lg hover:bg-teal-700 transition transform hover:scale-105">
                START YOUR JOURNEY
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 