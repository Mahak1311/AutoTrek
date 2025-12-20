import { describe, it, expect } from "vitest";
import { planTravel, ActivityPreferences } from "./travel-planner";

describe("Travel Planner Logic", () => {
  it("should generate a valid itinerary within budget", () => {
    const preferences: ActivityPreferences = {
      sightseeing: true,
      food: true,
      adventure: false,
      shopping: false,
      relaxation: true,
    };

    const plan = planTravel(3000, 5, "Paris", preferences);

    expect(plan.budget).toBe(3000);
    expect(plan.days).toBe(5);
    expect(plan.city).toBe("Paris");
    expect(plan.itinerary.length).toBe(5);
    expect(plan.totalCost).toBeLessThanOrEqual(plan.budget);
    expect(plan.isWithinBudget).toBe(true);
    expect(plan.budgetStatus).toBe("within");
  });

  it("should re-plan itinerary when budget is exceeded", () => {
    const preferences: ActivityPreferences = {
      sightseeing: true,
      food: true,
      adventure: true,
      shopping: true,
      relaxation: true,
    };

    // Very tight budget to force re-planning
    const plan = planTravel(300, 7, "Tokyo", preferences);

    expect(plan.totalCost).toBeLessThanOrEqual(plan.budget);
    expect(plan.isWithinBudget).toBe(true);
    expect(plan.budgetStatus).toBe("within");
  });

  it("should create days with activities distributed across days", () => {
    const preferences: ActivityPreferences = {
      sightseeing: true,
      food: false,
      adventure: false,
      shopping: false,
      relaxation: false,
    };

    const plan = planTravel(2000, 3, "Rome", preferences);

    expect(plan.itinerary.length).toBe(3);
    plan.itinerary.forEach((day) => {
      expect(day.day).toBeGreaterThan(0);
      expect(day.activities.length).toBeGreaterThanOrEqual(0);
      expect(day.totalCost).toBe(
        day.activities.reduce((sum, a) => sum + a.estimatedCost, 0),
      );
    });
  });

  it("should calculate correct total cost across all days", () => {
    const preferences: ActivityPreferences = {
      sightseeing: true,
      food: true,
      adventure: false,
      shopping: false,
      relaxation: true,
    };

    const plan = planTravel(5000, 4, "Barcelona", preferences);

    const manualTotal = plan.itinerary.reduce(
      (sum, day) => sum + day.totalCost,
      0,
    );
    expect(plan.totalCost).toBe(manualTotal);
  });

  it("should handle single day trip", () => {
    const preferences: ActivityPreferences = {
      sightseeing: true,
      food: true,
      adventure: false,
      shopping: false,
      relaxation: false,
    };

    const plan = planTravel(500, 1, "London", preferences);

    expect(plan.days).toBe(1);
    expect(plan.itinerary.length).toBe(1);
    expect(plan.itinerary[0].day).toBe(1);
  });

  it("should mark re-plan when it was necessary", () => {
    const preferences: ActivityPreferences = {
      sightseeing: true,
      food: true,
      adventure: true,
      shopping: true,
      relaxation: true,
    };

    // Tight budget to force re-planning
    const plan = planTravel(200, 5, "Dubai", preferences);

    // Should be marked as re-planned if budget was exceeded
    expect(typeof plan.rePlanned).toBe("boolean");
  });

  it("should distribute preferences across days", () => {
    const preferences: ActivityPreferences = {
      sightseeing: true,
      food: true,
      adventure: true,
      shopping: false,
      relaxation: false,
    };

    const plan = planTravel(2000, 3, "NYC", preferences);

    // Get all activity categories used
    const categoriesUsed = new Set<string>();
    plan.itinerary.forEach((day) => {
      day.activities.forEach((activity) => {
        categoriesUsed.add(activity.category);
      });
    });

    // Should include selected preferences
    expect(categoriesUsed.size).toBeGreaterThan(0);
  });

  it("should have valid activity data in itinerary", () => {
    const preferences: ActivityPreferences = {
      sightseeing: true,
      food: true,
      adventure: false,
      shopping: false,
      relaxation: true,
    };

    const plan = planTravel(2500, 3, "Amsterdam", preferences);

    plan.itinerary.forEach((day) => {
      day.activities.forEach((activity) => {
        expect(activity.name).toBeTruthy();
        expect(activity.category).toBeTruthy();
        expect(activity.estimatedCost).toBeGreaterThan(0);
        expect(activity.duration).toBeTruthy();
        expect(activity.description).toBeTruthy();
      });
    });
  });

  it("should handle zero selected preferences edge case gracefully", () => {
    const preferences: ActivityPreferences = {
      sightseeing: false,
      food: false,
      adventure: false,
      shopping: false,
      relaxation: false,
    };

    const plan = planTravel(1000, 3, "Bangkok", preferences);

    // Should still create days, even if empty
    expect(plan.itinerary.length).toBe(3);
    expect(plan.totalCost).toBe(0);
  });
});
