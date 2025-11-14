'use client';

import { Card } from '@/components/ui/card';
import type { Activity } from '@/app/page';
import { Flame } from 'lucide-react';

interface TDEEDisplayProps {
  tdee: number;
  bmr: number;
  exerciseCalories: number;
  neatCalories: number;
  liftingCalories: number;
  activities: Activity[];
}

export function TDEEDisplay({
  tdee,
  bmr,
  exerciseCalories,
  neatCalories,
  liftingCalories,
  activities
}: TDEEDisplayProps) {
  // Calculate percentages for visualization
  const total = bmr + exerciseCalories + neatCalories;
  const bmrPercent = total > 0 ? (bmr / total) * 100 : 0;
  const exercisePercent = total > 0 ? (exerciseCalories / total) * 100 : 0;
  const neatPercent = total > 0 ? (neatCalories / total) * 100 : 0;

  return (
    <Card className="p-6 md:p-8">
      {/* Main TDEE Number */}
      <div className="mb-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-2 text-muted-foreground">
          <Flame className="size-6" />
          <span className="text-lg font-medium">Total Daily Energy Expenditure</span>
        </div>
        <div className="text-6xl md:text-7xl font-bold tracking-tight">
          {tdee.toLocaleString()}
        </div>
        <div className="text-xl md:text-2xl text-muted-foreground mt-2">
          calories burned today
        </div>
      </div>

      {/* Breakdown Visualization */}
      <div className="mb-6">
        <div className="h-12 md:h-16 flex rounded-lg overflow-hidden">
          {/* BMR */}
          <div
            className="bg-blue-500 flex items-center justify-center text-white text-sm font-medium transition-all"
            style={{ width: `${bmrPercent}%` }}
            title={`BMR: ${Math.round(bmr)} kcal`}
          >
            {bmrPercent > 15 && <span className="px-2">BMR</span>}
          </div>
          
          {/* Exercise */}
          {exerciseCalories > 0 && (
            <div
              className="bg-green-500 flex items-center justify-center text-white text-sm font-medium transition-all"
              style={{ width: `${exercisePercent}%` }}
              title={`Exercise: ${Math.round(exerciseCalories)} kcal`}
            >
              {exercisePercent > 15 && <span className="px-2">Exercise</span>}
            </div>
          )}
          
          {/* NEAT */}
          {neatCalories > 0 && (
            <div
              className="bg-orange-500 flex items-center justify-center text-white text-sm font-medium transition-all"
              style={{ width: `${neatPercent}%` }}
              title={`Steps: ${Math.round(neatCalories)} kcal`}
            >
              {neatPercent > 15 && <span className="px-2">Steps</span>}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-blue-500" />
            <span className="font-medium">BMR (Base Metabolic Rate)</span>
          </div>
          <span className="font-semibold">{Math.round(bmr)} kcal</span>
        </div>

        {exerciseCalories > 0 && (
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-green-500" />
              <span className="font-medium">Exercise</span>
            </div>
            <span className="font-semibold">{Math.round(exerciseCalories)} kcal</span>
          </div>
        )}

        {neatCalories > 0 && (
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-orange-500" />
              <span className="font-medium">NEAT (from steps)</span>
            </div>
            <span className="font-semibold">{Math.round(neatCalories)} kcal</span>
          </div>
        )}

        <div className="flex items-center justify-between py-2 border-b">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-purple-500" />
            <span className="font-medium">TEF (Thermic Effect of Food)</span>
          </div>
          <span className="font-semibold">{Math.round(tdee - (bmr + exerciseCalories + neatCalories))} kcal</span>
        </div>

        <div className="flex items-center justify-between py-3 pt-4 text-lg font-bold">
          <span>Total TDEE</span>
          <span>{tdee.toLocaleString()} kcal</span>
        </div>
      </div>

      {/* Activity Details */}
      {activities.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold mb-3">Activity Details</h3>
          <div className="space-y-2">
            {activities.map(activity => (
              <div key={activity.id} className="text-sm flex items-center justify-between">
                <span className="text-muted-foreground">
                  Zone {activity.zone} • {activity.duration} min
                  {activity.name && ` • ${activity.name}`}
                </span>
              </div>
            ))}
            {liftingCalories > 0 && (
              <div className="text-sm flex items-center justify-between">
                <span className="text-muted-foreground">
                  Weight Lifting (includes 10% EPOC bonus)
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
