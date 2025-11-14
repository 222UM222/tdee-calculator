# Enhanced TDEE Calculator

A modern, heart rate zone-based Total Daily Energy Expenditure (TDEE) calculator built with Next.js 15, TypeScript, and Tailwind CSS 4.

## Features

### Core Functionality
- **Intelligent BMR Calculation**: Automatically selects between Katch-McArdle (when body fat is provided) and Mifflin-St Jeor formulas
- **Heart Rate Zone-Based Activity Tracking**: Log cardio activities using 5 heart rate zones instead of generic activity types
- **Weight Lifting with EPOC**: Separate tracking for resistance training with automatic 10% afterburn bonus
- **NEAT Calculation**: Automatically calculates Non-Exercise Activity Thermogenesis from daily steps, subtracting cardio steps to avoid double-counting

### Advanced Features
- **Thermic Effect of Food (TEF)**: Adjustable based on diet type (8% low protein, 10% balanced, 15% high protein)
- **Metabolic Calibration**: ±15% adjustment slider for individual metabolic variation
- **Real-time Calculations**: TDEE updates instantly as you change inputs
- **Formula Breakdown**: Educational expandable section showing step-by-step calculations
- **localStorage Persistence**: Your inputs are saved automatically

### Design Standards
- **Mobile-First Responsive**: Built following strict 8-point grid system
- **Touch-Optimized**: All interactive elements meet 44px minimum touch target size
- **Fluid Typography**: Uses CSS clamp() for seamless scaling across devices
- **Accessibility**: ARIA labels, keyboard navigation, and 4.5:1 color contrast
- **Apple-Inspired**: Clean, minimal interface with generous whitespace

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the calculator.

## How It Works

### BMR Calculation
The calculator automatically chooses the most accurate formula:
- **With body fat %**: Katch-McArdle formula `BMR = 370 + 21.6 × Lean Mass`
- **Without body fat %**: Mifflin-St Jeor formula `BMR = 10W + 6.25H - 5A ± 5`

### Heart Rate Zones
Activities are logged by heart rate zone instead of activity type:
- **Zone 1** (50-60% max HR): Very Light
- **Zone 2** (60-70% max HR): Light
- **Zone 3** (70-80% max HR): Moderate
- **Zone 4** (80-90% max HR): Hard
- **Zone 5** (90%+ max HR): Maximum

Calories are calculated using scientifically validated heart rate formulas that account for gender, age, weight, and duration.

### Final TDEE Formula
```
TDEE = (BMR + Exercise + NEAT) × TEF × Calibration
```

Where:
- **BMR**: Base Metabolic Rate
- **Exercise**: Cardio (heart rate zones) + Lifting (with EPOC)
- **NEAT**: Non-Exercise Activity Thermogenesis from steps
- **TEF**: Thermic Effect of Food (8-15%)
- **Calibration**: Personal metabolic adjustment (0.85-1.15)

## Project Structure

```
app/
  ├── globals.css           # Global styles with 8-point grid
  ├── layout.tsx            # Root layout
  └── page.tsx              # Main calculator page
components/
  ├── ui/                   # shadcn/ui components
  ├── ProfileInputs.tsx     # Profile input section
  ├── ActivityTracking.tsx  # Heart rate zone activities
  ├── TDEEDisplay.tsx       # Results visualization
  └── AdvancedControls.tsx  # TEF and calibration
lib/
  ├── utils.ts              # Utility functions
  └── tdeeCalculations.ts   # All calculation logic
```

## Design Principles

### Mobile-First
All styles are written mobile-first, then enhanced for larger screens using Tailwind breakpoints.

### 8-Point Grid
All spacing uses multiples of 8px (gap-2, gap-4, gap-6, gap-8, etc.) for consistent layouts across devices.

### Touch Targets
All buttons meet Apple's 44px minimum touch target size for optimal mobile usability.

### Fluid Typography
Headings and body text use CSS clamp() to scale smoothly between mobile and desktop without breakpoints.

## License

MIT
