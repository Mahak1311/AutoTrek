import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteInfo } from "@/lib/travel-planner";
import { MapPin, Navigation, Clock, TrendingUp, Zap } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from "react-leaflet";

interface RouteMapProps {
  dayNumber: number;
  route: RouteInfo;
  language: string;
  city?: string;
  onExpand?: () => void;
  size?: "md" | "lg";
}

export function RouteMap({ dayNumber, route, language, city, onExpand, size = "md" }: RouteMapProps) {
  if (route.groupings.length === 0) {
    return null;
  }

  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);

  const positions = React.useMemo(() => {
    return route.groupings.map((g) => [g.center.lat, g.center.lng] as [number, number]);
  }, [route.groupings]);

  // Get all individual activity positions for complete route
  const allActivityPositions = React.useMemo(() => {
    if (route.allActivityLocations) {
      return route.allActivityLocations.map((a) => [a.location.lat, a.location.lng] as [number, number]);
    }
    return positions;
  }, [route.allActivityLocations, positions]);

  function FitBounds({ points }: { points: [number, number][] }) {
    const map = useMap();
    React.useEffect(() => {
      if (points.length) {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      }
    }, [points, map]);
    return null;
  }

  // Colors for groups
  const colors = [
    "#06b6d4", // cyan
    "#8b5cf6", // purple
    "#f59e0b", // amber
    "#10b981", // green
    "#ec4899", // pink
  ];

  const containerHeight = size === "lg" ? "h-[70vh]" : "h-[60vh]";

  return (
    <Card className="bg-white/90 border border-slate-200 mt-4 overflow-hidden transition-all duration-300 hover:shadow-2xl animate-fade-in-up">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <Navigation className="h-5 w-5 text-cyan-600" />
            Day {dayNumber} Route Map
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-cyan-700">
              <TrendingUp className="h-4 w-4" />
              <span className="font-bold">{route.efficiency}%</span>
              <span className="text-xs text-slate-500">efficient</span>
            </div>
            {onExpand && (
              <button
                onClick={onExpand}
                className="text-xs px-3 py-1 rounded-full bg-cyan-600 text-white hover:bg-cyan-700 transition-colors"
              >
                Open Full Map
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Visualization */}
        <div className={`relative rounded-xl border border-slate-200 overflow-hidden ${containerHeight}`}>
          <MapContainer className="w-full h-full" center={positions[0]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds points={allActivityPositions} />
            {/* Route line connecting all activities */}
            {allActivityPositions.length > 1 && (
              <Polyline positions={allActivityPositions} pathOptions={{ color: "#0ea5e9", weight: 4, opacity: 0.7 }} />
            )}
            {/* Cluster markers */}
            {route.groupings.map((group, idx) => (
              <CircleMarker
                key={idx}
                center={[group.center.lat, group.center.lng]}
                radius={10}
                pathOptions={{ color: "white", fillColor: colors[idx % colors.length], fillOpacity: 0.9, weight: 2 }}
                eventHandlers={{ click: () => setSelectedIdx(idx) }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                  <div className="text-xs font-semibold text-slate-800">
                    {idx + 1}. {group.name}
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Route Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-slate-200 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <Navigation className="h-4 w-4" />
              <span>{selectedIdx && selectedIdx > 0 ? "Segment Distance" : "Total Distance"}</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {(selectedIdx && selectedIdx > 0
                ? (() => {
                    const prev = route.groupings[selectedIdx - 1].center;
                    const curr = route.groupings[selectedIdx].center;
                    const d = haversine(prev.lat, prev.lng, curr.lat, curr.lng);
                    return d.toFixed(2);
                  })()
                : route.totalDistance.toFixed(2))} <span className="text-sm text-slate-500">km</span>
            </div>
            {!selectedIdx && route.allActivityLocations && (
              <p className="text-xs text-slate-500 mt-1">Between {route.allActivityLocations.length} activities</p>
            )}
          </div>
          <div className="bg-white rounded-lg p-3 border border-slate-200 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <Clock className="h-4 w-4" />
              <span>{selectedIdx && selectedIdx > 0 ? "Segment Time" : "Travel Time"}</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {(selectedIdx && selectedIdx > 0
                ? (() => {
                    const prev = route.groupings[selectedIdx - 1].center;
                    const curr = route.groupings[selectedIdx].center;
                    const d = haversine(prev.lat, prev.lng, curr.lat, curr.lng);
                    const minutes = Math.ceil((d / 30) * 60) + 5;
                    return minutes;
                  })()
                : route.estimatedTravelTime)} <span className="text-sm text-slate-500">min</span>
            </div>
            {!selectedIdx && (
              <p className="text-xs text-slate-500 mt-1">Includes stops & transitions</p>
            )}
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg p-4 border border-cyan-200">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-slate-900 font-semibold mb-1 text-sm">Agent's Routing Strategy</h4>
              <p className="text-slate-700 text-sm leading-relaxed">{route.reasoning}</p>
            </div>
          </div>
        </div>

        {/* Activity Groupings */}
        <div className="space-y-2">
          <h4 className="text-slate-900 font-semibold text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4 text-cyan-600" />
            Activity Clusters ({route.groupings.length})
          </h4>
          {route.groupings.map((group, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-3 border border-slate-200 transition-all duration-300 hover:shadow-md animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: colors[idx % colors.length] }}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-slate-900 font-semibold text-sm mb-1">{group.name}</h5>
                  <p className="text-slate-600 text-xs mb-2">{group.reason}</p>
                  <div className="flex flex-wrap gap-1">
                    {group.activities.map((activity, actIdx) => (
                      <span
                        key={actIdx}
                        className="inline-flex items-center px-2 py-1 bg-cyan-50 text-cyan-700 text-xs rounded-full border border-cyan-200"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Local distance helper for segment stats
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
