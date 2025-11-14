'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ProfileInputs } from '@/components/ProfileInputs';
import { ActivityTracking } from '@/components/ActivityTracking';
import { TDEEDisplay } from '@/components/TDEEDisplay';
import { AdvancedControls } from '@/components/AdvancedControls';
import type { Gender, UnitSystem, HeartRateZone, LiftingIntensity, TEFLevel } from '@/lib/tdeeCalculations';
import { calculateBMR, calculateTDEE, calculateZoneCalories, calculateLiftingCalories, calculateNEATFromSteps, convertUnits } from '@/lib/tdeeCalculations';

export interface Activity {
  id: string;
  zone: HeartRateZone;
  duration: number;
  name?: string;
}

export default function Home() {
  // Profile state
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<string>('');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(10);
  const [heightCm, setHeightCm] = useState<string>('');
  const [weightLbs, setWeightLbs] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');
  const [bodyFat, setBodyFat] = useState<string>('');

  // Activity state
  const [dailySteps, setDailySteps] = useState<string>('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [liftingDuration, setLiftingDuration] = useState<number>(0);
  const [liftingIntensity, setLiftingIntensity] = useState<LiftingIntensity>('moderate');

  // Advanced controls
  const [tefLevel, setTefLevel] = useState<TEFLevel>('balanced');
  const [calibration, setCalibration] = useState<number>(1.0);

  // Calculated values
  const [bmr, setBmr] = useState<number>(0);
  const [tdee, setTdee] = useState<number>(0);
  const [exerciseCalories, setExerciseCalories] = useState<number>(0);
  const [neatCalories, setNeatCalories] = useState<number>(0);
  const [liftingCalories, setLiftingCalories] = useState<number>(0);

  // Sync height conversions
  useEffect(() => {
    if (unitSystem === 'imperial') {
      const cm = convertUnits.feetInchesToCm(heightFeet, heightInches);
      setHeightCm(Math.round(cm).toString());
    } else if (heightCm) {
      const cm = parseFloat(heightCm);
      if (!isNaN(cm)) {
        const { feet, inches } = convertUnits.cmToFeetInches(cm);
        setHeightFeet(feet);
        setHeightInches(inches);
      }
    }
  }, [heightFeet, heightInches, heightCm, unitSystem]);

  // Sync weight conversions
  useEffect(() => {
    if (unitSystem === 'imperial' && weightLbs) {
      const lbs = parseFloat(weightLbs);
      if (!isNaN(lbs)) {
        setWeightKg(Math.round(convertUnits.lbsToKg(lbs)).toString());
      }
    } else if (unitSystem === 'metric' && weightKg) {
      const kg = parseFloat(weightKg);
      if (!isNaN(kg)) {
        setWeightLbs(Math.round(convertUnits.kgToLbs(kg)).toString());
      }
    }
  }, [weightLbs, weightKg, unitSystem]);

  // Calculate everything when inputs change
  useEffect(() => {
    // Parse values
    const ageNum = parseFloat(age) || 0;
    const heightCmNum = parseFloat(heightCm) || 0;
    const weightLbsNum = parseFloat(weightLbs) || 0;
    const weightKgNum = parseFloat(weightKg) || 0;
    const bodyFatNum = parseFloat(bodyFat) || undefined;
    const dailyStepsNum = parseFloat(dailySteps) || 0;

    // Calculate BMR
    const currentHeightCm = unitSystem === 'imperial'
      ? convertUnits.feetInchesToCm(heightFeet, heightInches)
      : heightCmNum;
    const currentWeightKg = unitSystem === 'imperial'
      ? convertUnits.lbsToKg(weightLbsNum)
      : weightKgNum;

    const calculatedBMR = calculateBMR(gender, ageNum, currentHeightCm, currentWeightKg, bodyFatNum);
    setBmr(calculatedBMR);

    // Calculate exercise calories from activities
    let totalExerciseCalories = 0;
    let totalCardioSteps = 0;

    activities.forEach(activity => {
      const calories = calculateZoneCalories(gender, ageNum, currentWeightKg, activity.zone, activity.duration);
      totalExerciseCalories += calories;

      // Estimate steps from cardio (rough estimate based on zone)
      const intensity = activity.zone <= 2 ? 'low' : activity.zone <= 3 ? 'moderate' : 'high';
      const stepsPerMin = intensity === 'low' ? 100 : intensity === 'moderate' ? 140 : 180;
      totalCardioSteps += activity.duration * stepsPerMin;
    });

    // Add lifting calories
    const liftingCals = liftingDuration > 0
      ? calculateLiftingCalories(currentWeightKg, liftingIntensity, liftingDuration)
      : 0;
    setLiftingCalories(liftingCals);
    totalExerciseCalories += liftingCals;
    setExerciseCalories(totalExerciseCalories);

    // Calculate NEAT from steps
    const neat = calculateNEATFromSteps(dailyStepsNum, totalCardioSteps, currentHeightCm, currentWeightKg);
    setNeatCalories(neat);

    // Calculate final TDEE
    const finalTDEE = calculateTDEE(calculatedBMR, totalExerciseCalories, neat, tefLevel, calibration);
    setTdee(Math.round(finalTDEE));

  }, [gender, age, heightFeet, heightInches, heightCm, weightLbs, weightKg, bodyFat, unitSystem, dailySteps, activities, liftingDuration, liftingIntensity, tefLevel, calibration]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tdee-calculator-state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setGender(state.gender || 'male');
        setAge(state.age?.toString() || '');
        setUnitSystem(state.unitSystem || 'imperial');
        setHeightFeet(state.heightFeet || 5);
        setHeightInches(state.heightInches || 10);
        setHeightCm(state.heightCm?.toString() || '');
        setWeightLbs(state.weightLbs?.toString() || '');
        setWeightKg(state.weightKg?.toString() || '');
        setBodyFat(state.bodyFat?.toString() || '');
        setDailySteps(state.dailySteps?.toString() || '');
        setActivities(state.activities || []);
        setLiftingDuration(state.liftingDuration || 0);
        setLiftingIntensity(state.liftingIntensity || 'moderate');
        setTefLevel(state.tefLevel || 'balanced');
        setCalibration(state.calibration || 1.0);
      } catch (e) {
        console.error('Failed to load saved state', e);
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    const state = {
      gender,
      age,
      unitSystem,
      heightFeet,
      heightInches,
      heightCm,
      weightLbs,
      weightKg,
      bodyFat,
      dailySteps,
      activities,
      liftingDuration,
      liftingIntensity,
      tefLevel,
      calibration
    };
    localStorage.setItem('tdee-calculator-state', JSON.stringify(state));
  }, [gender, age, unitSystem, heightFeet, heightInches, heightCm, weightLbs, weightKg, bodyFat, dailySteps, activities, liftingDuration, liftingIntensity, tefLevel, calibration]);

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-8 md:py-12">
        <header className="mb-8 md:mb-12">
          <h1 className="mb-2">Enhanced TDEE Calculator</h1>
          <p className="text-muted-foreground">
            Calculate your Total Daily Energy Expenditure with precision using heart rate zones
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left Column: Inputs */}
          <div className="space-y-8 lg:col-span-2">
            <ProfileInputs
              gender={gender}
              setGender={setGender}
              age={age}
              setAge={setAge}
              unitSystem={unitSystem}
              setUnitSystem={setUnitSystem}
              heightFeet={heightFeet}
              setHeightFeet={setHeightFeet}
              heightInches={heightInches}
              setHeightInches={setHeightInches}
              heightCm={heightCm}
              setHeightCm={setHeightCm}
              weightLbs={weightLbs}
              setWeightLbs={setWeightLbs}
              weightKg={weightKg}
              setWeightKg={setWeightKg}
              bodyFat={bodyFat}
              setBodyFat={setBodyFat}
            />

            <ActivityTracking
              gender={gender}
              age={parseFloat(age) || 0}
              weightKg={unitSystem === 'imperial' ? convertUnits.lbsToKg(parseFloat(weightLbs) || 0) : (parseFloat(weightKg) || 0)}
              dailySteps={dailySteps}
              setDailySteps={setDailySteps}
              activities={activities}
              setActivities={setActivities}
              liftingDuration={liftingDuration}
              setLiftingDuration={setLiftingDuration}
              liftingIntensity={liftingIntensity}
              setLiftingIntensity={setLiftingIntensity}
            />
          </div>

          {/* Right Column: Results */}
          <div className="space-y-8 lg:col-span-3">
            <TDEEDisplay
              tdee={tdee}
              bmr={bmr}
              exerciseCalories={exerciseCalories}
              neatCalories={neatCalories}
              liftingCalories={liftingCalories}
              activities={activities}
            />

            <AdvancedControls
              tefLevel={tefLevel}
              setTefLevel={setTefLevel}
              calibration={calibration}
              setCalibration={setCalibration}
              bmr={bmr}
              exerciseCalories={exerciseCalories}
              neatCalories={neatCalories}
              gender={gender}
              age={parseFloat(age) || 0}
              heightCm={unitSystem === 'imperial' ? convertUnits.feetInchesToCm(heightFeet, heightInches) : (parseFloat(heightCm) || 0)}
              weightKg={unitSystem === 'imperial' ? convertUnits.lbsToKg(parseFloat(weightLbs) || 0) : (parseFloat(weightKg) || 0)}
              bodyFat={parseFloat(bodyFat) || undefined}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
