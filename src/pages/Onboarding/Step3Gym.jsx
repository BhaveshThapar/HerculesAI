import React from 'react';

const Step3Gym = ({ onNext }) => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-xl font-semibold mb-4 text-white">Your Gym Access</h2>
      <button className="w-full py-2 px-4 bg-teal-700 text-white rounded hover:bg-teal-800 transition" onClick={() => onNext('commercial')}>Full Commercial Gym</button>
      <button className="w-full py-2 px-4 bg-teal-700 text-white rounded hover:bg-teal-800 transition" onClick={() => onNext('home')}>Basic Home Gym (Dumbbells/Bands)</button>
      <button className="w-full py-2 px-4 bg-teal-700 text-white rounded hover:bg-teal-800 transition" onClick={() => onNext('bodyweight')}>Bodyweight Only</button>
    </div>
  );
};

export default Step3Gym; 