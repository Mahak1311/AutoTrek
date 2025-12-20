import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { t } from "@/lib/translations";
import {
  planTravel,
  ActivityPreferences,
  ActivityPriorities,
  TravelPlan,
  Activity,
  DayItinerary,
  DecisionExplanation,
} from "@/lib/travel-planner";
import { RouteMap } from "@/components/RouteMap";
import { BookingManager } from "@/components/BookingManager";
import { AIAssistant } from "@/components/AIAssistant";
import { 
  Booking, 
  saveBookingsToStorage, 
  loadBookingsFromStorage, 
  deleteBooking as deleteBookingFromStorage 
} from "@/lib/bookings";
import {
  Plane,
  MapPin,
  DollarSign,
  Calendar,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Globe,
  Lightbulb,
  TrendingUp,
  Info,
  User,
  LogOut,
  LogIn,
} from "lucide-react";

// Currency exchange rates (USD = 1)
const CURRENCY_RATES: Record<string, { symbol: string; rate: number }> = {
  USD: { symbol: "$", rate: 1 },
  EUR: { symbol: "€", rate: 0.95 },
  GBP: { symbol: "£", rate: 0.82 },
  INR: { symbol: "₹", rate: 83.5 },
  JPY: { symbol: "¥", rate: 152 },
  AUD: { symbol: "A$", rate: 1.55 },
  CAD: { symbol: "C$", rate: 1.38 },
  CHF: { symbol: "CHF", rate: 0.91 },
  SGD: { symbol: "S$", rate: 1.35 },
  HKD: { symbol: "HK$", rate: 7.8 },
  MXN: { symbol: "Mex$", rate: 17.2 },
  BRL: { symbol: "R$", rate: 5.2 },
  ZAR: { symbol: "R", rate: 17.5 },
  AED: { symbol: "د.إ", rate: 3.67 },
};

