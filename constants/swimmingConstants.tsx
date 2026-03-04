// constants/swimmingConstants.ts

export const SWIM_STROKES: string[] = [
  "Freestyle",
  "Backstroke",
  "Breaststroke",
  "Butterfly",
  "Individual Medley",
  "Kick",
  "Drill",
  "Sculling",
  "Pull",
];

export const YARD_DISTANCES: number[] = [
  25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000, 1650,
];

export const METER_DISTANCES: number[] = [
  25, 50, 100, 150, 200, 400, 800, 1500,
];

export const SWIM_DISTANCES = {
  yards: YARD_DISTANCES,
  meters: METER_DISTANCES,
};

export const ENERGY_SYSTEMS: string[] = ['N1', 'N2', 'N3', 'N4'];

export const DAYS_OF_WEEK: { id: string; Name: string }[] = [
  { id: 'Mon', Name: 'Monday' },
  { id: 'Tue', Name: 'Tuesday' },
  { id: 'Wed', Name: 'Wednesday' },
  { id: 'Thu', Name: 'Thursday' },
  { id: 'Fri', Name: 'Friday' },
  { id: 'Sat', Name: 'Saturday' },
  { id: 'Sun', Name: 'Sunday' },
];
