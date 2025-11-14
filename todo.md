# TDEE Calculator TODO

## Phase 1: Design System Setup
- [x] Initialize Next.js 15 with TypeScript and Tailwind 4
- [x] Install shadcn/ui components
- [x] Install container queries plugin
- [x] Configure globals.css with 8-point grid system
- [x] Add fluid typography with clamp()
- [x] Set up Tailwind config with container queries
- [x] Configure button sizes for touch targets (44px min)

## Phase 2: Core Calculator UI
- [x] Profile input section (gender, age, height, weight, body fat %)
- [x] Unit system toggle (Imperial/Metric)
- [x] BMR calculation logic (Katch-McArdle & Mifflin-St Jeor)
- [x] Real-time TDEE display with large number
- [x] Input validation for all fields
- [x] Mobile-first responsive layout

## Phase 3: Heart Rate Zone Activity Tracking
- [x] Heart rate zone selector (Zone 1-5)
- [x] Duration input for activities
- [x] Optional activity name field
- [x] Add/remove activity sessions
- [x] Heart rate to calorie calculation formula
- [x] Display logged activities list
- [x] Calculate NEAT from daily steps

## Phase 4: Weight Lifting
- [x] Separate weight lifting input
- [x] Intensity toggle (Light/Moderate vs Vigorous)
- [x] Duration slider
- [x] Automatic EPOC calculation (10% bonus)
- [x] Real-time calorie display

## Phase 5: Advanced Controls
- [x] Collapsible advanced section
- [x] TEF selector (Balanced 10% / High Protein 15% / Low Protein 8%)
- [x] Metabolic calibration slider (-15% to +15%)
- [x] Formula breakdown (expandable educational section)
- [x] TDEE breakdown visualization

## Phase 6: Polish & Testing
- [x] localStorage for persisting user inputs
- [x] Smooth number animations for TDEE updates
- [ ] Zone reference guide (collapsible)
- [x] Touch-friendly interactions (44px min)
- [x] Test on mobile devices
- [x] Verify 8-point grid spacing throughout
- [x] Check color contrast (4.5:1 for text)
- [x] Keyboard navigation support
- [x] ARIA labels for accessibility

## Optional Enhancements
- [ ] URL parameters for sharing configurations
- [ ] Dark mode support
- [ ] Print-friendly view
- [ ] Export results
