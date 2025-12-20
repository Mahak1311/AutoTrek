import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { TravelPlan } from "@/lib/travel-planner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  currentPlan?: TravelPlan | null;
  onPlanUpdate?: (suggestions: string) => void;
  language: string;
}

export function AIAssistant({ currentPlan, onPlanUpdate, language }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi! I'm your AI Travel Assistant. I can help you:\n\n• Plan personalized itineraries\n• Suggest activities based on your travel style\n• Refine and optimize your travel plans\n• Answer questions about destinations\n\nHow can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen && messages.length > 1 && messages[messages.length - 1].role === "assistant") {
      setUnreadCount(prev => prev + 1);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Weather queries
    if (lowerMessage.includes("weather") || lowerMessage.includes("temperature") || lowerMessage.includes("climate") || lowerMessage.includes("rain")) {
      if (currentPlan) {
        return `For ${currentPlan.city}, here's what you should know:\n\n🌤️ **Weather Preparation**:\n• Check forecast 2-3 days before departure\n• Pack layers for temperature changes\n• Bring appropriate rain gear\n• Consider season-specific items\n\n💡 **Useful Resources**:\n• Weather.com or AccuWeather\n• Local weather apps\n• Historical climate data\n\n📱 **Pro Tips**:\n✓ Download offline weather app\n✓ Check hourly forecasts\n✓ Plan indoor alternatives for rainy days\n✓ Morning weather is often different from afternoon\n\nWould you like activity suggestions based on typical weather conditions?`;
      }
      return `🌦️ **Weather & Climate Tips**:\n\n**Before You Go**:\n• Research typical weather for your dates\n• Check seasonal patterns\n• Look at historical data\n• Consider shoulder seasons\n\n**What to Pack**:\n☀️ Sunny: Sunscreen, hat, sunglasses\n🌧️ Rainy: Umbrella, waterproof jacket\n❄️ Cold: Layers, warm coat, gloves\n🌡️ Hot: Light clothing, hydration gear\n\n**Resources**:\n• Weather.com\n• AccuWeather\n• Local tourism websites\n• Weather Underground\n\nWhich destination are you asking about?`;
    }

    // Context-aware responses based on current plan
    if (currentPlan) {
      if (lowerMessage.includes("change") || lowerMessage.includes("modify") || lowerMessage.includes("adjust")) {
        return `I can help you modify your ${currentPlan.days}-day trip to ${currentPlan.city}! What would you like to change?\n\n• Add more adventure activities?\n• Include more relaxation time?\n• Change the budget allocation?\n• Swap specific activities?\n\nJust let me know what you'd like to adjust!`;
      }

      if (lowerMessage.includes("expensive") || lowerMessage.includes("cheaper") || lowerMessage.includes("budget")) {
        const avgPerDay = (currentPlan.totalCost / currentPlan.days).toFixed(0);
        return `Your current plan costs $${currentPlan.totalCost} ($${avgPerDay}/day). I can help you:\n\n💰 Find budget alternatives\n🍽️ Suggest free/cheap dining options\n🎯 Prioritize must-see attractions\n🏨 Recommend affordable accommodations\n\nWould you like me to suggest ways to reduce costs?`;
      }

      if (lowerMessage.includes("add") || lowerMessage.includes("more")) {
        return `I'd love to enhance your ${currentPlan.city} itinerary! What would you like to add?\n\n🏛️ More sightseeing spots?\n🍴 Local food experiences?\n🎢 Adventure activities?\n🛍️ Shopping destinations?\n🧘 Relaxation time?\n\nTell me your preference and I'll suggest additions!`;
      }

      if (lowerMessage.includes("time") || lowerMessage.includes("schedule") || lowerMessage.includes("rush")) {
        return `Let me analyze your schedule:\n\nYour ${currentPlan.days}-day itinerary includes ${currentPlan.itinerary.reduce((sum, day) => sum + day.activities.length, 0)} activities. I can help by:\n\n⏰ Adding buffer time between activities\n🚶 Grouping nearby attractions\n🌅 Balancing morning/evening activities\n☕ Including rest periods\n\nWould you like me to optimize the timing?`;
      }
    }

    // General travel advice
    if (lowerMessage.includes("style") || lowerMessage.includes("type") || lowerMessage.includes("traveler")) {
      return `Let's identify your travel style! Are you:\n\n🎒 **Adventure Seeker**: Outdoor activities, hiking, extreme sports\n🏛️ **Culture Enthusiast**: Museums, historical sites, local traditions\n🍽️ **Foodie Explorer**: Culinary tours, food markets, cooking classes\n🧘 **Relaxation Focused**: Spas, beaches, peaceful retreats\n🛍️ **Shopping Lover**: Markets, boutiques, local crafts\n💼 **Business Traveler**: Efficient itinerary, networking events\n👨‍👩‍👧 **Family Traveler**: Kid-friendly activities, safe destinations\n\nTell me which resonates with you!`;
    }

    if (lowerMessage.includes("destination") || lowerMessage.includes("where") || lowerMessage.includes("city")) {
      return `Looking for destination inspiration? I can suggest based on:\n\n🌍 **Your Interests**: Culture, adventure, food, relaxation\n💰 **Budget**: Luxury, moderate, budget-friendly\n🗓️ **Season**: Best time to visit\n✈️ **Travel Distance**: Short trip or long haul\n👥 **Travel Companions**: Solo, couple, family, friends\n\nWhat's most important to you in choosing a destination?`;
    }

    if (lowerMessage.includes("budget") || lowerMessage.includes("cost") || lowerMessage.includes("price")) {
      return `Let's plan your budget! Here's what to consider:\n\n💵 **Daily Budget Breakdown**:\n• Accommodation: 40-50%\n• Food: 20-30%\n• Activities: 15-25%\n• Transportation: 10-15%\n• Miscellaneous: 5-10%\n\n💡 **Money-Saving Tips**:\n✓ Book flights on Tuesdays/Wednesdays\n✓ Stay in neighborhoods, not tourist centers\n✓ Eat where locals eat\n✓ Use city passes for attractions\n✓ Walk or use public transport\n\nWhat's your budget range per day?`;
    }

    if (lowerMessage.includes("days") || lowerMessage.includes("how long") || lowerMessage.includes("duration")) {
      return `The ideal trip duration depends on:\n\n🌆 **City Break**: 3-4 days\n🏖️ **Beach Vacation**: 5-7 days\n🗺️ **Multi-City Tour**: 7-14 days\n🌍 **Continent Exploration**: 14-21 days\n🎒 **Extended Travel**: 1+ months\n\nAlso consider:\n• Travel time to destination\n• Jet lag recovery (long-haul)\n• Work/personal commitments\n• Budget constraints\n\nHow many days are you thinking?`;
    }

    if (lowerMessage.includes("pack") || lowerMessage.includes("bring") || lowerMessage.includes("luggage")) {
      return `Smart packing tips for your trip:\n\n🎒 **Essentials**:\n✓ Travel documents & copies\n✓ Medications & first aid\n✓ Phone charger & adapter\n✓ Comfortable walking shoes\n✓ Weather-appropriate clothing\n\n📱 **Tech**:\n✓ Portable charger\n✓ Universal adapter\n✓ Offline maps downloaded\n✓ Travel apps installed\n\n💡 **Pro Tips**:\n• Roll clothes to save space\n• Wear heaviest items on plane\n• Pack a small day bag\n• Leave room for souvenirs\n\nWhat climate are you traveling to?`;
    }

    if (lowerMessage.includes("flight") || lowerMessage.includes("airline") || lowerMessage.includes("booking")) {
      return `Flight booking tips:\n\n✈️ **Best Booking Times**:\n• Domestic: 1-3 months ahead\n• International: 2-8 months ahead\n• Avoid booking on weekends\n\n💰 **Save Money**:\n✓ Use incognito mode\n✓ Be flexible with dates\n✓ Check nearby airports\n✓ Consider layovers\n✓ Set price alerts\n\n🎫 **Booking Sites**:\n• Google Flights (comparison)\n• Skyscanner (flexible dates)\n• Kayak (price prediction)\n• Direct airline websites\n\nWhere are you flying to?`;
    }

    if (lowerMessage.includes("hotel") || lowerMessage.includes("accommodation") || lowerMessage.includes("stay")) {
      return `Finding the perfect accommodation:\n\n🏨 **Options**:\n• Hotels: Full service, reliable\n• Airbnb: Local experience, kitchen\n• Hostels: Budget-friendly, social\n• Boutique: Unique, personalized\n• Resorts: All-inclusive, amenities\n\n📍 **Location Tips**:\n✓ Near public transport\n✓ Safe neighborhood\n✓ Walking distance to attractions\n✓ Local restaurants nearby\n\n💡 **Booking Advice**:\n• Read recent reviews\n• Check cancellation policy\n• Compare prices across sites\n• Look for loyalty discounts\n\nWhat's your accommodation preference?`;
    }

    if (lowerMessage.includes("food") || lowerMessage.includes("restaurant") || lowerMessage.includes("eat")) {
      return `Culinary adventure tips:\n\n🍽️ **Finding Great Food**:\n✓ Ask locals for recommendations\n✓ Eat where locals eat (away from tourist areas)\n✓ Try street food (if safe)\n✓ Visit local markets\n✓ Take a food tour\n\n🥘 **Must-Try Experiences**:\n• Traditional breakfast spots\n• Local specialty dishes\n• Food markets & halls\n• Cooking classes\n• Wine/food tastings\n\n💰 **Budget Tips**:\n• Lunch specials (cheaper than dinner)\n• Local eateries vs tourist restaurants\n• Grocery stores for snacks\n• Happy hour deals\n\nWhat cuisine are you excited to try?`;
    }

    if (lowerMessage.includes("safe") || lowerMessage.includes("safety") || lowerMessage.includes("secure")) {
      return `Travel safety essentials:\n\n🛡️ **Before You Go**:\n✓ Register with embassy\n✓ Get travel insurance\n✓ Share itinerary with family\n✓ Check travel advisories\n✓ Photocopy documents\n\n🚨 **While Traveling**:\n✓ Keep valuables secure\n✓ Be aware of surroundings\n✓ Use hotel safe\n✓ Avoid displaying wealth\n✓ Trust your instincts\n\n📱 **Emergency Contacts**:\n• Local emergency number\n• Embassy/consulate\n• Travel insurance hotline\n• Hotel front desk\n\nAny specific safety concerns?`;
    }

    if (lowerMessage.includes("local") || lowerMessage.includes("culture") || lowerMessage.includes("custom")) {
      return `Respecting local culture:\n\n🌍 **Cultural Etiquette**:\n• Learn basic phrases\n• Understand local customs\n• Dress appropriately\n• Ask before photographing\n• Tip according to local norms\n\n🤝 **Connecting with Locals**:\n✓ Use language apps\n✓ Join local tours\n✓ Visit neighborhood cafes\n✓ Attend cultural events\n✓ Shop at local markets\n\n💡 **Responsible Travel**:\n• Support local businesses\n• Respect sacred sites\n• Follow environmental guidelines\n• Be mindful of noise levels\n\nWhich destination are you visiting?`;
    }

    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return `You're very welcome! 😊 I'm here anytime you need help with:\n\n✨ Planning your perfect trip\n🗺️ Optimizing your itinerary\n💡 Getting travel advice\n🎯 Refining your plans\n\nHave an amazing journey! Feel free to ask anything else!`;
    }

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return `Hello! 👋 Great to chat with you! I'm your AI travel assistant, ready to help you plan an unforgettable trip.\n\nI can assist with:\n• Destination recommendations\n• Budget planning\n• Itinerary optimization\n• Travel tips & advice\n• Activity suggestions\n\nWhat are you planning?`;
    }

    // Visa and documents
    if (lowerMessage.includes("visa") || lowerMessage.includes("passport") || lowerMessage.includes("document")) {
      return `📋 **Travel Documents Checklist**:\n\n**Essential Documents**:\n✓ Valid passport (6+ months validity)\n✓ Visa (if required)\n✓ Travel insurance\n✓ Flight tickets\n✓ Hotel confirmations\n✓ Copies of all documents\n\n**Visa Information**:\n• Check requirements for your nationality\n• Apply well in advance (2-3 months)\n• Some countries offer visa-on-arrival\n• E-visas available for many destinations\n\n**Resources**:\n• Embassy websites\n• VisaHQ.com\n• iVisa.com\n• Government travel advisories\n\nWhich country are you traveling to?`;
    }

    // Transportation
    if (lowerMessage.includes("transport") || lowerMessage.includes("taxi") || lowerMessage.includes("uber") || lowerMessage.includes("metro") || lowerMessage.includes("bus")) {
      return `🚗 **Getting Around**:\n\n**Local Transportation**:\n🚇 Metro/Subway: Fastest in big cities\n🚌 Buses: Cheapest option\n🚕 Taxis: Convenient but pricey\n🚗 Ride-sharing: Uber/Lyft/Grab\n🚲 Bike rentals: Eco-friendly\n🚶 Walking: Best for exploring\n\n**Money-Saving Tips**:\n• Buy day/week transit passes\n• Download local transport apps\n• Walk when possible\n• Avoid airport taxis (use official services)\n\n**Safety Tips**:\n✓ Use official taxi stands\n✓ Share ride details with someone\n✓ Keep valuables secure\n✓ Know your destination address\n\nWhere are you traveling?`;
    }

    // Emergency situations
    if (lowerMessage.includes("emergency") || lowerMessage.includes("help") || lowerMessage.includes("problem") || lowerMessage.includes("lost")) {
      return `🆘 **Emergency Assistance**:\n\n**If You Need Help**:\n1️⃣ Contact local emergency services\n2️⃣ Call your embassy/consulate\n3️⃣ Contact your travel insurance\n4️⃣ Inform your hotel/accommodation\n\n**Lost Passport**:\n• File police report immediately\n• Contact your embassy\n• Apply for emergency travel document\n\n**Lost/Stolen Cards**:\n• Call bank immediately\n• Use backup payment method\n• Keep emergency cash separate\n\n**Medical Emergency**:\n• Call local emergency number\n• Go to hospital/clinic\n• Contact travel insurance\n• Keep all receipts\n\n**Important Numbers**:\n• Local emergency: 112 (Europe), 911 (US)\n• Your embassy number\n• Travel insurance hotline\n\nStay calm and prioritize your safety!`;
    }

    // Money and currency
    if (lowerMessage.includes("money") || lowerMessage.includes("currency") || lowerMessage.includes("exchange") || lowerMessage.includes("atm") || lowerMessage.includes("cash")) {
      return `💰 **Money & Currency Tips**:\n\n**Before You Go**:\n✓ Notify your bank of travel plans\n✓ Get small amount of local currency\n✓ Have multiple payment methods\n✓ Know the exchange rate\n\n**Best Practices**:\n• Use ATMs for best rates (avoid airports)\n• Carry mix of cash and cards\n• Use credit cards with no foreign fees\n• Keep emergency cash hidden\n• Take photo of card details (store securely)\n\n**Avoid**:\n❌ Airport exchange counters (worst rates)\n❌ Hotel currency exchange\n❌ Dynamic currency conversion\n❌ Carrying all cash in one place\n\n**Apps to Use**:\n• XE Currency Converter\n• Revolut (multi-currency card)\n• Wise (formerly TransferWise)\n\nHow much cash should you carry? About 2-3 days worth as backup!`;
    }

    // Internet and connectivity
    if (lowerMessage.includes("internet") || lowerMessage.includes("wifi") || lowerMessage.includes("sim") || lowerMessage.includes("data") || lowerMessage.includes("phone")) {
      return `📱 **Staying Connected**:\n\n**Options**:\n1️⃣ **Local SIM Card**: Best for long stays\n   • Buy at airport or phone shops\n   • Need unlocked phone\n   • Cheapest for data\n\n2️⃣ **International Roaming**: Easiest but expensive\n   • Check your carrier's rates\n   • Often limited data\n\n3️⃣ **Portable WiFi**: Great for groups\n   • Rent pocket wifi device\n   • Multiple devices can connect\n\n4️⃣ **eSIM**: Modern solution\n   • No physical card needed\n   • Instant activation\n   • Apps: Airalo, Holafly\n\n**Free WiFi**:\n✓ Hotels, cafes, restaurants\n✓ Public libraries\n✓ Some public spaces\n✓ Shopping malls\n\n⚠️ **Security**:\n• Use VPN on public WiFi\n• Avoid banking on public networks\n• Download offline maps before travel\n\nWhat's your destination?`;
    }

    // Default helpful response - improved
    return `I'd be happy to help! 😊 Based on your question, I can provide specific advice about:\n\n🗺️ **Travel Planning**\n• Destination recommendations\n• Itinerary creation & optimization\n• Budget planning\n• Best time to visit\n\n✈️ **Trip Logistics**\n• Flights & transportation\n• Accommodation tips\n• Visa & documents\n• Travel insurance\n\n🎯 **Activities & Experiences**\n• Things to do & see\n• Local food & restaurants\n• Hidden gems\n• Cultural experiences\n\n💡 **Practical Advice**\n• Packing tips\n• Money & currency\n• Safety guidelines\n• Internet & connectivity\n\n${currentPlan ? `\nI can also help you modify your current ${currentPlan.days}-day trip to ${currentPlan.city}!\n` : ''}\nCould you be more specific about what you'd like to know? For example:\n• "What's the weather like?"\n• "How do I get around?"\n• "What should I pack?"\n• "Tell me about visa requirements"\n• "Best places to eat?"`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: generateAIResponse(input),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-black shadow-2xl hover:shadow-amber-800/50 transition-all duration-300 hover:scale-110 z-50"
        >
          <div className="relative">
            <MessageCircle className="h-7 w-7 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[400px] h-[600px] shadow-2xl z-50 flex flex-col bg-white border-2 border-amber-800 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-t-lg pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur animate-pulse" />
                  <div className="relative bg-white/20 backdrop-blur p-2 rounded-full">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">AI Travel Assistant</CardTitle>
                  <p className="text-xs text-amber-200 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Powered by AI
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-amber-100/30 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"} animate-in slide-in-from-bottom-2`}
              >
                <div
                  className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-amber-700 to-amber-900"
                      : "bg-gradient-to-br from-amber-800 to-amber-950"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-tr-none"
                      : "bg-white text-slate-900 border border-amber-300 rounded-tl-none shadow-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "user" ? "text-cyan-100" : "text-slate-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 animate-in slide-in-from-bottom-2">
                <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-800 to-amber-950">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white text-slate-900 border border-amber-300 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 bg-amber-700 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 bg-amber-700 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 bg-amber-700 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="p-4 border-t border-amber-300 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about travel..."
                className="flex-1 border-amber-300 focus:border-amber-700 focus:ring-amber-700 bg-amber-50 text-slate-900"
                disabled={isTyping}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-black text-white"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
