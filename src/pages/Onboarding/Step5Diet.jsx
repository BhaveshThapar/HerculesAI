import React, { useState } from 'react';

const Step5Diet = ({ onNext }) => {
  const [allergies, setAllergies] = useState({ nut: false, dairy: false });
  const [diet, setDiet] = useState('');

  const handleAllergyChange = (e) => {
    setAllergies({ ...allergies, [e.target.name]: e.target.checked });
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-xl font-semibold mb-4 text-white">Your Diet</h2>
      <div className="flex flex-col gap-2 w-full">
        <label className="flex items-center gap-2 text-white">
          <input type="checkbox" name="nut" checked={allergies.nut} onChange={handleAllergyChange} className="accent-teal-700" /> Nut Allergy
        </label>
        <label className="flex items-center gap-2 text-white">
          <input type="checkbox" name="dairy" checked={allergies.dairy} onChange={handleAllergyChange} className="accent-teal-700" /> Dairy Allergy
        </label>
      </div>
      <div className="flex flex-col gap-2 w-full mt-4">
        <button className={`w-full py-2 px-4 rounded transition ${diet==='all' ? 'bg-teal-800 text-white' : 'bg-teal-700 text-white hover:bg-teal-800'}`} onClick={() => setDiet('all')}>Eat Everything</button>
        <button className={`w-full py-2 px-4 rounded transition ${diet==='vegetarian' ? 'bg-teal-800 text-white' : 'bg-teal-700 text-white hover:bg-teal-800'}`} onClick={() => setDiet('vegetarian')}>Vegetarian</button>
        <button className={`w-full py-2 px-4 rounded transition ${diet==='vegan' ? 'bg-teal-800 text-white' : 'bg-teal-700 text-white hover:bg-teal-800'}`} onClick={() => setDiet('vegan')}>Vegan</button>
      </div>
      <button className="w-full py-2 px-4 bg-teal-700 text-white rounded hover:bg-teal-800 transition mt-4" onClick={() => onNext({ allergies, diet })} disabled={!diet}>Next</button>
    </div>
  );
};

export default Step5Diet; 