import React from 'react';

const Step1Goal = ({ onNext }) => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-xl font-semibold mb-4 text-white">Your Goal</h2>
      <button className="w-full py-2 px-4 bg-teal-700 text-white rounded hover:bg-teal-800 transition" onClick={() => onNext('cut')}>Lose Weight (Cut)</button>
      <button className="w-full py-2 px-4 bg-teal-700 text-white rounded hover:bg-teal-800 transition" onClick={() => onNext('bulk')}>Build Muscle (Bulk)</button>
      <button className="w-full py-2 px-4 bg-teal-700 text-white rounded hover:bg-teal-800 transition" onClick={() => onNext('maintain')}>Maintain Weight</button>
    </div>
  );
};

export default Step1Goal; 