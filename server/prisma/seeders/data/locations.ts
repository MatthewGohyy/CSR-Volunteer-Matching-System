/**
 * Australian Cities and Suburbs for realistic location data
 */

export const australianCities = [
  // New South Wales
  'Sydney', 'Newcastle', 'Wollongong', 'Central Coast', 'Parramatta',
  'Penrith', 'Liverpool', 'Blacktown', 'Sutherland', 'Campbelltown',
  
  // Victoria
  'Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton',
  
  // Queensland
  'Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville', 'Cairns',
  
  // South Australia
  'Adelaide', 'Mount Gambier', 'Whyalla',
  
  // Western Australia
  'Perth', 'Fremantle', 'Bunbury', 'Mandurah',
  
  // Tasmania
  'Hobart', 'Launceston',
  
  // ACT
  'Canberra',
  
  // Northern Territory
  'Darwin', 'Alice Springs'
];

export const australianStates = [
  'NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'
];

/**
 * Get a random Australian location string
 */
export function getRandomLocation(): string {
  const city = australianCities[Math.floor(Math.random() * australianCities.length)];
  const state = australianStates[Math.floor(Math.random() * australianStates.length)];
  return `${city}, ${state}`;
}

/**
 * Accessibility needs options
 */
export const accessibilityNeeds = [
  'None',
  'Wheelchair accessible',
  'Visual impairment support',
  'Hearing impairment support',
  'Mobility assistance needed',
  'Cognitive support needed',
  'Limited mobility',
  'Companion animal friendly'
];

/**
 * Request titles by category
 */
export const requestTitlesByCategory: Record<string, string[]> = {
  'Medical Appointments': [
    'Need ride to doctor appointment',
    'Transport to hospital for checkup',
    'Help getting to specialist appointment',
    'Assistance with medical appointment'
  ],
  'Transportation': [
    'Need ride to shopping center',
    'Transport to community center',
    'Help getting to social event',
    'Ride to family gathering'
  ],
  'Companionship': [
    'Looking for regular visits',
    'Need someone to chat with',
    'Weekly social visit needed',
    'Companionship for afternoon tea'
  ],
  'Home Maintenance': [
    'Help with changing light bulbs',
    'Minor repairs needed',
    'Yard work assistance',
    'Help with home maintenance'
  ],
  'Grocery Shopping': [
    'Weekly grocery shopping help',
    'Need assistance with shopping',
    'Help picking up groceries',
    'Shopping companion needed'
  ],
  'Technology Support': [
    'Help setting up smartphone',
    'Assistance with computer',
    'Need help with video calls',
    'Internet connection issues'
  ],
  'Pet Care': [
    'Dog walking assistance',
    'Help with pet care',
    'Transport pet to vet',
    'Daily pet care support'
  ],
  'Meal Preparation': [
    'Help with meal preparation',
    'Cooking assistance needed',
    'Meal planning support',
    'Help preparing weekly meals'
  ],
  'Document Assistance': [
    'Help filling out forms',
    'Assistance with paperwork',
    'Need help with documents',
    'Support with official forms'
  ],
  'Financial Guidance': [
    'Help understanding bills',
    'Budgeting assistance',
    'Support with banking',
    'Financial planning help'
  ],
  'House Cleaning': [
    'Light cleaning assistance',
    'Help with housework',
    'Weekly cleaning support',
    'Laundry assistance needed'
  ],
  'Gardening': [
    'Garden maintenance help',
    'Weeding assistance',
    'Plant care support',
    'Lawn mowing needed'
  ],
  'Reading & Writing': [
    'Help reading mail',
    'Letter writing assistance',
    'Reading support needed',
    'Help with correspondence'
  ],
  'Exercise & Fitness': [
    'Walking companion needed',
    'Exercise buddy wanted',
    'Help with daily walks',
    'Fitness encouragement needed'
  ],
  'Arts & Crafts': [
    'Craft project assistance',
    'Art activity support',
    'Creative hobby help',
    'Craft workshop companion'
  ],
  'Education & Tutoring': [
    'Computer skills learning',
    'Language learning help',
    'New skill learning support',
    'Educational assistance'
  ],
  'Event Attendance': [
    'Companion for community event',
    'Help attending concert',
    'Accompaniment to gathering',
    'Support for social event'
  ],
  'Phone Calls': [
    'Help making appointments',
    'Phone call assistance',
    'Support with phone calls',
    'Help booking services'
  ],
  'Moving & Lifting': [
    'Help moving furniture',
    'Heavy item assistance',
    'Rearranging help needed',
    'Lifting support required'
  ],
  'Emergency Support': [
    'Urgent assistance needed',
    'Immediate help required',
    'Emergency support',
    'Urgent care needed'
  ]
};

