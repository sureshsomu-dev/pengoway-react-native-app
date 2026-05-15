export const milestoneQuotes = [
  'The ice gives no shortcuts. It only rewards the next step.',
  'Endurance is quiet. It sounds like snow under steady boots.',
  'A long rescue is still a rescue when the heart keeps moving.',
  'The horizon yields to those who keep faith with the path.',
  'Every frozen mile softens when someone refuses to stop.',
];

export function getMilestoneQuote(milestone: number) {
  return milestoneQuotes[milestone % milestoneQuotes.length];
}

export function getNarrativeHeadline(distanceKm: number) {
  if (distanceKm < 0.8) {
    return 'Breaking News: A faint penguin signal flickers beyond the first ridge.';
  }

  if (distanceKm < 2) {
    return 'Breaking News: Penguin spotted 2km away. The blizzard is clearing.';
  }

  if (distanceKm < 4) {
    return 'Breaking News: Fresh tracks cut across the ice shelf. Stay on course.';
  }

  if (distanceKm < 6) {
    return 'Breaking News: Sunlight breaks through. A rescue corridor is opening.';
  }

  if (distanceKm < 10) {
    return 'Breaking News: The traveler nears a frozen inlet. Hope is in sight.';
  }

  return 'Breaking News: The colony beacon is visible. The final approach has begun.';
}

export const vehicleCatalog = [
  {
    id: 'snowmobile',
    title: 'Snowmobile',
    price: '$4.99',
    boostLabel: '1.8x stride boost',
    description: 'Deploys beside the traveler and accelerates every detected step.',
  },
  {
    id: 'helicopter',
    title: 'Helicopter',
    price: '$9.99',
    boostLabel: '3.2x mission boost',
    description: 'Sweeps overhead to turn each step into a dramatic rescue push.',
  },
] as const;
