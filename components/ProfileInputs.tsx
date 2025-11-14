'use client';

import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Gender, UnitSystem } from '@/lib/tdeeCalculations';
import { validation } from '@/lib/tdeeCalculations';
import { HelpCircle } from 'lucide-react';

interface ProfileInputsProps {
  gender: Gender;
  setGender: (gender: Gender) => void;
  age: number;
  setAge: (age: number) => void;
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  heightFeet: number;
  setHeightFeet: (feet: number) => void;
  heightInches: number;
  setHeightInches: (inches: number) => void;
  heightCm: number;
  setHeightCm: (cm: number) => void;
  weightLbs: number;
  setWeightLbs: (lbs: number) => void;
  weightKg: number;
  setWeightKg: (kg: number) => void;
  bodyFat?: number;
  setBodyFat: (bf: number | undefined) => void;
}

export function ProfileInputs({
  gender,
  setGender,
  age,
  setAge,
  unitSystem,
  setUnitSystem,
  heightFeet,
  setHeightFeet,
  heightInches,
  setHeightInches,
  heightCm,
  setHeightCm,
  weightLbs,
  setWeightLbs,
  weightKg,
  setWeightKg,
  bodyFat,
  setBodyFat
}: ProfileInputsProps) {
  return (
    <Card className="p-6 md:p-8">
      <h2 className="mb-6">Profile</h2>

      {/* Unit System Toggle */}
      <div className="mb-8">
        <Label className="mb-2 block">Unit System</Label>
        <div className="flex gap-2">
          <Button
            variant={unitSystem === 'imperial' ? 'default' : 'outline'}
            onClick={() => setUnitSystem('imperial')}
            className="flex-1"
          >
            Imperial
          </Button>
          <Button
            variant={unitSystem === 'metric' ? 'default' : 'outline'}
            onClick={() => setUnitSystem('metric')}
            className="flex-1"
          >
            Metric
          </Button>
        </div>
      </div>

      {/* Gender */}
      <div className="mb-6">
        <Label className="mb-2 block">Gender</Label>
        <div className="flex gap-2">
          <Button
            variant={gender === 'male' ? 'default' : 'outline'}
            onClick={() => setGender('male')}
            className="flex-1"
          >
            Male
          </Button>
          <Button
            variant={gender === 'female' ? 'default' : 'outline'}
            onClick={() => setGender('female')}
            className="flex-1"
          >
            Female
          </Button>
        </div>
      </div>

      {/* Age */}
      <div className="mb-6">
        <Label htmlFor="age" className="mb-2 block">Age (years)</Label>
        <Input
          id="age"
          type="number"
          value={age}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val) && validation.age(val)) {
              setAge(val);
            }
          }}
          min={15}
          max={100}
          className="w-full"
        />
      </div>

      {/* Height */}
      <div className="mb-6">
        <Label className="mb-2 block">Height</Label>
        {unitSystem === 'imperial' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="feet" className="mb-2 block text-sm text-muted-foreground">Feet</Label>
              <Select value={heightFeet.toString()} onValueChange={(v) => setHeightFeet(parseInt(v))}>
                <SelectTrigger id="feet">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[4, 5, 6, 7].map(f => (
                    <SelectItem key={f} value={f.toString()}>{f} ft</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="inches" className="mb-2 block text-sm text-muted-foreground">Inches</Label>
              <Select value={heightInches.toString()} onValueChange={(v) => setHeightInches(parseInt(v))}>
                <SelectTrigger id="inches">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i).map(i => (
                    <SelectItem key={i} value={i.toString()}>{i} in</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div>
            <Input
              id="height-cm"
              type="number"
              value={heightCm}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && validation.heightCm(val)) {
                  setHeightCm(val);
                }
              }}
              min={120}
              max={230}
              className="w-full"
              placeholder="cm"
            />
          </div>
        )}
      </div>

      {/* Weight */}
      <div className="mb-6">
        <Label htmlFor="weight" className="mb-2 block">
          Weight ({unitSystem === 'imperial' ? 'lbs' : 'kg'})
        </Label>
        <Input
          id="weight"
          type="number"
          value={unitSystem === 'imperial' ? weightLbs : weightKg}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (e.target.value === '' || isNaN(val)) {
              // Allow clearing but set to minimum valid value
              if (unitSystem === 'imperial') {
                setWeightLbs(80);
              } else {
                setWeightKg(35);
              }
            } else {
              // Allow any number input, browser min/max will constrain
              if (unitSystem === 'imperial') {
                setWeightLbs(val);
              } else {
                setWeightKg(val);
              }
            }
          }}
          min={unitSystem === 'imperial' ? 80 : 35}
          max={unitSystem === 'imperial' ? 500 : 225}
          className="w-full"
        />
      </div>

      {/* Body Fat (Optional) */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Label htmlFor="bodyfat">Body Fat % (optional)</Label>
          <button
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Providing body fat percentage enables the more accurate Katch-McArdle formula. You can measure this with calipers or a smart scale."
          >
            <HelpCircle className="size-4" />
          </button>
        </div>
        <Input
          id="bodyfat"
          type="text"
          value={bodyFat || ''}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            if (e.target.value === '') {
              setBodyFat(undefined);
            } else if (!isNaN(val) && val >= 0 && val <= 99) {
              setBodyFat(val);
            }
          }}
          placeholder="Leave blank if unknown"
          className="w-full"
        />
      </div>
    </Card>
  );
}