export default function Index() {
  const [step, setStep] = useState<"form" | "planning" | "results" | "saved" | "bookings">("form");
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [savedItineraries, setSavedItineraries] = useState<(TravelPlan & { id: string; savedAt: string })[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [language, setLanguage] = useState("en");
  const [viewMode, setViewMode] = useState<"itinerary" | "map">("itinerary");
  const [expandedMapDay, setExpandedMapDay] = useState<number | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Authentication state
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    budget: "",
    days: "",
    city: "",
  });

  const [preferences, setPreferences] = useState<ActivityPreferences>({
    sightseeing: true,
    food: true,
    adventure: false,
    shopping: false,
    relaxation: true,
  });

  const [priorities, setPriorities] = useState<ActivityPriorities>({
    sightseeing: "must-have",
    food: "nice-to-have",
    adventure: "optional",
    shopping: "optional",
    relaxation: "nice-to-have",
  });

  // Load bookings from localStorage on mount
  useEffect(() => {
    const loadedBookings = loadBookingsFromStorage();
    setBookings(loadedBookings);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (
    key: keyof ActivityPreferences,
    checked: boolean,
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: checked }));
  };

  const handlePriorityChange = (
    key: keyof ActivityPriorities,
    priority: "must-have" | "nice-to-have" | "optional",
  ) => {
    setPriorities((prev) => ({ ...prev, [key]: priority }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user) {
      alert("Please login to generate your travel itinerary");
      setShowAuthDialog(true);
      return;
    }

    const budget = parseFloat(formData.budget);
    const days = parseInt(formData.days);

    if (!budget || !days || !formData.city) {
      alert(t("alerts.fillAllFields", language));
      return;
    }

    if (!Object.values(preferences).some((v) => v)) {
      alert(t("alerts.selectPreference", language));
      return;
    }

    setStep("planning");
    setIsPlanning(true);

    // Simulate planning process with delays for visual effect
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Convert entered budget (in selected currency) to USD for planning
    const toUSD = (amt: number) => {
      const info = CURRENCY_RATES[selectedCurrency];
      return info ? amt / info.rate : amt;
    };

    const plan = planTravel(toUSD(budget), days, formData.city, preferences, priorities);

    setTravelPlan(plan);
    setIsPlanning(false);
    setStep("results");
  };

  const handleReplan = () => {
    setStep("form");
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === "login") {
      // Mock login - in production, this would call an API
      if (authForm.email && authForm.password) {
        const userData = {
          name: authForm.email.split("@")[0],
          email: authForm.email,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setShowAuthDialog(false);
        setAuthForm({ name: "", email: "", password: "" });
      }
    } else {
      // Mock signup
      if (authForm.name && authForm.email && authForm.password) {
        const userData = {
          name: authForm.name,
          email: authForm.email,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setShowAuthDialog(false);
        setAuthForm({ name: "", email: "", password: "" });
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Load user from localStorage on mount
  useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  });

  const handleSave = () => {
    if (!user) {
      alert("Please login to save your itinerary");
      setShowAuthDialog(true);
      return;
    }
    
    if (travelPlan) {
      const savedPlan = {
        ...travelPlan,
        id: Date.now().toString(),
        savedAt: new Date().toLocaleString(),
      };
      setSavedItineraries((prev) => [savedPlan, ...prev]);
      alert("Itinerary saved successfully!");
    }
  };

  const handleViewSaved = () => {
    if (!user) {
      alert("Please login to view saved itineraries");
      setShowAuthDialog(true);
      return;
    }
    setStep("saved");
  };

  const handleDeleteSaved = (id: string) => {
    setSavedItineraries((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLoadSaved = (plan: TravelPlan & { id: string; savedAt: string }) => {
    setTravelPlan(plan);
    setStep("results");
  };

  const handleViewBookings = () => {
    if (!user) {
      alert("Please login to manage bookings");
      setShowAuthDialog(true);
      return;
    }
    setStep("bookings");
  };

  const handleAddBooking = (booking: Booking) => {
    const updatedBookings = [...bookings, booking];
    setBookings(updatedBookings);
    saveBookingsToStorage(updatedBookings);
  };

  const handleDeleteBooking = (bookingId: string) => {
    const updatedBookings = bookings.filter(b => b.id !== bookingId);
    setBookings(updatedBookings);
    saveBookingsToStorage(updatedBookings);
  };

  const convertCurrency = (amount: number): string => {
    const currencyInfo = CURRENCY_RATES[selectedCurrency];
    if (!currencyInfo) return `$${amount.toFixed(0)}`;
    const convertedAmount = (amount * currencyInfo.rate).toFixed(0);
    return `${currencyInfo.symbol}${convertedAmount}`;
  };

  return (
    <div className="min-h-screen" style={{
      backgroundImage: "url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80)",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundAttachment: "fixed"
    }}>
      {/* Header */}
      <header className="border-b border-white/10 bg-black backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur opacity-75 animate-pulse" />
                <div className="relative bg-black px-3 py-2 rounded-lg">
                  <Plane className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {t("app.title", language)}
                </h1>
                <p className="text-sm text-purple-200">
                  {t("app.subtitle", language)}
                </p>
              </div>
            </div>
            
            {/* Language & Currency Selectors */}
            <div className="flex items-center gap-3">
              {/* Auth Section */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <User className="h-4 w-4 mr-2" />
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black border-white/20">
                    <DropdownMenuLabel className="text-white">{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuItem onClick={handleLogout} className="text-white hover:bg-white/10 cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black border-white/20">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        {authMode === "login" ? "Welcome Back" : "Create Account"}
                      </DialogTitle>
                      <DialogDescription className="text-purple-200">
                        {authMode === "login" 
                          ? "Login to save your itineraries and access them anywhere" 
                          : "Sign up to start planning your perfect trips"}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                      {authMode === "signup" && (
                        <div className="space-y-2">
                          <Label htmlFor="auth-name" className="text-white">Name</Label>
                          <Input
                            id="auth-name"
                            type="text"
                            placeholder="Your name"
                            value={authForm.name}
                            onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            required={authMode === "signup"}
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="auth-email" className="text-white">Email</Label>
                        <Input
                          id="auth-email"
                          type="email"
                          placeholder="you@example.com"
                          value={authForm.email}
                          onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="auth-password" className="text-white">Password</Label>
                        <Input
                          id="auth-password"
                          type="password"
                          placeholder="••••••••"
                          value={authForm.password}
                          onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                      >
                        {authMode === "login" ? "Login" : "Sign Up"}
                      </Button>
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                          className="text-sm text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:scale-105"
                        >
                          {authMode === "login" 
                            ? "Don't have an account? Sign up" 
                            : "Already have an account? Login"}
                        </button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
              
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:shadow-lg">
                <span className="text-white text-xs font-semibold">🌐</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="en" className="bg-black text-white">English</option>
                  <option value="hi" className="bg-black text-white">हिंदी</option>
                  <option value="es" className="bg-black text-white">Español</option>
                  <option value="fr" className="bg-black text-white">Français</option>
                  <option value="de" className="bg-black text-white">Deutsch</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-4 py-2 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:shadow-lg">
                <Globe className="h-4 w-4 text-cyan-400" />
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer"
                >
                  {Object.keys(CURRENCY_RATES).map((curr) => (
                    <option key={curr} value={curr} className="bg-black text-white">
                      {curr} - {CURRENCY_RATES[curr].symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        style={{
          backgroundImage:
            "url(https://cdn.builder.io/api/v1/image/assets%2Ffd599a0b29454ae8acda0ea7bf4b2ee9%2F9218f6fc21fc45d6b932edf6a5cc87e6)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        {step === "form" && (
          <div className="max-w-2xl mx-auto animate-slide-up">
            <div className="text-center mb-8 animate-fade-in">
              <h2 className="text-4xl font-bold text-white mb-3 animate-slide-down">
                {t("form.title", language)}
              </h2>
              <p className="text-lg text-white animate-fade-in-delay">
                {t("form.subtitle", language)}
                that fits your budget
              </p>
              
              {/* Login Required Notice */}
              {!user && (
                <div className="mt-4 p-4 bg-orange-500/20 border-2 border-orange-500/50 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-2 text-orange-100">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm font-bold">
                      🔒 Login required to generate and save travel itineraries
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Card className="bg-white/10 border-white/20 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] animate-fade-in-up">
              <CardContent
                className="pt-8"
                style={{
                  backgroundColor: "rgba(209, 201, 201, 1)",
                  color: "rgba(0, 0, 0, 1)",
                }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Budget Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="budget"
                      className="text-white font-semibold flex items-center gap-2"
                    >
                      <DollarSign className="h-4 w-4 text-cyan-400" />
                      <div style={{ color: "rgba(0, 0, 0, 1)" }}>
                        {t("form.budget", language)}
                      </div>
                    </Label>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      placeholder="e.g., 3000"
                      value={formData.budget}
                      onChange={handleInputChange}
                      min="100"
                      className="bg-white/20 border-white/30 placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all duration-300 focus:scale-105"
                      style={{ color: "rgba(0, 0, 0, 1)" }}
                    />
                    <p
                      className="text-xs"
                      style={{ color: "rgba(0, 0, 0, 1)" }}
                    >
                      {t("form.budgetHint", language)} {selectedCurrency}
                    </p>
                  </div>

                  {/* Days Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="days"
                      className="text-white font-semibold flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4 text-cyan-400" />
                      <div style={{ color: "rgba(0, 0, 0, 1)" }}>
                        {t("form.days", language)}
                      </div>
                    </Label>
                    <Input
                      id="days"
                      name="days"
                      type="number"
                      placeholder="e.g., 5"
                      value={formData.days}
                      onChange={handleInputChange}
                      min="1"
                      max="30"
                      className="bg-white/20 border-white/30 placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all duration-300 focus:scale-105"
                      style={{ color: "rgba(0, 0, 0, 1)" }}
                    />
                    <p
                      className="text-xs"
                      style={{ color: "rgba(0, 0, 0, 1)" }}
                    >
                      {t("form.daysHint", language)}
                    </p>
                  </div>

                  {/* City Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="city"
                      className="text-white font-semibold flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4 text-cyan-400" />
                      <div style={{ color: "rgba(0, 0, 0, 1)" }}>
                        {t("form.city", language)}
                      </div>
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      placeholder={t("form.cityPlaceholder", language)}
                      value={formData.city}
                      onChange={handleInputChange}
                      className="bg-white/20 border-white/30 placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all duration-300 focus:scale-105"
                      style={{ color: "rgba(0, 0, 0, 1)" }}
                    />
                    <p
                      className="text-xs"
                      style={{ color: "rgba(0, 0, 0, 1)" }}
                    >
                      {t("form.cityHint", language)}
                    </p>
                  </div>

                  {/* Activity Preferences */}
                  <div
                    className="space-y-4"
                    style={{ color: "rgba(0, 0, 0, 1)" }}
                  >
                    <Label className="text-white font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-cyan-400" />
                      <div style={{ color: "rgba(0, 0, 0, 1)" }}>
                        {t("form.activities", language)}
                      </div>
                    </Label>
                    <div className="space-y-3">
                      {[
                        {
                          key: "sightseeing" as const,
                          label: "🏛️ Sightseeing",
                        },
                        { key: "food" as const, label: "🍽️ Food & Dining" },
                        { key: "adventure" as const, label: "🎯 Adventure" },
                        { key: "shopping" as const, label: "🛍️ Shopping" },
                        { key: "relaxation" as const, label: "🧘 Relaxation" },
                      ].map(({ key, label }, index) => (
                        <div 
                          key={key} 
                          className="bg-white/5 rounded-lg p-3 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-cyan-400/50 hover:scale-[1.02] animate-fade-in-up"
                          style={{animationDelay: `${index * 50}ms`}}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id={key}
                                checked={preferences[key]}
                                onCheckedChange={(checked) =>
                                  handlePreferenceChange(key, checked as boolean)
                                }
                                className="border-white/30 bg-white/10"
                              />
                              <Label
                                htmlFor={key}
                                className="cursor-pointer font-medium"
                                style={{ color: "rgba(0, 0, 0, 1)" }}
                              >
                                {label}
                              </Label>
                            </div>
                            {preferences[key] && (
                              <select
                                value={priorities[key]}
                                onChange={(e) =>
                                  handlePriorityChange(
                                    key,
                                    e.target.value as "must-have" | "nice-to-have" | "optional"
                                  )
                                }
                                className="text-xs font-semibold px-3 py-1 rounded-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                style={{
                                  backgroundColor: priorities[key] === "must-have" 
                                    ? "rgba(34, 197, 94, 0.2)" 
                                    : priorities[key] === "nice-to-have"
                                    ? "rgba(59, 130, 246, 0.2)"
                                    : "rgba(156, 163, 175, 0.2)",
                                  color: priorities[key] === "must-have"
                                    ? "rgb(34, 197, 94)"
                                    : priorities[key] === "nice-to-have"
                                    ? "rgb(59, 130, 246)"
                                    : "rgb(107, 114, 128)",
                                }}
                              >
                                <option value="must-have">Must-Have</option>
                                <option value="nice-to-have">Nice-to-Have</option>
                                <option value="optional">Optional</option>
                              </select>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: "rgba(0, 0, 0, 1)" }}
                    >
                      {t("form.activitiesHint", language)}
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mt-2">
                      <p className="text-xs text-blue-900 font-semibold">
                        💡 Priority Guide: If budget adjustments are needed, the agent will remove <span className="text-gray-600">Optional</span> activities first, then <span className="text-blue-600">Nice-to-Have</span>, while always protecting <span className="text-green-600">Must-Have</span> experiences.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    style={{
                      backgroundColor: "rgba(5, 1, 12, 1)",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  >
                    {!user ? (
                      <>
                        <LogIn className="h-4 w-4 mr-2 inline" />
                        Login to Generate Itinerary
                      </>
                    ) : (
                      t("form.generate", language)
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "planning" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <div className="mb-8 space-y-4">
                <div className="inline-flex items-center justify-center">
                  <div className="relative h-24 w-24">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-75 animate-pulse" />
                    <div className="relative h-full w-full bg-black rounded-full flex items-center justify-center">
                      <Plane className="h-10 w-10 text-cyan-400 animate-bounce" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white">
                    {t("planning.title", language)}
                  </h2>
                  <p className="text-lg text-purple-200">
                    {isPlanning
                      ? t("planning.generating", language)
                      : t("planning.ready", language)}
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <PlanningStep
                    step={t("planning.step.plan", language)}
                    description="Selecting activities based on your preferences"
                    complete={true}
                  />
                  <PlanningStep
                    step={t("planning.step.validate", language)}
                    description="Checking against your budget constraints"
                    complete={!isPlanning}
                  />
                  <PlanningStep
                    step={t("planning.step.replan", language)}
                    description="Optimizing if adjustments needed"
                    complete={!isPlanning}
                  />
                  <PlanningStep
                    step={t("planning.step.finalOutput", language)}
                    description="Preparing your itinerary"
                    complete={!isPlanning}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "results" && travelPlan && (
          <div className="space-y-8 animate-fade-in">
            {/* Budget Status Card */}
            <Card
              className={`border-2 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl animate-fade-in-up ${
                travelPlan.isFeasible
                  ? travelPlan.isWithinBudget
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-orange-500/10 border-orange-500/30"
                  : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <CardContent className="pt-8">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      {travelPlan.isFeasible && travelPlan.isWithinBudget ? (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      ) : travelPlan.isFeasible ? (
                        <AlertCircle className="h-6 w-6 text-orange-400" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-red-400" />
                      )}
                      <h3 className="text-xl font-bold text-white">
                        {travelPlan.isFeasible
                          ? travelPlan.isWithinBudget
                            ? t("results.withinBudget", language)
                            : t("results.adjusted", language)
                          : t("results.notPossible", language)}
                      </h3>
                    </div>
                    {travelPlan.isFeasible ? (
                      <p className="text-purple-200">
                        {travelPlan.isWithinBudget
                          ? t("results.message.withinBudget", language).replace(
                              "{remaining}",
                              convertCurrency(travelPlan.budget - travelPlan.totalCost)
                            )
                          : t("results.message.adjusted", language)}
                      </p>
                    ) : (
                      <p className="text-purple-200">
                        {t("results.message.impossible", language)}
                      </p>
                    )}
                    {travelPlan.rePlanned && (
                      <p className="text-sm text-purple-300 italic">
                        {t("results.message.replanned", language)}
                      </p>
                    )}
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {convertCurrency(travelPlan.totalCost)}
                    </div>
                    <p className="text-sm text-purple-300">Total Cost</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Trip Summary */}
            {travelPlan.isFeasible && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white/10 border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{animationDelay: '100ms'}}>
                <CardContent className="pt-6 text-center">
                  <MapPin className="h-8 w-8 text-cyan-400 mx-auto mb-2 transition-transform duration-300 hover:scale-110" />
                  <p className="text-sm text-purple-200">{t("results.destination", language)}</p>
                  <p className="text-lg font-bold text-white">
                    {travelPlan.city}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{animationDelay: '200ms'}}>
                <CardContent className="pt-6 text-center">
                  <Calendar className="h-8 w-8 text-cyan-400 mx-auto mb-2 transition-transform duration-300 hover:scale-110" />
                  <p className="text-sm text-purple-200">{t("results.duration", language)}</p>
                  <p className="text-lg font-bold text-white">
                    {travelPlan.days} Days
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{animationDelay: '300ms'}}>
                <CardContent className="pt-6 text-center">
                  <DollarSign className="h-8 w-8 text-cyan-400 mx-auto mb-2 transition-transform duration-300 hover:scale-110" />
                  <p className="text-sm text-purple-200">{t("results.budget", language)}</p>
                  <p className="text-lg font-bold text-white">
                    {convertCurrency(travelPlan.budget)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{animationDelay: '400ms'}}>
                <CardContent className="pt-6 text-center">
                  <Sparkles className="h-8 w-8 text-cyan-400 mx-auto mb-2 transition-transform duration-300 hover:scale-110 animate-pulse" />
                  <p className="text-sm text-purple-200">{t("results.perDay", language)}</p>
                  <p className="text-lg font-bold text-white">
                    {convertCurrency(travelPlan.totalCost / travelPlan.days)}
                  </p>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Decision Explanation Panel */}
            {travelPlan.explanations && travelPlan.explanations.length > 0 && (
              <Card className="bg-white/10 border-white/20 transition-all duration-300 hover:shadow-2xl animate-fade-in-up" style={{animationDelay: '500ms'}}>
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    {t("explanation.title", language)}
                  </CardTitle>
                  <p className="text-sm text-gray-800">
                    {t("explanation.subtitle", language)}
                  </p>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {travelPlan.explanations.map((explanation, idx) => (
                      <AccordionItem
                        key={idx}
                        value={`explanation-${idx}`}
                        className="border-gray-600"
                      >
                        <AccordionTrigger className="text-gray-900 hover:text-cyan-700 hover:no-underline font-semibold">
                          <div className="flex items-center gap-2">
                            {explanation.impact === "positive" && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            {explanation.impact === "constraint" && (
                              <AlertCircle className="h-4 w-4 text-orange-600" />
                            )}
                            {explanation.impact === "neutral" && (
                              <Info className="h-4 w-4 text-blue-600" />
                            )}
                            <span className="text-left">{explanation.reason}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-800">
                          {explanation.detail}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {/* Daily Itinerary */}
            {travelPlan.isFeasible && (
            <div className="animate-fade-in" style={{animationDelay: '600ms'}}>
              <div className="flex items-center justify-between gap-3 mb-6">
                <h2 className="text-3xl font-bold text-white animate-slide-right">
                  {t("results.itinerary", language)}
                </h2>
                <div className="bg-white/10 border border-white/20 rounded-full p-1 flex gap-1">
                  <Button
                    variant={viewMode === "itinerary" ? "default" : "outline"}
                    className={`text-sm px-4 py-2 rounded-full transition-all duration-300 ${viewMode === "itinerary" ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white" : "bg-transparent text-white hover:bg-white/10"}`}
                    onClick={() => setViewMode("itinerary")}
                  >
                    Itinerary View
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "outline"}
                    className={`text-sm px-4 py-2 rounded-full transition-all duration-300 ${viewMode === "map" ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white" : "bg-transparent text-white hover:bg-white/10"}`}
                    onClick={() => setViewMode("map")}
                  >
                    Map View
                  </Button>
                </div>
              </div>

              {viewMode === "itinerary" && (
                <div className="space-y-4">
                  {travelPlan.itinerary.map((day, index) => (
                    <div key={day.day} className="animate-fade-in-up" style={{animationDelay: `${700 + index * 100}ms`} }>
                      <DayCard day={day} convertCurrency={convertCurrency} language={language} />
                    </div>
                  ))}
                </div>
              )}

              {viewMode === "map" && (
                <div className="space-y-6">
                  {travelPlan.itinerary.map((day, index) => (
                    <div key={day.day} className="animate-fade-in-up" style={{animationDelay: `${700 + index * 100}ms`} }>
                      {day.route && (
                        <RouteMap
                          dayNumber={day.day}
                          route={day.route}
                          language={language}
                          city={travelPlan.city}
                          onExpand={() => setExpandedMapDay(day.day)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}

            {/* Cost Breakdown */}
            {travelPlan.isFeasible && (
            <Card className="bg-white/10 border-white/20 transition-all duration-300 hover:shadow-2xl animate-fade-in-up" style={{animationDelay: '900ms'}}>
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-cyan-400" />
                  {t("results.costBreakdown", language)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {travelPlan.itinerary.map((day) => (
                    <div
                      key={day.day}
                      className="flex justify-between items-center py-2 border-b border-white/10 last:border-0"
                    >
                      <span className="text-white font-medium">
                        Day {day.day}
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="w-40 bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(day.totalCost / Math.max(...travelPlan.itinerary.map((d) => d.totalCost))) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-cyan-400 font-bold w-20 text-right">
                          {convertCurrency(day.totalCost)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-3 border-t-2 border-cyan-500/30 mt-3 font-bold">
                    <span className="text-white">Total</span>
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-xl">
                      {convertCurrency(travelPlan.totalCost)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <Button
                onClick={handleReplan}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-lg"
              >
                {t("btn.planAnotherTrip", language)}
              </Button>
              <Button
                onClick={handleSave}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3"
              >
                {t("btn.saveItinerary", language)}
              </Button>
              {savedItineraries.length > 0 && (
                <Button
                  onClick={handleViewSaved}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-lg"
                >
                  {t("btn.viewSaved", language)} ({savedItineraries.length})
                </Button>
              )}
              <Button
                onClick={handleViewBookings}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8 py-3 rounded-lg"
              >
                Manage Bookings {bookings.length > 0 && `(${bookings.length})`}
              </Button>
            </div>
          </div>
        )}

        {/* Fullscreen Map Modal */}
        {expandedMapDay && travelPlan && (
          <Dialog open={true} onOpenChange={() => setExpandedMapDay(null)}>
            <DialogContent className="max-w-6xl w-full bg-white">
              <DialogHeader>
                <DialogTitle className="text-slate-900">Day {expandedMapDay} Full Map</DialogTitle>
                <DialogDescription className="text-slate-600">Click pins to see segment distance and time.</DialogDescription>
              </DialogHeader>
              <div>
                {travelPlan.itinerary
                  .filter((d) => d.day === expandedMapDay)
                  .map((d) => (
                    d.route ? (
                      <RouteMap
                        key={d.day}
                        dayNumber={d.day}
                        route={d.route}
                        language={language}
                        city={travelPlan.city}
                        size="lg"
                      />
                    ) : null
                  ))}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {step === "saved" && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-3">
                {t("saved.title", language)}
              </h2>
              <p className="text-lg text-white">
                {t("saved.subtitle", language)}
              </p>
            </div>

            {savedItineraries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedItineraries.map((saved) => (
                  <Card
                    key={saved.id}
                    className="bg-white/10 border-white/20 hover:border-white/40 transition-all duration-200 overflow-hidden"
                  >
                    <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 pb-4">
                      <CardTitle className="text-white flex items-center justify-between">
                        <div>
                          <p className="text-lg">{saved.city}</p>
                          <p className="text-sm font-normal text-purple-300">
                            {saved.days} days • {convertCurrency(saved.budget)} budget
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/5 rounded-lg p-3 text-center">
                            <p className="text-xs text-purple-300">{t("results.totalCost", language)}</p>
                            <p className="text-lg font-bold text-cyan-400">
                              {convertCurrency(saved.totalCost)}
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3 text-center">
                            <p className="text-xs text-purple-300">{t("results.perDay", language)}</p>
                            <p className="text-lg font-bold text-cyan-400">
                              {convertCurrency(saved.totalCost / saved.days)}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-purple-200 text-center border-t border-white/10 pt-3">
                          {t("saved.savedAt", language)} {saved.savedAt}
                        </p>
                        <div className="flex gap-2 pt-3">
                          <Button
                            onClick={() => handleLoadSaved(saved)}
                            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm py-2 rounded"
                          >
                            {t("btn.viewPlan", language)}
                          </Button>
                          <Button
                            onClick={() => handleDeleteSaved(saved.id)}
                            variant="outline"
                            className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm py-2"
                          >
                            {t("btn.deletePlan", language)}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-purple-300 mb-4">
                  {t("saved.empty", language)}
                </p>
                <Button
                  onClick={() => setStep("form")}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-lg"
                >
                  {t("btn.createNewPlan", language)}
                </Button>
              </div>
            )}

            <div className="flex gap-4 justify-center pt-4">
              <Button
                onClick={() => setStep("results")}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3"
              >
                {t("btn.backToCurrent", language)}
              </Button>
            </div>
          </div>
        )}

        {/* Bookings Section */}
        {step === "bookings" && (
          <div className="space-y-8">
            <BookingManager
              bookings={bookings}
              onAddBooking={handleAddBooking}
              onDeleteBooking={handleDeleteBooking}
              language={language}
            />

            <div className="flex gap-4 justify-center pt-4">
              <Button
                onClick={() => setStep(travelPlan ? "results" : "form")}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3"
              >
                Back to {travelPlan ? "Itinerary" : "Home"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* AI Assistant - Available on all pages */}
      <AIAssistant 
        currentPlan={travelPlan} 
        language={language}
      />
    </div>
  );
}

function PlanningStep({
  step,
  description,
  complete,
}: {
  step: string;
  description: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-4 text-left">
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          complete
            ? "bg-gradient-to-r from-cyan-500 to-blue-500"
            : "bg-white/20 animate-pulse"
        }`}
      >
        {complete && <CheckCircle className="h-5 w-5 text-white" />}
      </div>
      <div>
        <p className="font-semibold text-white">{step}</p>
        <p className="text-sm text-purple-200">{description}</p>
      </div>
    </div>
  );
}

function DayCard({ day, convertCurrency, language }: { day: DayItinerary; convertCurrency: (amount: number) => string; language: string }) {
  return (
    <Card className="bg-white/10 border-white/20 hover:border-cyan-400/60 transition-all duration-300 overflow-hidden group hover:scale-[1.02] hover:shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 pb-4 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-300">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">
            {t("results.day", language)} {day.day}
            {day.activities.length === 0 && (
              <span className="ml-2 text-sm font-normal text-purple-300">
                ({t("results.flexibleDay", language)})
              </span>
            )}
          </CardTitle>
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {convertCurrency(day.totalCost)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {day.activities.length > 0 ? (
          <div className="space-y-3">
            {day.activities.map((activity, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-white">
                      {t(`activity.${activity.name}`, language)}
                    </h4>
                    <p className="text-sm text-purple-300">
                      {t(`category.${activity.category}`, language)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-cyan-400 transition-all duration-300 hover:scale-110">
                      {convertCurrency(activity.estimatedCost)}
                    </p>
                    <p className="text-xs text-purple-300">
                      {activity.duration}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-purple-200">
                  {t(`activity.desc.${activity.name}`, language)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-purple-300 italic text-center py-4">
            {t("results.freeDay", language)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
