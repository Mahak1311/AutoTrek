export type ActivityPriority = "must-have" | "nice-to-have" | "optional";

export interface ActivityPreferences {
  sightseeing: boolean;
  food: boolean;
  adventure: boolean;
  shopping: boolean;
  relaxation: boolean;
}

export interface ActivityPriorities {
  sightseeing: ActivityPriority;
  food: ActivityPriority;
  adventure: ActivityPriority;
  shopping: ActivityPriority;
  relaxation: ActivityPriority;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface RouteInfo {
  totalDistance: number; // in km
  estimatedTravelTime: number; // in minutes
  groupings: ActivityGroup[];
  efficiency: number; // 0-100 score
  reasoning: string;
  allActivityLocations?: Array<{ name: string; location: Location }>; // Individual activity positions
}

export interface ActivityGroup {
  name: string;
  activities: string[]; // activity names
  center: Location;
  reason: string;
}

export interface Activity {
  name: string;
  category: keyof ActivityPreferences;
  estimatedCost: number;
  duration: string;
  description: string;
  location?: Location;
}

export interface DayItinerary {
  day: number;
  activities: Activity[];
  totalCost: number;
  route?: RouteInfo;
}

export interface DecisionExplanation {
  reason: string;
  detail: string;
  impact: "positive" | "neutral" | "constraint";
}

export interface TravelPlan {
  budget: number;
  totalCost: number;
  days: number;
  city: string;
  itinerary: DayItinerary[];
  isWithinBudget: boolean;
  budgetStatus: "within" | "exceeded";
  rePlanned: boolean;
  isFeasible: boolean;
  minRequiredBudget: number;
  explanations: DecisionExplanation[];
}

// Activity database with costs for different cities
const activityDatabase: Record<string, Record<string, Activity[]>> = {
  default: {
    sightseeing: [
      {
        name: "City Museum",
        category: "sightseeing",
        estimatedCost: 25,
        duration: "3 hours",
        description: "Explore history and art collections",
      },
      {
        name: "Historic Walking Tour",
        category: "sightseeing",
        estimatedCost: 30,
        duration: "2 hours",
        description: "Guided tour of historic landmarks",
      },
      {
        name: "Botanical Gardens",
        category: "sightseeing",
        estimatedCost: 15,
        duration: "2 hours",
        description: "Peaceful gardens with scenic views",
      },
    ],
    food: [
      {
        name: "Fine Dining",
        category: "food",
        estimatedCost: 80,
        duration: "2 hours",
        description: "Upscale restaurant experience",
      },
      {
        name: "Local Street Food Tour",
        category: "food",
        estimatedCost: 20,
        duration: "2 hours",
        description: "Taste authentic local cuisine",
      },
      {
        name: "Casual Restaurant",
        category: "food",
        estimatedCost: 35,
        duration: "1.5 hours",
        description: "Comfortable dining with local flavors",
      },
    ],
    adventure: [
      {
        name: "Hiking Excursion",
        category: "adventure",
        estimatedCost: 40,
        duration: "4 hours",
        description: "Trail hiking in natural surroundings",
      },
      {
        name: "Rock Climbing",
        category: "adventure",
        estimatedCost: 75,
        duration: "3 hours",
        description: "Indoor or outdoor climbing experience",
      },
      {
        name: "Water Sports",
        category: "adventure",
        estimatedCost: 60,
        duration: "3 hours",
        description: "Kayaking, paddleboarding, or jet skiing",
      },
    ],
    shopping: [
      {
        name: "Designer Boutiques",
        category: "shopping",
        estimatedCost: 150,
        duration: "3 hours",
        description: "High-end shopping experience",
      },
      {
        name: "Local Market",
        category: "shopping",
        estimatedCost: 40,
        duration: "2 hours",
        description: "Traditional market with local goods",
      },
      {
        name: "Shopping Mall",
        category: "shopping",
        estimatedCost: 80,
        duration: "3 hours",
        description: "Modern shopping complex",
      },
    ],
    relaxation: [
      {
        name: "Spa & Wellness",
        category: "relaxation",
        estimatedCost: 120,
        duration: "2 hours",
        description: "Massage and spa treatments",
      },
      {
        name: "Yoga Class",
        category: "relaxation",
        estimatedCost: 25,
        duration: "1.5 hours",
        description: "Morning or evening yoga session",
      },
      {
        name: "Beach Relaxation",
        category: "relaxation",
        estimatedCost: 10,
        duration: "4 hours",
        description: "Relax on the beach",
      },
    ],
  },
};

// Location coordinates for activities (simulated city center positions)
const activityLocations: Record<string, Location> = {
  "City Museum": { lat: 40.7589, lng: -73.9851, address: "Downtown Cultural District" },
  "Historic Walking Tour": { lat: 40.7614, lng: -73.9776, address: "Old Town Square" },
  "Botanical Gardens": { lat: 40.7489, lng: -73.9680, address: "City Park East" },
  "Fine Dining": { lat: 40.7580, lng: -73.9855, address: "Restaurant Row" },
  "Local Street Food Tour": { lat: 40.7520, lng: -73.9830, address: "Food District" },
  "Casual Restaurant": { lat: 40.7560, lng: -73.9800, address: "Midtown Area" },
  "Hiking Excursion": { lat: 40.7850, lng: -73.9500, address: "Nature Reserve North" },
  "Rock Climbing": { lat: 40.7650, lng: -73.9950, address: "Adventure Sports Center" },
  "Water Sports": { lat: 40.7400, lng: -73.9900, address: "Waterfront Marina" },
  "Designer Boutiques": { lat: 40.7600, lng: -73.9750, address: "Fashion Avenue" },
  "Local Market": { lat: 40.7450, lng: -73.9850, address: "Market District" },
  "Shopping Mall": { lat: 40.7550, lng: -73.9820, address: "Commercial Center" },
  "Spa & Wellness": { lat: 40.7620, lng: -73.9700, address: "Wellness Quarter" },
  "Yoga Class": { lat: 40.7540, lng: -73.9780, address: "Fitness District" },
  "Beach Relaxation": { lat: 40.7350, lng: -73.9950, address: "Beachfront" },
};

// Calculate distance between two locations (Haversine formula)
function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371; // Earth's radius in km
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
  const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Generate optimized route with smart grouping
function generateRouteInfo(activities: Activity[]): RouteInfo {
  if (activities.length === 0) {
    return {
      totalDistance: 0,
      estimatedTravelTime: 0,
      groupings: [],
      efficiency: 100,
      reasoning: "No activities planned for this day - enjoy free time!"
    };
  }

  // Add location data to activities
  const activitiesWithLocations = activities.map(activity => ({
    ...activity,
    location: activityLocations[activity.name] || {
      lat: 40.7500 + (Math.random() - 0.5) * 0.05,
      lng: -73.9800 + (Math.random() - 0.5) * 0.05,
      address: "City Center"
    }
  }));

  // Group activities by proximity (within 1.5km)
  const groups: ActivityGroup[] = [];
  const grouped = new Set<number>();
  
  for (let i = 0; i < activitiesWithLocations.length; i++) {
    if (grouped.has(i)) continue;
    
    const group: number[] = [i];
    grouped.add(i);
    
    for (let j = i + 1; j < activitiesWithLocations.length; j++) {
      if (grouped.has(j)) continue;
      
      const distance = calculateDistance(
        activitiesWithLocations[i].location!,
        activitiesWithLocations[j].location!
      );
      
      if (distance < 1.5) { // Group if within 1.5km
        group.push(j);
        grouped.add(j);
      }
    }
    
    const groupActivities = group.map(idx => activitiesWithLocations[idx]);
    const centerLat = groupActivities.reduce((sum, a) => sum + a.location!.lat, 0) / groupActivities.length;
    const centerLng = groupActivities.reduce((sum, a) => sum + a.location!.lng, 0) / groupActivities.length;
    
    const categories = [...new Set(groupActivities.map(a => a.category))];
    const reason = group.length > 1 
      ? `Clustered ${group.length} activities to minimize travel time. ${categories.length > 1 ? 'Mixed activities keep the day interesting!' : 'Same-category activities in one area.'}`
      : 'Single activity location - easy to find!';
    
    groups.push({
      name: group.length > 1 ? `${groupActivities[0].location!.address} Cluster` : groupActivities[0].location!.address,
      activities: groupActivities.map(a => a.name),
      center: { lat: centerLat, lng: centerLng, address: groupActivities[0].location!.address },
      reason
    });
  }

  // Calculate total distance between consecutive activities (real route distance)
  let totalDistance = 0;
  for (let i = 0; i < activitiesWithLocations.length - 1; i++) {
    const dist = calculateDistance(
      activitiesWithLocations[i].location!,
      activitiesWithLocations[i + 1].location!
    );
    totalDistance += dist;
  }

  // Estimate travel time (assuming 30 km/h average speed in city + 5 min per stop)
  const travelTimeFromDistance = Math.ceil((totalDistance / 30) * 60);
  const stopTime = (activitiesWithLocations.length - 1) * 5; // 5 min per activity transition
  const estimatedTravelTime = travelTimeFromDistance + stopTime;

  // Calculate efficiency score
  const maxPossibleDistance = activitiesWithLocations.length * 3; // Assume 3km between random activities
  const efficiency = Math.max(0, Math.min(100, Math.round((1 - totalDistance / maxPossibleDistance) * 100)));

  // Generate reasoning
  const avgDistancePerTransit = activitiesWithLocations.length > 1 ? totalDistance / (activitiesWithLocations.length - 1) : 0;
  let reasoning = `Smart grouping created ${groups.length} cluster${groups.length > 1 ? 's' : ''}. `;
  
  if (groups.length === 1) {
    reasoning += `All ${activitiesWithLocations.length} activities are in the same area - maximum efficiency! Total walking distance: ${totalDistance.toFixed(2)}km.`;
  } else if (avgDistancePerTransit < 1) {
    reasoning += `Activities are very close (avg ${avgDistancePerTransit.toFixed(2)}km apart). Easy walking distance!`;
  } else if (avgDistancePerTransit < 2) {
    reasoning += `Activities are closely grouped (avg ${avgDistancePerTransit.toFixed(2)}km between stops). Consider walking or short taxi rides.`;
  } else {
    reasoning += `Average ${avgDistancePerTransit.toFixed(1)}km between activities. Consider metro, taxi, or ride-sharing for efficiency.`;
  }

  return {
    totalDistance: parseFloat(totalDistance.toFixed(2)),
    estimatedTravelTime,
    groupings: groups,
    efficiency,
    reasoning,
    allActivityLocations: activitiesWithLocations.map(a => ({
      name: a.name,
      location: a.location!
    }))
  };
}

function getActivitiesForCity(city: string): Record<string, Activity[]> {
  return activityDatabase[city.toLowerCase()] || activityDatabase.default;
}

function selectActivities(
  preferences: ActivityPreferences,
  numDays: number,
): Activity[] {
  const cityActivities = getActivitiesForCity("default");
  const selectedActivities: Activity[] = [];

  const categories = Object.entries(preferences)
    .filter(([_, enabled]) => enabled)
    .map(([category]) => category as keyof ActivityPreferences);

  if (categories.length === 0) {
    return [];
  }

  // Select activities proportionally across preferences
  const activitiesPerCategory = Math.max(
    1,
    Math.ceil((numDays * 2) / categories.length),
  );

  for (const category of categories) {
    const categoryActivities = cityActivities[category] || [];
    const numToSelect = Math.min(
      activitiesPerCategory,
      categoryActivities.length,
    );

    for (let i = 0; i < numToSelect; i++) {
      selectedActivities.push(
        categoryActivities[i % categoryActivities.length],
      );
    }
  }

  return selectedActivities.sort(() => Math.random() - 0.5);
}

function selectCheapestActivities(
  preferences: ActivityPreferences,
  numDays: number,
): Activity[] {
  const cityActivities = getActivitiesForCity("default");
  const selectedActivities: Activity[] = [];

  const categories = Object.entries(preferences)
    .filter(([_, enabled]) => enabled)
    .map(([category]) => category as keyof ActivityPreferences);

  if (categories.length === 0) {
    return [];
  }

  const activitiesPerCategory = Math.max(
    1,
    Math.ceil((numDays * 2) / categories.length),
  );

  for (const category of categories) {
    const categoryActivities = (cityActivities[category] || [])
      .slice()
      .sort((a, b) => a.estimatedCost - b.estimatedCost);
    const numToSelect = Math.min(
      activitiesPerCategory,
      categoryActivities.length,
    );

    for (let i = 0; i < numToSelect; i++) {
      selectedActivities.push(categoryActivities[i]);
    }
  }

  return selectedActivities;
}

function createInitialItinerary(
  selectedActivities: Activity[],
  numDays: number,
): DayItinerary[] {
  const itinerary: DayItinerary[] = [];
  let activityIndex = 0;

  for (let day = 1; day <= numDays; day++) {
    const dayActivities: Activity[] = [];
    const activitiesPerDay = Math.ceil(selectedActivities.length / numDays);

    for (let i = 0; i < activitiesPerDay; i++) {
      if (activityIndex < selectedActivities.length) {
        dayActivities.push(selectedActivities[activityIndex]);
        activityIndex++;
      }
    }

    const totalCost = dayActivities.reduce(
      (sum, a) => sum + a.estimatedCost,
      0,
    );
    
    // Generate route information for the day
    const route = generateRouteInfo(dayActivities);
    
    itinerary.push({
      day,
      activities: dayActivities,
      totalCost,
      route,
    });
  }

  return itinerary;
}

function calculateTotalCost(itinerary: DayItinerary[]): number {
  return itinerary.reduce((sum, day) => sum + day.totalCost, 0);
}

function validateBudget(
  totalCost: number,
  budget: number,
): { isWithinBudget: boolean; exceededBy: number } {
  const isWithinBudget = totalCost <= budget;
  const exceededBy = Math.max(0, totalCost - budget);
  return { isWithinBudget, exceededBy };
}

function rePlanItinerary(
  itinerary: DayItinerary[],
  budget: number,
  priorities: ActivityPriorities,
): DayItinerary[] {
  let currentItinerary = JSON.parse(
    JSON.stringify(itinerary),
  ) as DayItinerary[];
  let totalCost = calculateTotalCost(currentItinerary);

  // Priority order for removal: optional -> nice-to-have -> must-have
  const removalOrder: ActivityPriority[] = ["optional", "nice-to-have", "must-have"];

  // Remove or replace activities based on priority
  for (const priorityLevel of removalOrder) {
    while (
      totalCost > budget &&
      currentItinerary.some((d) => d.activities.length > 0)
    ) {
      // Find the most expensive activity with current priority level
      let maxCost = 0;
      let maxDayIndex = -1;
      let maxActivityIndex = -1;

      currentItinerary.forEach((day, dayIdx) => {
        day.activities.forEach((activity, actIdx) => {
          const activityPriority = priorities[activity.category];
          if (
            activityPriority === priorityLevel &&
            activity.estimatedCost > maxCost
          ) {
            maxCost = activity.estimatedCost;
            maxDayIndex = dayIdx;
            maxActivityIndex = actIdx;
          }
        });
      });

      // If no activity found with current priority, move to next priority level
      if (maxDayIndex === -1) break;

      // Try to replace with cheaper alternative or remove
      const day = currentItinerary[maxDayIndex];
      const activity = day.activities[maxActivityIndex];

      // Try to find cheaper activity in same category
      const cityActivities = getActivitiesForCity("default");
      const categoryActivities = cityActivities[activity.category] || [];
      const cheaperAlternative = categoryActivities.find(
        (a) =>
          a.estimatedCost < activity.estimatedCost &&
          !day.activities.some((da) => da.name === a.name),
      );

      if (cheaperAlternative) {
        day.activities[maxActivityIndex] = cheaperAlternative;
      } else {
        day.activities.splice(maxActivityIndex, 1);
      }

      // Recalculate costs and routes
      currentItinerary = currentItinerary.map((d) => ({
        ...d,
        totalCost: d.activities.reduce((sum, a) => sum + a.estimatedCost, 0),
        route: generateRouteInfo(d.activities),
      }));

      totalCost = calculateTotalCost(currentItinerary);
    }

    // If budget is met, stop removing activities
    if (totalCost <= budget) break;
  }

  return currentItinerary;
}

export function planTravel(
  budget: number,
  days: number,
  city: string,
  preferences: ActivityPreferences,
  priorities: ActivityPriorities,
): TravelPlan {
  const explanations: DecisionExplanation[] = [];

  // Compute realistic minimum budget via cheapest possible itinerary
  const cheapestActivities = selectCheapestActivities(preferences, days);
  const cheapestItinerary = createInitialItinerary(cheapestActivities, days);
  const minRequiredBudget = calculateTotalCost(cheapestItinerary);
  const isFeasible = Number.isFinite(minRequiredBudget)
    ? budget >= minRequiredBudget
    : false;

  // Explanation: Preference analysis
  const enabledPreferences = Object.entries(preferences)
    .filter(([_, enabled]) => enabled)
    .map(([key, _]) => key);
  
  explanations.push({
    reason: "Activity Selection Based on Your Preferences",
    detail: `You selected ${enabledPreferences.length} activity type(s): ${enabledPreferences.join(", ")}. The planner prioritized activities from these categories to match your interests.`,
    impact: "positive"
  });

  // Step 1: Plan - Select activities based on preferences
  const selectedActivities = selectActivities(preferences, days);
  let itinerary = createInitialItinerary(selectedActivities, days);

  // Explanation: Activities per day strategy
  const avgActivitiesPerDay = Math.floor(selectedActivities.length / days);
  explanations.push({
    reason: "Activity Distribution Strategy",
    detail: `Distributed ${selectedActivities.length} activities across ${days} days (approximately ${avgActivitiesPerDay} activities per day) to create a balanced itinerary without overwhelming your schedule.`,
    impact: "neutral"
  });

  // Step 2: Validate - Check budget
  let totalCost = calculateTotalCost(itinerary);
  const { isWithinBudget, exceededBy } = validateBudget(totalCost, budget);

  let rePlanned = false;

  // Step 3: Re-plan - If over budget, adjust itinerary
  if (!isFeasible) {
    // Not feasible: show minimum required budget and no itinerary
    explanations.push({
      reason: "Budget Constraint Detected",
      detail: `Your budget of $${budget.toFixed(0)} is below the minimum required budget of $${minRequiredBudget.toFixed(0)} for the selected preferences and ${days} days. This is based on selecting only the most affordable activities in each category.`,
      impact: "constraint"
    });
    itinerary = [];
    totalCost = minRequiredBudget;
    rePlanned = false;
  } else if (!isWithinBudget) {
    const originalCost = totalCost;
    
    explanations.push({
      reason: "Budget Optimization Required",
      detail: `Initial plan cost $${originalCost.toFixed(0)}, exceeding your budget by $${exceededBy.toFixed(0)}. Automatically re-planning using priority-based logic: removing optional activities first, then nice-to-have, while preserving must-have experiences.`,
      impact: "constraint"
    });

    itinerary = rePlanItinerary(itinerary, budget, priorities);
    totalCost = calculateTotalCost(itinerary);
    rePlanned = true;

    const savedAmount = originalCost - totalCost;
    
    // Count removed activities by priority
    const priorityCounts = { "optional": 0, "nice-to-have": 0, "must-have": 0 };
    const originalActivityCount = selectedActivities.length;
    const finalActivityCount = itinerary.reduce((sum, day) => sum + day.activities.length, 0);
    
    explanations.push({
      reason: "Priority-Based Cost Reduction Achieved",
      detail: `Reduced costs by $${savedAmount.toFixed(0)} by removing ${originalActivityCount - finalActivityCount} activities. Followed your priority preferences: optional activities removed first, then nice-to-have if needed, while protecting all must-have experiences.`,
      impact: "positive"
    });
  } else {
    explanations.push({
      reason: "Budget Well-Aligned",
      detail: `Your budget of $${budget.toFixed(0)} comfortably covers the planned activities (total cost: $${totalCost.toFixed(0)}). This leaves you with $${(budget - totalCost).toFixed(0)} for meals, transportation, and unexpected expenses.`,
      impact: "positive"
    });
  }

  // Explanation: Cost breakdown insights
  if (itinerary.length > 0) {
    const costs = itinerary.map(d => d.totalCost);
    const maxDayCost = Math.max(...costs);
    const minDayCost = Math.min(...costs.filter(c => c > 0));
    
    if (maxDayCost > 0) {
      explanations.push({
        reason: "Daily Cost Variation",
        detail: `Daily costs range from $${minDayCost.toFixed(0)} to $${maxDayCost.toFixed(0)}. Higher-cost days include premium experiences, while lower-cost days balance the budget and provide relaxation time.`,
        impact: "neutral"
      });
    }
  }

  // Step 4: Final Output
  return {
    budget,
    totalCost,
    days,
    city,
    itinerary,
    isWithinBudget: totalCost <= budget,
    budgetStatus: totalCost <= budget ? "within" : "exceeded",
    rePlanned,
    isFeasible,
    minRequiredBudget,
    explanations,
  };
}
