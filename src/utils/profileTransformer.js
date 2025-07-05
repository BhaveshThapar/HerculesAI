
export const parseHeight = (heightInput) => {
  if (!heightInput || typeof heightInput !== 'string') {
    return null;
  }

  const input = heightInput.trim().toLowerCase();
  
  if (input.includes('cm')) {
    const cm = parseFloat(input.replace('cm', ''));
    return isNaN(cm) ? null : cm;
  }
  
  if (input.includes('m') && !input.includes('cm')) {
    const meters = parseFloat(input.replace('m', ''));
    return isNaN(meters) ? null : meters * 100;
  }
  
  if (input.includes("'")) {
    const parts = input.split("'");
    const feet = parseFloat(parts[0]);
    const inches = parseFloat(parts[1].replace('"', '').replace('"', ''));
    
    if (isNaN(feet) || isNaN(inches)) {
      return null;
    }
    
    return (feet * 30.48) + (inches * 2.54);
  }
  
  if (input.includes('in')) {
    const inches = parseFloat(input.replace('in', ''));
    return isNaN(inches) ? null : inches * 2.54;
  }
  
  const numeric = parseFloat(input);
  return isNaN(numeric) ? null : numeric;
};


export const parseWeight = (weightInput) => {
  if (!weightInput || typeof weightInput !== 'string') {
    return null;
  }

  const input = weightInput.trim().toLowerCase();
  
  if (input.includes('lb')) {
    const lbs = parseFloat(input.replace('lbs', '').replace('lb', ''));
    return isNaN(lbs) ? null : lbs;
  }
  
  if (input.includes('kg')) {
    const kg = parseFloat(input.replace('kg', ''));
    return isNaN(kg) ? null : kg * 2.20462;
  }
  
  const numeric = parseFloat(input);
  return isNaN(numeric) ? null : numeric;
};


export const transformOnboardingData = (answers) => {
  const transformed = { ...answers };
  
  if (answers.stats?.height) {
    const heightCm = parseHeight(answers.stats.height);
    if (heightCm !== null) {
      transformed.stats = { ...transformed.stats, height: heightCm };
    }
  }
  
  if (answers.stats?.weight) {
    const weightLbs = parseWeight(answers.stats.weight);
    if (weightLbs !== null) {
      transformed.stats = { ...transformed.stats, weight: weightLbs };
    }
  }
  
  if (answers.stats?.age) {
    const age = parseInt(answers.stats.age);
    if (!isNaN(age)) {
      transformed.stats = { ...transformed.stats, age };
    }
  }
  
  return transformed;
};


export const transformProfileData = (answers, userId) => {
  const transformed = {
    user_id: userId,
    goal: answers.goal,
    gender: answers.stats?.gender,
    age: answers.stats?.age ? parseInt(answers.stats.age) : null,
    height: answers.stats?.height ? parseHeight(answers.stats.height) : null,
    weight: answers.stats?.weight ? parseWeight(answers.stats.weight) : null,
    gym_access: answers.gym,
    experience: answers.experience,
    diet_preference: answers.diet?.diet || null,
    nut_allergy: answers.diet?.allergies?.nut || false,
    dairy_allergy: answers.diet?.allergies?.dairy || false,
    onboarding_completed: true
  };
  
  return transformed;
};

export function mapGymAccess(gymAccess) {
  const mapping = {
    'full_gym': 'full_gym',
    'limited_equipment': 'limited_equipment', 
    'bodyweight_only': 'bodyweight_only'
  };
  return mapping[gymAccess] || 'full_gym';
}

export function mapExperience(experience) {
  const mapping = {
    'beginner': 'beginner',
    'intermediate': 'intermediate',
    'advanced': 'advanced'
  };
  return mapping[experience] || 'beginner';
}

export function mapGoal(goal) {
  const mapping = {
    'bulk': 'bulk',
    'cut': 'cut', 
    'maintain': 'maintain'
  };
  return mapping[goal] || 'maintain';
}

export function mapGender(gender) {
  if (!gender) return 'male';
  return gender.toLowerCase();
}

export function transformProfile(profile) {
  return {
    username: profile.username || '',
    age: profile.age ? parseInt(profile.age) : 25,
    weight_kg: parseWeight(profile.weight),
    height_cm: parseHeight(profile.height),
    gender: mapGender(profile.gender),
    goal: mapGoal(profile.goal),
    experience: mapExperience(profile.experience),
    equipment_access: mapGymAccess(profile.gym_access),
    diet_preference: profile.diet_preference || 'all',
    activity_level: 'moderate',
    workout_frequency: 3
  };
}

export function isProfileCompleteForML(profile) {
  if (!profile) return false;
  
  const requiredFields = [
    'goal', 'experience', 'gym_access', 'diet_preference',
    'age', 'weight', 'height', 'gender'
  ];
  
  
  const missingFields = requiredFields.filter(field => {
    const value = profile[field];
    const isValid = value !== null && value !== undefined && value !== '';
    return !isValid;
  });
  
  
  return missingFields.length === 0;
}

export function getMissingFields(profile) {
  if (!profile) return ['Complete your profile'];
  
  const requiredFields = [
    { key: 'goal', label: 'Fitness Goal' },
    { key: 'experience', label: 'Experience Level' },
    { key: 'gym_access', label: 'Gym Access' },
    { key: 'diet_preference', label: 'Diet Preference' },
    { key: 'age', label: 'Age' },
    { key: 'weight', label: 'Weight' },
    { key: 'height', label: 'Height' },
    { key: 'gender', label: 'Gender' }
  ];
  
  return requiredFields
    .filter(field => {
      const value = profile[field.key];
      return value === null || value === undefined || value === '';
    })
    .map(field => field.label);
} 