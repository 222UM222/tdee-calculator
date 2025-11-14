'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import type { Activity } from '@/app/page';
import type { Gender, HeartRateZone, LiftingIntensity } from '@/lib/tdeeCalculations';
import { calculateZoneCalories, calculateLiftingCalories } from '@/lib/tdeeCalculations';
import { Plus, X, Footprints, Heart, Dumbbell } from 'lucide-react';

interface ActivityTrackingProps {
  gender: Gender;
  age: number;
  weightKg: number;
  dailySteps: number;
  setDailySteps: (steps: number) => void;
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  liftingDuration: number;
  setLiftingDuration: (duration: number) => void;
  liftingIntensity: LiftingIntensity;
  setLiftingIntensity: (intensity: LiftingIntensity) => void;
}

export function ActivityTracking({
  gender,
  age,
  weightKg,
  dailySteps,
  setDailySteps,
  activities,
  setActivities,
  liftingDuration,
  setLiftingDuration,
  liftingIntensity,
  setLiftingIntensity
}: ActivityTrackingProps) {
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivityZone, setNewActivityZone] = useState<HeartRateZone>(3);
  const [newActivityDuration, setNewActivityDuration] = useState<number>(30);
  const [newActivityName, setNewActivityName] = useState<string>('');

  const addActivity = () => {
    const activity: Activity = {
      id: Date.now().toString(),
      zone: newActivityZone,
      duration: newActivityDuration,
      name: newActivityName || undefined
    };
    setActivities([...activities, activity]);
    setShowAddActivity(false);
    setNewActivityName('');
    setNewActivityDuration(30);
    setNewActivityZone(3);
  };

  const removeActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const zoneDescriptions: Record<HeartRateZone, string> = {
    1: 'Zone 1 (50-60% max HR) - Very Light',
    2: 'Zone 2 (60-70% max HR) - Light',
    3: 'Zone 3 (70-80% max HR) - Moderate',
    4: 'Zone 4 (80-90% max HR) - Hard',
    5: 'Zone 5 (90%+ max HR) - Maximum'
  };

  return (
    <Card className="p-6 md:p-8">
      <h2 className="mb-6">Daily Activity</h2>

      {/* Daily Steps */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <Footprints className="size-5 text-muted-foreground" />
          <Label htmlFor="steps">Daily Steps</Label>
        </div>
        <Input
          id="steps"
          type="number"
          value={dailySteps}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val) && val >= 0 && val <= 50000) {
              setDailySteps(val);
            }
          }}
          min={0}
          max={50000}
          step={100}
          className="w-full"
        />
      </div>

      {/* Cardio Activities */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="size-5 text-muted-foreground" />
            <h3 className="font-semibold">Cardio / Activities</h3>
          </div>
          <Button
            size="sm"
            onClick={() => setShowAddActivity(!showAddActivity)}
            variant={showAddActivity ? 'outline' : 'default'}
          >
            {showAddActivity ? 'Cancel' : <><Plus className="size-4" /> Add</>}
          </Button>
        </div>

        {/* Add Activity Form */}
        {showAddActivity && (
          <Card className="mb-4 p-4 md:p-6 bg-muted/50">
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Heart Rate Zone</Label>
                <RadioGroup
                  value={newActivityZone.toString()}
                  onValueChange={(v) => setNewActivityZone(parseInt(v) as HeartRateZone)}
                  className="space-y-2"
                >
                  {([1, 2, 3, 4, 5] as HeartRateZone[]).map(zone => (
                    <div key={zone} className="flex items-center space-x-2">
                      <RadioGroupItem value={zone.toString()} id={`zone-${zone}`} />
                      <Label htmlFor={`zone-${zone}`} className="cursor-pointer font-normal">
                        {zoneDescriptions[zone]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="duration" className="mb-2 block">
                  Duration: {newActivityDuration} minutes
                </Label>
                <Slider
                  id="duration"
                  value={[newActivityDuration]}
                  onValueChange={(v) => setNewActivityDuration(v[0])}
                  min={5}
                  max={180}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="activity-name" className="mb-2 block">
                  Activity Name (optional)
                </Label>
                <Input
                  id="activity-name"
                  value={newActivityName}
                  onChange={(e) => setNewActivityName(e.target.value)}
                  placeholder="e.g., Basketball, Hiking, Running"
                  className="w-full"
                />
              </div>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Estimated: {Math.round(calculateZoneCalories(gender, age, weightKg, newActivityZone, newActivityDuration))} kcal
                </p>
                <Button onClick={addActivity} className="w-full">
                  Add Activity
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Activity List */}
        {activities.length > 0 ? (
          <div className="space-y-2">
            {activities.map(activity => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex-1">
                  <div className="font-medium">
                    Zone {activity.zone} • {activity.duration} min
                    {activity.name && ` • ${activity.name}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(calculateZoneCalories(gender, age, weightKg, activity.zone, activity.duration))} kcal
                  </div>
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => removeActivity(activity.id)}
                  aria-label="Remove activity"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No activities logged yet
          </p>
        )}
      </div>

      {/* Weight Lifting */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Dumbbell className="size-5 text-muted-foreground" />
          <h3 className="font-semibold">Weight Lifting</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Intensity</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={liftingIntensity === 'moderate' ? 'default' : 'outline'}
                onClick={() => setLiftingIntensity('moderate')}
              >
                Light / Moderate
              </Button>
              <Button
                variant={liftingIntensity === 'vigorous' ? 'default' : 'outline'}
                onClick={() => setLiftingIntensity('vigorous')}
              >
                Vigorous
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Select &apos;Vigorous&apos; for heavy compounds with short rest. &apos;Moderate&apos; for general strength training.
            </p>
          </div>

          <div>
            <Label htmlFor="lifting-duration" className="mb-2 block">
              Duration: {liftingDuration} minutes
            </Label>
            <Slider
              id="lifting-duration"
              value={[liftingDuration]}
              onValueChange={(v) => setLiftingDuration(v[0])}
              min={0}
              max={120}
              step={5}
              className="w-full"
            />
          </div>

          {liftingDuration > 0 && (
            <p className="text-sm text-muted-foreground">
              {Math.round(calculateLiftingCalories(weightKg, liftingIntensity, liftingDuration))} kcal (includes afterburn)
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
