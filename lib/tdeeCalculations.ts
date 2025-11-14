/**
 * TDEE Calculator - Core Calculation Functions
 * All formulas follow scientific standards and research
 */

export type Gender = 'male' | 'female';
export type UnitSystem = 'imperial' | 'metric';
export type HeartRateZone = 1 | 2 | 3 | 4 | 5;
export type LiftingIntensity = 'moderate' | 'vigorous';
export type TEFLevel = 'low' | 'balanced' | 'high';

/**
 * Calculate BMR using Katch-McArdle formula (when body fat is known)
 * Most accurate when body composition is available
 */
export function calculateBMRKatchMcArdle(weightKg: number, bodyFatPercent: number): number {
  const leanMassKg = weightKg * (1 - bodyFatPercent / 100);
  return 370 + 21.6 * leanMassKg;
}

/**
 * Calculate BMR using Mifflin-St Jeor equation (when body fat is unknown)
 * Standard formula for general population
 */
export function calculateBMRMifflinStJeor(
  gender: Gender,
  ageYears: number,
  heightCm: number,
  weightKg: number
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  return gender === 'male' ? base + 5 : base - 161;
}

/**
 * Calculate BMR automatically choosing the best formula
 */
export function calculateBMR(
  gender: Gender,
  ageYears: number,
  heightCm: number,
  weightKg: number,
  bodyFatPercent?: number
): number {
  if (bodyFatPercent !== undefined && bodyFatPercent > 0) {
    return calculateBMRKatchMcArdle(weightKg, bodyFatPercent);
  }
  return calculateBMRMifflinStJeor(gender, ageYears, heightCm, weightKg);
}

/**
 * Convert heart rate zone to average heart rate
 */
export function getAverageHeartRate(zone: HeartRateZone, ageYears: number): number {
  const maxHR = 220 - ageYears;
  
  const zoneMidpoints: Record<HeartRateZone, number> = {
    1: 0.55,  // 50-60% → use 55%
    2: 0.65,  // 60-70% → use 65%
    3: 0.75,  // 70-80% → use 75%
    4: 0.85,  // 80-90% → use 85%
    5: 0.95   // 90%+   → use 95%
  };
  
  return maxHR * zoneMidpoints[zone];
}

/**
 * Calculate calories burned from heart rate
 * Uses scientifically validated formula from research
 */
export function calculateCaloriesFromHeartRate(
  gender: Gender,
  ageYears: number,
  weightKg: number,
  heartRate: number,
  durationMinutes: number
): number {
  if (gender === 'male') {
    return (durationMinutes * (0.6309 * heartRate + 0.1988 * weightKg + 0.2017 * ageYears - 55.0969)) / 4.184;
  } else {
    return (durationMinutes * (0.4472 * heartRate - 0.1263 * weightKg + 0.074 * ageYears - 20.4022)) / 4.184;
  }
}

/**
 * Calculate calories from heart rate zone activity
 */
export function calculateZoneCalories(
  gender: Gender,
  ageYears: number,
  weightKg: number,
  zone: HeartRateZone,
  durationMinutes: number
): number {
  const avgHR = getAverageHeartRate(zone, ageYears);
  return calculateCaloriesFromHeartRate(gender, ageYears, weightKg, avgHR, durationMinutes);
}

/**
 * Calculate calories from weight lifting with automatic EPOC bonus
 * EPOC (Excess Post-Exercise Oxygen Consumption) adds ~10% afterburn effect
 */
export function calculateLiftingCalories(
  weightKg: number,
  intensity: LiftingIntensity,
  durationMinutes: number
): number {
  const MET = intensity === 'vigorous' ? 6.0 : 3.5;
  const baseCalories = MET * weightKg * (durationMinutes / 60);
  const epocBonus = baseCalories * 0.10; // 10% EPOC
  return baseCalories + epocBonus;
}

/**
 * Estimate steps taken during cardio activity
 * Used to avoid double-counting in NEAT calculation
 */
export function estimateCardioSteps(durationMinutes: number, intensity: 'low' | 'moderate' | 'high'): number {
  const stepsPerMinute: Record<typeof intensity, number> = {
    low: 100,      // Walking pace
    moderate: 140, // Jogging
    high: 180      // Running
  };
  return durationMinutes * stepsPerMinute[intensity];
}

/**
 * Calculate NEAT (Non-Exercise Activity Thermogenesis) from daily steps
 * Subtracts cardio steps to avoid double-counting
 */
export function calculateNEATFromSteps(
  totalSteps: number,
  cardioSteps: number,
  heightCm: number,
  weightKg: number
): number {
  const neatSteps = Math.max(0, totalSteps - cardioSteps);
  
  // Calculate stride length (roughly 0.413 * height)
  const strideLengthCm = heightCm * 0.413;
  
  // Calculate distance in kilometers
  const distanceKm = (neatSteps * strideLengthCm) / 100000;
  
  // Estimate time spent walking (average 4.8 km/h)
  const timeHours = distanceKm / 4.8;
  
  // Calculate calories (3.5 METs for walking)
  const walkingMET = 3.5;
  return walkingMET * weightKg * timeHours;
}

/**
 * Get TEF (Thermic Effect of Food) multiplier
 * TEF is the energy required to digest, absorb, and process nutrients
 */
export function getTEFMultiplier(tefLevel: TEFLevel): number {
  const multipliers: Record<TEFLevel, number> = {
    low: 1.08,      // 8% for low protein / high fat diets
    balanced: 1.10, // 10% for balanced diets (default)
    high: 1.15      // 15% for high protein diets (150g+ daily)
  };
  return multipliers[tefLevel];
}

/**
 * Calculate final TDEE with all components
 */
export function calculateTDEE(
  bmr: number,
  exerciseCalories: number,
  neatCalories: number,
  tefLevel: TEFLevel,
  calibrationFactor: number
): number {
  const baseTDEE = bmr + exerciseCalories + neatCalories;
  const tefMultiplier = getTEFMultiplier(tefLevel);
  return baseTDEE * tefMultiplier * calibrationFactor;
}

/**
 * Unit conversion utilities
 */
export const convertUnits = {
  lbsToKg: (lbs: number) => lbs * 0.453592,
  kgToLbs: (kg: number) => kg * 2.20462,
  inchesToCm: (inches: number) => inches * 2.54,
  cmToInches: (cm: number) => cm / 2.54,
  feetInchesToCm: (feet: number, inches: number) => (feet * 12 + inches) * 2.54,
  cmToFeetInches: (cm: number): { feet: number; inches: number } => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  }
};

/**
 * Validation utilities
 */
export const validation = {
  age: (age: number) => age >= 15 && age <= 100,
  heightCm: (cm: number) => cm >= 120 && cm <= 230,
  weightKg: (kg: number) => kg >= 35 && kg <= 225,
  bodyFat: (percent: number) => percent >= 5 && percent <= 50,
  steps: (steps: number) => steps >= 0 && steps <= 50000,
  duration: (minutes: number) => minutes >= 0 && minutes <= 240,
  heartRate: (bpm: number) => bpm >= 40 && bpm <= 220,
  calibration: (factor: number) => factor >= 0.85 && factor <= 1.15
};
