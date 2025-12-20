import { TravelPlan, DayItinerary } from "@/lib/travel-planner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  DollarSign,
  Calendar,
  Sparkles,
  CheckCircle,
} from "lucide-react";

interface DemoResultsProps {
  onPlanAnother: () => void;
}

export function DemoResults({ onPlanAnother }: DemoResultsProps) {
  // Sample demo data
  const demoTravelPlan: TravelPlan = {
    budget: 2500,
    totalCost: 2380,
    days: 5,
    city: "Barcelona",
    itinerary: [
      {
        day: 1,
        activities: [
          {
            name: "Historic Walking Tour",
            category: "sightseeing",
            estimatedCost: 30,
            duration: "2 hours",
            description: "Guided tour of historic landmarks",
          },
          {
            name: "Local Street Food Tour",
            category: "food",
            estimatedCost: 20,
            duration: "2 hours",
            description: "Taste authentic local cuisine",
          },
          {
            name: "Beach Relaxation",
            category: "relaxation",
            estimatedCost: 10,
            duration: "4 hours",
            description: "Relax on the beach",
          },
        ],
        totalCost: 60,
      },
      {
        day: 2,
        activities: [
          {
            name: "City Museum",
            category: "sightseeing",
            estimatedCost: 25,
            duration: "3 hours",
            description: "Explore history and art collections",
          },
          {
            name: "Casual Restaurant",
            category: "food",
            estimatedCost: 35,
            duration: "1.5 hours",
            description: "Comfortable dining with local flavors",
          },
          {
            name: "Yoga Class",
            category: "relaxation",
            estimatedCost: 25,
            duration: "1.5 hours",
            description: "Morning or evening yoga session",
          },
        ],
        totalCost: 85,
      },
      {
        day: 3,
        activities: [
          {
            name: "Botanical Gardens",
            category: "sightseeing",
            estimatedCost: 15,
            duration: "2 hours",
            description: "Peaceful gardens with scenic views",
          },
          {
            name: "Local Market",
            category: "shopping",
            estimatedCost: 40,
            duration: "2 hours",
            description: "Traditional market with local goods",
          },
          {
            name: "Fine Dining",
            category: "food",
            estimatedCost: 80,
            duration: "2 hours",
            description: "Upscale restaurant experience",
          },
        ],
        totalCost: 135,
      },
      {
        day: 4,
        activities: [
          {
            name: "Water Sports",
            category: "adventure",
            estimatedCost: 60,
            duration: "3 hours",
            description: "Kayaking, paddleboarding, or jet skiing",
          },
          {
            name: "Local Street Food Tour",
            category: "food",
            estimatedCost: 20,
            duration: "2 hours",
            description: "Taste authentic local cuisine",
          },
          {
            name: "Spa & Wellness",
            category: "relaxation",
            estimatedCost: 120,
            duration: "2 hours",
            description: "Massage and spa treatments",
          },
        ],
        totalCost: 200,
      },
      {
        day: 5,
        activities: [
          {
            name: "Shopping Mall",
            category: "shopping",
            estimatedCost: 80,
            duration: "3 hours",
            description: "Modern shopping complex",
          },
          {
            name: "Casual Restaurant",
            category: "food",
            estimatedCost: 35,
            duration: "1.5 hours",
            description: "Comfortable dining with local flavors",
          },
          {
            name: "Beach Relaxation",
            category: "relaxation",
            estimatedCost: 10,
            duration: "4 hours",
            description: "Relax on the beach",
          },
        ],
        totalCost: 125,
      },
    ],
    isWithinBudget: true,
    budgetStatus: "within",
    rePlanned: false,
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Budget Status Card */}
      <Card
        className={`border-2 backdrop-blur-xl ${
          demoTravelPlan.isWithinBudget
            ? "bg-green-500/10 border-green-500/30"
            : "bg-orange-500/10 border-orange-500/30"
        }`}
      >
        <CardContent className="pt-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                {demoTravelPlan.isWithinBudget && (
                  <CheckCircle className="h-6 w-6 text-green-400" />
                )}
                <h3 className="text-xl font-bold text-white">
                  ✨ Great! Within Budget
                </h3>
              </div>
              <p className="text-purple-200">
                Your total trip cost of ${demoTravelPlan.totalCost.toFixed(0)}{" "}
                is within your ${demoTravelPlan.budget.toFixed(0)} budget with $
                {(demoTravelPlan.budget - demoTravelPlan.totalCost).toFixed(0)}{" "}
                to spare!
              </p>
            </div>
            <div className="text-right space-y-1">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ${demoTravelPlan.totalCost.toFixed(0)}
              </div>
              <p className="text-sm text-purple-300">Total Cost</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 border-white/20">
          <CardContent className="pt-6 text-center">
            <MapPin className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-sm text-purple-200">Destination</p>
            <p className="text-lg font-bold text-white">
              {demoTravelPlan.city}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="pt-6 text-center">
            <Calendar className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-sm text-purple-200">Duration</p>
            <p className="text-lg font-bold text-white">
              {demoTravelPlan.days} Days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="pt-6 text-center">
            <DollarSign className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-sm text-purple-200">Budget</p>
            <p className="text-lg font-bold text-white">
              ${demoTravelPlan.budget.toFixed(0)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="pt-6 text-center">
            <Sparkles className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-sm text-purple-200">Per Day</p>
            <p className="text-lg font-bold text-white">
              ${(demoTravelPlan.totalCost / demoTravelPlan.days).toFixed(0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Itinerary */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-6">
          Your Day-by-Day Itinerary
        </h2>
        <div className="space-y-4">
          {demoTravelPlan.itinerary.map((day) => (
            <DayCard key={day.day} day={day} />
          ))}
        </div>
      </div>

      {/* Cost Breakdown */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-cyan-400" />
            Cost Breakdown by Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {demoTravelPlan.itinerary.map((day) => (
              <div
                key={day.day}
                className="flex justify-between items-center py-2 border-b border-white/10 last:border-0"
              >
                <span className="text-white font-medium">Day {day.day}</span>
                <div className="flex items-center gap-4">
                  <div className="w-40 bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (day.totalCost /
                            Math.max(
                              ...demoTravelPlan.itinerary.map(
                                (d) => d.totalCost,
                              ),
                            )) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-cyan-400 font-bold w-20 text-right">
                    ${day.totalCost.toFixed(0)}
                  </span>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center py-3 border-t-2 border-cyan-500/30 mt-3 font-bold">
              <span className="text-white">Total</span>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-xl">
                ${demoTravelPlan.totalCost.toFixed(0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center pt-4">
        <Button
          onClick={onPlanAnother}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-lg"
        >
          Plan Another Trip
        </Button>
        <Button
          variant="outline"
          className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3"
        >
          Save Itinerary
        </Button>
      </div>
    </div>
  );
}

function DayCard({ day }: { day: DayItinerary }) {
  return (
    <Card className="bg-white/10 border-white/20 hover:border-white/40 transition-all duration-200 overflow-hidden group">
      <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">
            Day {day.day}
            {day.activities.length === 0 && (
              <span className="ml-2 text-sm font-normal text-purple-300">
                (Flexible day)
              </span>
            )}
          </CardTitle>
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            ${day.totalCost.toFixed(0)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {day.activities.length > 0 ? (
          <div className="space-y-3">
            {day.activities.map((activity, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-white">
                      {activity.name}
                    </h4>
                    <p className="text-sm text-purple-300">
                      {activity.category.charAt(0).toUpperCase() +
                        activity.category.slice(1)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-cyan-400">
                      ${activity.estimatedCost}
                    </p>
                    <p className="text-xs text-purple-300">
                      {activity.duration}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-purple-200">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-purple-300 italic text-center py-4">
            Free day to explore on your own
          </p>
        )}
      </CardContent>
    </Card>
  );
}
