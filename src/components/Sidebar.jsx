import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 h-full w-56 bg-gray-900 border-r border-teal-900 flex flex-col z-40">
      <div className="flex items-center justify-center h-20 border-b border-teal-900">
        <span className="text-2xl font-bold text-teal-400">HerculesAI</span>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-teal-700 text-white' : 'text-gray-300 hover:bg-teal-800 hover:text-white'}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/workout"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-teal-700 text-white' : 'text-gray-300 hover:bg-teal-800 hover:text-white'}`
          }
        >
          Workout
        </NavLink>
        <NavLink
          to="/nutrition"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-teal-700 text-white' : 'text-gray-300 hover:bg-teal-800 hover:text-white'}`
          }
        >
          Nutrition
        </NavLink>
        <NavLink
          to="/ai-assistant"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-teal-700 text-white' : 'text-gray-300 hover:bg-teal-800 hover:text-white'}`
          }
        >
          AI Assistant
        </NavLink>
        <NavLink
          to="/progress"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-teal-700 text-white' : 'text-gray-300 hover:bg-teal-800 hover:text-white'}`
          }
        >
          Progress
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-teal-700 text-white' : 'text-gray-300 hover:bg-teal-800 hover:text-white'}`
          }
        >
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar; 