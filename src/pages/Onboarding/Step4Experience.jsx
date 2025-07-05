import React from 'react';

const Step4Experience = ({ onNext }) => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-xl font-semibold mb-4 text-white">Your Experience</h2>
      <button className="w-full py-2 px-4 bg-teal-700 text-white rounded hover:bg-teal-800 transition" onClick={() => onNext('beginner')}>Beginner (0-1 years)</button>
      <button className="w-full py-2 px-4 bg-teal-700 text-white rounded hover:bg-teal-800 transition" onClick={() => onNext('intermediate')}>Intermediate (1-3 years)</button>
      <button className="w-full py-2 px-4 bg-teal-700 text-white rounded hover:bg-teal-800 transition" onClick={() => onNext('advanced')}>Advanced (3+ years)</button>
    </div>
  );
};

export default Step4Experience; 