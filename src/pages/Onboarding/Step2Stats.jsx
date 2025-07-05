import React, { useState } from 'react';

const Step2Stats = ({ onNext }) => {
  const [form, setForm] = useState({ 
    gender: '', 
    age: '', 
    heightFeet: '', 
    heightInches: '', 
    weight: '' 
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const height = form.heightFeet && form.heightInches ? `${form.heightFeet}'${form.heightInches}"` : '';
    const formData = {
      gender: form.gender,
      age: form.age,
      height: height,
      weight: form.weight
    };
    onNext(formData);
  };

  const isFormValid = () => {
    return form.gender && form.age && form.heightFeet && form.heightInches && form.weight;
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-4 text-white">Your Stats</h2>
      
      <div>
        <label className="block text-sm font-medium text-white mb-1">Gender</label>
        <select 
          name="gender" 
          value={form.gender} 
          onChange={handleChange}
          className="w-full p-2 border border-teal-700 rounded text-white bg-gray-900"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Age</label>
        <input 
          name="age" 
          type="number" 
          value={form.age} 
          onChange={handleChange} 
          placeholder="Age" 
          min="13"
          max="120"
          className="w-full p-2 border border-teal-700 rounded text-white bg-gray-900 placeholder-gray-400" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Height</label>
        <div className="flex gap-2">
          <input 
            name="heightFeet" 
            type="number" 
            value={form.heightFeet} 
            onChange={handleChange} 
            placeholder="Feet" 
            min="3"
            max="8"
            className="flex-1 p-2 border border-teal-700 rounded text-white bg-gray-900 placeholder-gray-400" 
          />
          <input 
            name="heightInches" 
            type="number" 
            value={form.heightInches} 
            onChange={handleChange} 
            placeholder="Inches" 
            min="0"
            max="11"
            className="flex-1 p-2 border border-teal-700 rounded text-white bg-gray-900 placeholder-gray-400" 
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Enter height in feet and inches</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Weight (lbs)</label>
        <input 
          name="weight" 
          type="number" 
          value={form.weight} 
          onChange={handleChange} 
          placeholder="Weight in pounds" 
          min="50"
          max="500"
          className="w-full p-2 border border-teal-700 rounded text-white bg-gray-900 placeholder-gray-400" 
        />
      </div>

      <button 
        className="w-full py-2 px-4 bg-teal-700 text-white rounded hover:bg-teal-800 transition disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={handleSubmit}
        disabled={!isFormValid()}
      >
        Next
      </button>
    </div>
  );
};

export default Step2Stats; 