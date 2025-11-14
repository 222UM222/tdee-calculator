'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { TEFLevel, Gender } from '@/lib/tdeeCalculations';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AdvancedControlsProps {
  tefLevel: TEFLevel;
  setTefLevel: (level: TEFLevel) => void;
  calibration: number;
  setCalibration: (cal: number) => void;
  bmr: number;
  exerciseCalories: number;
  neatCalories: number;
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  bodyFat?: number;
}

export function AdvancedControls({
  tefLevel,
  setTefLevel,
  calibration,
  setCalibration,
  bmr,
  exerciseCalories,
  neatCalories,
  gender,
  age,
  heightCm,
  weightKg,
  bodyFat
}: AdvancedControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showFormula, setShowFormula] = useState(false);

  const calibrationPercent = Math.round((calibration - 1) * 100);

  return (
    <div className="space-y-4">
      {/* Advanced Controls Toggle */}
      <Button
        variant="outline"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full justify-between"
      >
        <span className="font-semibold">Advanced Accuracy Options</span>
        {showAdvanced ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </Button>

      {showAdvanced && (
        <Card className="p-6 md:p-8">
          {/* TEF Selector */}
          <div className="mb-8">
            <Label className="mb-3 block font-semibold">Thermic Effect of Food (TEF)</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Different macronutrients require different amounts of energy to digest. Select your typical diet type.
            </p>
            <div className="grid gap-2">
              <Button
                variant={tefLevel === 'low' ? 'default' : 'outline'}
                onClick={() => setTefLevel('low')}
                className="justify-start"
              >
                <div className="text-left">
                  <div className="font-semibold">Low Protein / High Fat - 8% TEF</div>
                  <div className="text-xs opacity-80">Keto, high-fat diets</div>
                </div>
              </Button>
              <Button
                variant={tefLevel === 'balanced' ? 'default' : 'outline'}
                onClick={() => setTefLevel('balanced')}
                className="justify-start"
              >
                <div className="text-left">
                  <div className="font-semibold">Balanced Diet - 10% TEF (Default)</div>
                  <div className="text-xs opacity-80">Mixed macronutrients</div>
                </div>
              </Button>
              <Button
                variant={tefLevel === 'high' ? 'default' : 'outline'}
                onClick={() => setTefLevel('high')}
                className="justify-start"
              >
                <div className="text-left">
                  <div className="font-semibold">High Protein - 15% TEF</div>
                  <div className="text-xs opacity-80">150g+ protein daily</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Metabolic Calibration */}
          <div className="mb-8">
            <Label className="mb-3 block font-semibold">Metabolic Calibration</Label>
            <p className="text-sm text-muted-foreground mb-4">
              If your weight changes don&apos;t match your calorie goals over time, adjust this slider. Most people should leave this at 0%.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">-15%</span>
                <span className="text-lg font-bold">
                  {calibrationPercent > 0 ? '+' : ''}{calibrationPercent}%
                </span>
                <span className="text-sm text-muted-foreground">+15%</span>
              </div>
              <Slider
                value={[calibration * 100]}
                onValueChange={(v) => setCalibration(v[0] / 100)}
                min={85}
                max={115}
                step={1}
                className="w-full"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCalibration(1.0)}
                className="w-full"
              >
                Reset to 0%
              </Button>
            </div>
          </div>

          {/* Formula Breakdown */}
          <div>
            <Button
              variant="outline"
              onClick={() => setShowFormula(!showFormula)}
              className="w-full justify-between mb-4"
            >
              <span className="font-semibold">How is this calculated?</span>
              {showFormula ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </Button>

            {showFormula && (
              <div className="space-y-4 text-sm">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Step 1: Calculate BMR</h4>
                  {bodyFat ? (
                    <>
                      <p className="text-muted-foreground mb-1">Formula: Katch-McArdle (body fat provided)</p>
                      <p className="font-mono text-xs">
                        BMR = 370 + 21.6 × Lean Mass<br />
                        Lean Mass = {weightKg.toFixed(1)} × (1 - {bodyFat}% / 100) = {(weightKg * (1 - bodyFat / 100)).toFixed(1)} kg<br />
                        BMR = 370 + 21.6 × {(weightKg * (1 - bodyFat / 100)).toFixed(1)} = {Math.round(bmr)} kcal
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-muted-foreground mb-1">Formula: Mifflin-St Jeor</p>
                      <p className="font-mono text-xs">
                        BMR = 10W + 6.25H - 5A {gender === 'male' ? '+ 5' : '- 161'}<br />
                        BMR = 10({weightKg.toFixed(1)}) + 6.25({heightCm}) - 5({age}) {gender === 'male' ? '+ 5' : '- 161'}<br />
                        BMR = {Math.round(bmr)} kcal
                      </p>
                    </>
                  )}
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Step 2: Add Exercise Calories</h4>
                  <p className="text-muted-foreground mb-1">Heart rate zone formula + lifting with EPOC</p>
                  <p className="font-mono text-xs">
                    Exercise Calories = {Math.round(exerciseCalories)} kcal
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Step 3: Add NEAT from Steps</h4>
                  <p className="text-muted-foreground mb-1">Walking calories (cardio steps subtracted)</p>
                  <p className="font-mono text-xs">
                    NEAT Calories = {Math.round(neatCalories)} kcal
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Step 4: Apply TEF</h4>
                  <p className="text-muted-foreground mb-1">Thermic Effect of Food</p>
                  <p className="font-mono text-xs">
                    Base TDEE = {Math.round(bmr)} + {Math.round(exerciseCalories)} + {Math.round(neatCalories)} = {Math.round(bmr + exerciseCalories + neatCalories)} kcal<br />
                    TEF Multiplier = {tefLevel === 'low' ? '1.08' : tefLevel === 'balanced' ? '1.10' : '1.15'}<br />
                    TDEE with TEF = {Math.round(bmr + exerciseCalories + neatCalories)} × {tefLevel === 'low' ? '1.08' : tefLevel === 'balanced' ? '1.10' : '1.15'} = {Math.round((bmr + exerciseCalories + neatCalories) * (tefLevel === 'low' ? 1.08 : tefLevel === 'balanced' ? 1.10 : 1.15))} kcal
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Step 5: Apply Calibration</h4>
                  <p className="text-muted-foreground mb-1">Personal metabolic adjustment</p>
                  <p className="font-mono text-xs">
                    Calibration Factor = {calibration.toFixed(2)}<br />
                    Final TDEE = {Math.round((bmr + exerciseCalories + neatCalories) * (tefLevel === 'low' ? 1.08 : tefLevel === 'balanced' ? 1.10 : 1.15))} × {calibration.toFixed(2)} = {Math.round((bmr + exerciseCalories + neatCalories) * (tefLevel === 'low' ? 1.08 : tefLevel === 'balanced' ? 1.10 : 1.15) * calibration)} kcal
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
