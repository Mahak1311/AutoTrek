import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plane, 
  Hotel, 
  Car, 
  Ticket, 
  Plus, 
  Trash2, 
  Calendar,
  MapPin,
  Clock,
  User,
  FileText
} from "lucide-react";
import { 
  Booking, 
  FlightBooking, 
  HotelBooking, 
  CarRentalBooking, 
  TicketBooking,
  generateBookingId
} from "@/lib/bookings";

interface BookingManagerProps {
  bookings: Booking[];
  onAddBooking: (booking: Booking) => void;
  onDeleteBooking: (bookingId: string) => void;
  language: string;
}

export function BookingManager({ bookings, onAddBooking, onDeleteBooking, language }: BookingManagerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [bookingType, setBookingType] = useState<"flight" | "hotel" | "car" | "ticket">("flight");
  const [activeTab, setActiveTab] = useState<"all" | "flight" | "hotel" | "car" | "ticket">("all");

  const filteredBookings = activeTab === "all" 
    ? bookings 
    : bookings.filter(b => b.type === activeTab);

  const bookingCounts = {
    flight: bookings.filter(b => b.type === "flight").length,
    hotel: bookings.filter(b => b.type === "hotel").length,
    car: bookings.filter(b => b.type === "car").length,
    ticket: bookings.filter(b => b.type === "ticket").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Reservation & Booking Management</h2>
          <p className="text-purple-200 mt-1">Manage all your travel bookings in one place</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white transition-all duration-300 hover:scale-105">
              <Plus className="h-4 w-4 mr-2" />
              Add Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] bg-white" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="text-slate-900 mb-4">Add New Booking</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(85vh-120px)] pr-2">
              <BookingForm 
                type={bookingType} 
                onTypeChange={setBookingType}
                onSubmit={(booking) => {
                  onAddBooking(booking);
                  setShowAddDialog(false);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-white/10 border-white/20 transition-all duration-300 hover:scale-105">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Plane className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-purple-200">Flights</p>
                <p className="text-2xl font-bold text-white">{bookingCounts.flight}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20 transition-all duration-300 hover:scale-105">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Hotel className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-purple-200">Hotels</p>
                <p className="text-2xl font-bold text-white">{bookingCounts.hotel}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20 transition-all duration-300 hover:scale-105">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/20 rounded-full">
                <Car className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-purple-200">Car Rentals</p>
                <p className="text-2xl font-bold text-white">{bookingCounts.car}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20 transition-all duration-300 hover:scale-105">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 rounded-full">
                <Ticket className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-purple-200">Tickets</p>
                <p className="text-2xl font-bold text-white">{bookingCounts.ticket}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: "All Bookings", icon: FileText },
          { key: "flight", label: "Flights", icon: Plane },
          { key: "hotel", label: "Hotels", icon: Hotel },
          { key: "car", label: "Car Rentals", icon: Car },
          { key: "ticket", label: "Tickets", icon: Ticket },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "outline"}
              className={`transition-all duration-300 ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card className="bg-white/10 border-white/20">
          <CardContent className="py-12 text-center">
            <FileText className="h-16 w-16 text-purple-300 mx-auto mb-4" />
            <p className="text-white text-lg font-semibold">No bookings yet</p>
            <p className="text-purple-200 mt-2">Add your first booking to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((booking) => (
            <BookingCard 
              key={booking.id} 
              booking={booking} 
              onDelete={() => onDeleteBooking(booking.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface BookingCardProps {
  booking: Booking;
  onDelete: () => void;
}

function BookingCard({ booking, onDelete }: BookingCardProps) {
  const typeConfig = {
    flight: { icon: Plane, color: "blue", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30" },
    hotel: { icon: Hotel, color: "purple", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30" },
    car: { icon: Car, color: "green", bgColor: "bg-green-500/10", borderColor: "border-green-500/30" },
    ticket: { icon: Ticket, color: "amber", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30" },
  };

  const config = typeConfig[booking.type];
  const Icon = config.icon;

  return (
    <Card className={`${config.bgColor} border-2 ${config.borderColor} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className={`p-3 ${config.bgColor} rounded-full border ${config.borderColor}`}>
              <Icon className={`h-6 w-6 text-${config.color}-400`} />
            </div>
            <div className="flex-1">
              {booking.type === "flight" && <FlightDetails booking={booking as FlightBooking} />}
              {booking.type === "hotel" && <HotelDetails booking={booking as HotelBooking} />}
              {booking.type === "car" && <CarDetails booking={booking as CarRentalBooking} />}
              {booking.type === "ticket" && <TicketDetails booking={booking as TicketBooking} />}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FlightDetails({ booking }: { booking: FlightBooking }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-xl font-bold text-white">{booking.airline} {booking.flightNumber}</h3>
        <p className="text-sm text-purple-300">Confirmation: {booking.confirmationNumber}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-purple-200 mb-1">Departure</p>
          <p className="text-white font-semibold">{booking.departure.city} ({booking.departure.airport})</p>
          <p className="text-sm text-purple-300">{booking.departure.date} at {booking.departure.time}</p>
        </div>
        <div>
          <p className="text-xs text-purple-200 mb-1">Arrival</p>
          <p className="text-white font-semibold">{booking.arrival.city} ({booking.arrival.airport})</p>
          <p className="text-sm text-purple-300">{booking.arrival.date} at {booking.arrival.time}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-purple-300">
        <span><User className="h-3 w-3 inline mr-1" />{booking.passengerName}</span>
        {booking.seatNumber && <span>Seat: {booking.seatNumber}</span>}
        {booking.bookingClass && <span>Class: {booking.bookingClass}</span>}
        {booking.price && <span className="text-cyan-400 font-semibold">${booking.price}</span>}
      </div>
      {booking.notes && <p className="text-sm text-purple-200 italic">{booking.notes}</p>}
    </div>
  );
}

function HotelDetails({ booking }: { booking: HotelBooking }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-xl font-bold text-white">{booking.hotelName}</h3>
        <p className="text-sm text-purple-300"><MapPin className="h-3 w-3 inline mr-1" />{booking.address}, {booking.city}</p>
        <p className="text-sm text-purple-300">Confirmation: {booking.confirmationNumber}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-purple-200 mb-1">Check-in</p>
          <p className="text-white font-semibold"><Calendar className="h-3 w-3 inline mr-1" />{booking.checkIn}</p>
        </div>
        <div>
          <p className="text-xs text-purple-200 mb-1">Check-out</p>
          <p className="text-white font-semibold"><Calendar className="h-3 w-3 inline mr-1" />{booking.checkOut}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-purple-300">
        <span><User className="h-3 w-3 inline mr-1" />{booking.guestName}</span>
        <span>{booking.numberOfGuests} guest(s)</span>
        <span>Room: {booking.roomType}</span>
        {booking.price && <span className="text-cyan-400 font-semibold">${booking.price}</span>}
      </div>
      {booking.notes && <p className="text-sm text-purple-200 italic">{booking.notes}</p>}
    </div>
  );
}

function CarDetails({ booking }: { booking: CarRentalBooking }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-xl font-bold text-white">{booking.company} - {booking.vehicleType}</h3>
        <p className="text-sm text-purple-300">Confirmation: {booking.confirmationNumber}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-purple-200 mb-1">Pick-up</p>
          <p className="text-white font-semibold">{booking.pickupLocation}</p>
          <p className="text-sm text-purple-300">{booking.pickupDate} at {booking.pickupTime}</p>
        </div>
        <div>
          <p className="text-xs text-purple-200 mb-1">Drop-off</p>
          <p className="text-white font-semibold">{booking.dropoffLocation}</p>
          <p className="text-sm text-purple-300">{booking.dropoffDate} at {booking.dropoffTime}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-purple-300">
        <span><User className="h-3 w-3 inline mr-1" />{booking.driverName}</span>
        {booking.insurance && <span className="text-green-400">✓ Insurance included</span>}
        {booking.price && <span className="text-cyan-400 font-semibold">${booking.price}</span>}
      </div>
      {booking.notes && <p className="text-sm text-purple-200 italic">{booking.notes}</p>}
    </div>
  );
}

function TicketDetails({ booking }: { booking: TicketBooking }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-xl font-bold text-white">{booking.eventName}</h3>
        <p className="text-sm text-purple-300"><MapPin className="h-3 w-3 inline mr-1" />{booking.venue}, {booking.city}</p>
        <p className="text-sm text-purple-300">Confirmation: {booking.confirmationNumber}</p>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs text-purple-200 mb-1">Event Date & Time</p>
          <p className="text-white font-semibold">
            <Calendar className="h-3 w-3 inline mr-1" />{booking.eventDate} at {booking.eventTime}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-purple-300">
        <span><User className="h-3 w-3 inline mr-1" />{booking.attendeeName}</span>
        <span>{booking.numberOfTickets} ticket(s)</span>
        <span>Type: {booking.ticketType}</span>
        {booking.seatNumber && <span>Seat: {booking.seatNumber}</span>}
        {booking.price && <span className="text-cyan-400 font-semibold">${booking.price}</span>}
      </div>
      {booking.notes && <p className="text-sm text-purple-200 italic">{booking.notes}</p>}
    </div>
  );
}

// Booking Form Component
interface BookingFormProps {
  type: "flight" | "hotel" | "car" | "ticket";
  onTypeChange: (type: "flight" | "hotel" | "car" | "ticket") => void;
  onSubmit: (booking: Booking) => void;
}

function BookingForm({ type, onTypeChange, onSubmit }: BookingFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    let booking: Booking;
    const id = generateBookingId();

    if (type === "flight") {
      booking = {
        id,
        type: "flight",
        airline: data.airline as string,
        flightNumber: data.flightNumber as string,
        departure: {
          airport: data.departureAirport as string,
          city: data.departureCity as string,
          date: data.departureDate as string,
          time: data.departureTime as string,
        },
        arrival: {
          airport: data.arrivalAirport as string,
          city: data.arrivalCity as string,
          date: data.arrivalDate as string,
          time: data.arrivalTime as string,
        },
        confirmationNumber: data.confirmationNumber as string,
        passengerName: data.passengerName as string,
        seatNumber: data.seatNumber as string || undefined,
        bookingClass: data.bookingClass as string || undefined,
        price: data.price ? Number(data.price) : undefined,
        notes: data.notes as string || undefined,
      } as FlightBooking;
    } else if (type === "hotel") {
      booking = {
        id,
        type: "hotel",
        hotelName: data.hotelName as string,
        address: data.address as string,
        city: data.city as string,
        checkIn: data.checkIn as string,
        checkOut: data.checkOut as string,
        roomType: data.roomType as string,
        confirmationNumber: data.confirmationNumber as string,
        guestName: data.guestName as string,
        numberOfGuests: Number(data.numberOfGuests),
        price: data.price ? Number(data.price) : undefined,
        notes: data.notes as string || undefined,
      } as HotelBooking;
    } else if (type === "car") {
      booking = {
        id,
        type: "car",
        company: data.company as string,
        vehicleType: data.vehicleType as string,
        pickupLocation: data.pickupLocation as string,
        pickupDate: data.pickupDate as string,
        pickupTime: data.pickupTime as string,
        dropoffLocation: data.dropoffLocation as string,
        dropoffDate: data.dropoffDate as string,
        dropoffTime: data.dropoffTime as string,
        confirmationNumber: data.confirmationNumber as string,
        driverName: data.driverName as string,
        price: data.price ? Number(data.price) : undefined,
        insurance: data.insurance === "on",
        notes: data.notes as string || undefined,
      } as CarRentalBooking;
    } else {
      booking = {
        id,
        type: "ticket",
        eventName: data.eventName as string,
        venue: data.venue as string,
        city: data.city as string,
        eventDate: data.eventDate as string,
        eventTime: data.eventTime as string,
        ticketType: data.ticketType as string,
        confirmationNumber: data.confirmationNumber as string,
        attendeeName: data.attendeeName as string,
        numberOfTickets: Number(data.numberOfTickets),
        seatNumber: data.seatNumber as string || undefined,
        price: data.price ? Number(data.price) : undefined,
        notes: data.notes as string || undefined,
      } as TicketBooking;
    }

    onSubmit(booking);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Selector */}
      <div className="space-y-2">
        <Label className="text-slate-900">Booking Type</Label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: "flight", icon: Plane, label: "Flight" },
            { value: "hotel", icon: Hotel, label: "Hotel" },
            { value: "car", icon: Car, label: "Car Rental" },
            { value: "ticket", icon: Ticket, label: "Ticket" },
          ].map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onTypeChange(option.value as typeof type)}
                className={`p-3 border-2 rounded-lg transition-all duration-300 ${
                  type === option.value
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-slate-200 hover:border-cyan-300"
                }`}
              >
                <Icon className={`h-6 w-6 mx-auto mb-1 ${type === option.value ? "text-cyan-600" : "text-slate-400"}`} />
                <p className={`text-xs font-semibold ${type === option.value ? "text-cyan-700" : "text-slate-600"}`}>
                  {option.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {type === "flight" && <FlightForm />}
      {type === "hotel" && <HotelForm />}
      {type === "car" && <CarForm />}
      {type === "ticket" && <TicketForm />}

      <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
        Add Booking
      </Button>
    </form>
  );
}

function FlightForm() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="airline" className="text-slate-900">Airline</Label>
          <Input id="airline" name="airline" required className="bg-white border-slate-300 text-slate-900" placeholder="e.g., Emirates" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="flightNumber" className="text-slate-900">Flight Number</Label>
          <Input id="flightNumber" name="flightNumber" required className="bg-white border-slate-300 text-slate-900" placeholder="e.g., EK202" />
        </div>
      </div>
      
      <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-slate-900">Departure</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="departureCity" className="text-slate-900">City</Label>
            <Input id="departureCity" name="departureCity" required className="bg-white border-slate-300 text-slate-900" placeholder="e.g., New York" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="departureAirport" className="text-slate-900">Airport Code</Label>
            <Input id="departureAirport" name="departureAirport" required className="bg-white border-slate-300 text-slate-900" placeholder="e.g., JFK" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="departureDate" className="text-slate-900">Date</Label>
            <Input id="departureDate" name="departureDate" type="date" required className="bg-white border-slate-300 text-slate-900" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="departureTime" className="text-slate-900">Time</Label>
            <Input id="departureTime" name="departureTime" type="time" required className="bg-white border-slate-300 text-slate-900" />
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-semibold text-slate-900">Arrival</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="arrivalCity" className="text-slate-900">City</Label>
            <Input id="arrivalCity" name="arrivalCity" required className="bg-white border-slate-300 text-slate-900" placeholder="e.g., Los Angeles" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="arrivalAirport" className="text-slate-900">Airport Code</Label>
            <Input id="arrivalAirport" name="arrivalAirport" required className="bg-white border-slate-300 text-slate-900" placeholder="e.g., LAX" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="arrivalDate" className="text-slate-900">Date</Label>
            <Input id="arrivalDate" name="arrivalDate" type="date" required className="bg-white border-slate-300 text-slate-900" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="arrivalTime" className="text-slate-900">Time</Label>
            <Input id="arrivalTime" name="arrivalTime" type="time" required className="bg-white border-slate-300 text-slate-900" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="passengerName" className="text-slate-900">Passenger Name</Label>
          <Input id="passengerName" name="passengerName" required className="bg-white border-slate-300 text-slate-900" placeholder="Full name as on passport" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmationNumber" className="text-slate-900">Confirmation Number</Label>
          <Input id="confirmationNumber" name="confirmationNumber" required className="bg-white border-slate-300 text-slate-900" placeholder="e.g., ABC123" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seatNumber" className="text-slate-900">Seat Number (Optional)</Label>
          <Input id="seatNumber" name="seatNumber" className="bg-white border-slate-300 text-slate-900" placeholder="e.g., 12A" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bookingClass" className="text-slate-900">Class (Optional)</Label>
          <Input id="bookingClass" name="bookingClass" className="bg-white border-slate-300 text-slate-900" placeholder="e.g., Economy" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="text-slate-900">Price (Optional)</Label>
          <Input id="price" name="price" type="number" className="bg-white border-slate-300 text-slate-900" placeholder="$" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-slate-900">Notes (Optional)</Label>
        <Input id="notes" name="notes" className="bg-white border-slate-300" placeholder="Any additional information..." />
      </div>
    </>
  );
}

function HotelForm() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label htmlFor="hotelName" className="text-slate-900">Hotel Name</Label>
          <Input 
            id="hotelName" 
            name="hotelName" 
            required 
            autoComplete="off"
            className="bg-white border-slate-300 text-slate-900" 
            placeholder="e.g., Hilton Garden Inn"
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="address" className="text-slate-900">Address</Label>
          <Input 
            id="address" 
            name="address" 
            required 
            autoComplete="off"
            className="bg-white border-slate-300 text-slate-900" 
            placeholder="Street address"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city" className="text-slate-900">City</Label>
          <Input 
            id="city" 
            name="city" 
            required 
            autoComplete="off"
            className="bg-white border-slate-300 text-slate-900" 
            placeholder="e.g., New York"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="roomType" className="text-slate-900">Room Type</Label>
          <Input 
            id="roomType" 
            name="roomType" 
            required 
            autoComplete="off"
            className="bg-white border-slate-300 text-slate-900" 
            placeholder="e.g., Deluxe Suite" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="checkIn" className="text-slate-900">Check-in Date</Label>
          <Input 
            id="checkIn" 
            name="checkIn" 
            type="date" 
            required 
            autoComplete="off"
            className="bg-white border-slate-300 text-slate-900" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="checkOut" className="text-slate-900">Check-out Date</Label>
          <Input 
            id="checkOut" 
            name="checkOut" 
            type="date" 
            required 
            autoComplete="off"
            className="bg-white border-slate-300 text-slate-900" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guestName" className="text-slate-900">Guest Name</Label>
          <Input 
            id="guestName" 
            name="guestName" 
            required 
            autoComplete="off"
            className="bg-white border-slate-300 text-slate-900" 
            placeholder="Full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numberOfGuests" className="text-slate-900">Number of Guests</Label>
          <Input 
            id="numberOfGuests" 
            name="numberOfGuests" 
            type="number" 
            min="1" 
            defaultValue="1" 
            required 
            autoComplete="off"
            className="bg-white border-slate-300 text-slate-900" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmationNumber" className="text-slate-900">Confirmation Number</Label>
          <Input 
            id="confirmationNumber" 
            name="confirmationNumber" 
            required 
            autoComplete="off"
            className="bg-white border-slate-300 text-slate-900" 
            placeholder="e.g., CONF12345"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="text-slate-900">Price (Optional)</Label>
          <Input 
            id="price" 
            name="price" 
            type="number" 
            autoComplete="off"
            className="bg-white border-slate-300 text-slate-900" 
            placeholder="$" 
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-slate-900">Notes (Optional)</Label>
        <Input 
          id="notes" 
          name="notes" 
          autoComplete="off"
          className="bg-white border-slate-300 text-slate-900" 
          placeholder="Any additional information..." 
        />
      </div>
    </>
  );
}

function CarForm() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company" className="text-slate-900">Rental Company</Label>
          <Input id="company" name="company" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" placeholder="e.g., Hertz, Enterprise" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vehicleType" className="text-slate-900">Vehicle Type</Label>
          <Input id="vehicleType" name="vehicleType" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" placeholder="e.g., SUV, Sedan" />
        </div>
      </div>

      <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-slate-900">Pick-up</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="pickupLocation" className="text-slate-900">Location</Label>
            <Input id="pickupLocation" name="pickupLocation" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" placeholder="e.g., JFK Airport" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pickupDate" className="text-slate-900">Date</Label>
            <Input id="pickupDate" name="pickupDate" type="date" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pickupTime" className="text-slate-900">Time</Label>
            <Input id="pickupTime" name="pickupTime" type="time" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" />
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-semibold text-slate-900">Drop-off</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="dropoffLocation" className="text-slate-900">Location</Label>
            <Input id="dropoffLocation" name="dropoffLocation" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" placeholder="e.g., Downtown Manhattan" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dropoffDate" className="text-slate-900">Date</Label>
            <Input id="dropoffDate" name="dropoffDate" type="date" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dropoffTime" className="text-slate-900">Time</Label>
            <Input id="dropoffTime" name="dropoffTime" type="time" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="driverName" className="text-slate-900">Driver Name</Label>
          <Input id="driverName" name="driverName" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" placeholder="Full name as on license" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmationNumber" className="text-slate-900">Confirmation Number</Label>
          <Input id="confirmationNumber" name="confirmationNumber" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" placeholder="e.g., RES456789" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="text-slate-900">Price (Optional)</Label>
          <Input id="price" name="price" type="number" autoComplete="off" className="bg-white border-slate-300 text-slate-900" placeholder="$" />
        </div>
        <div className="space-y-2 flex items-center">
          <input type="checkbox" id="insurance" name="insurance" className="mr-2" />
          <Label htmlFor="insurance" className="text-slate-900">Insurance Included</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-slate-900">Notes (Optional)</Label>
        <Input id="notes" name="notes" autoComplete="off" className="bg-white border-slate-300 text-slate-900" placeholder="Any additional information..." />
      </div>
    </>
  );
}

function TicketForm() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label htmlFor="eventName" className="text-slate-900">Event Name</Label>
          <Input id="eventName" name="eventName" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" placeholder="e.g., Broadway Show, Concert" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="venue" className="text-slate-900">Venue</Label>
          <Input id="venue" name="venue" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" placeholder="e.g., Madison Square Garden" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city" className="text-slate-900">City</Label>
          <Input id="city" name="city" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" placeholder="e.g., New York" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventDate" className="text-slate-900">Event Date</Label>
          <Input id="eventDate" name="eventDate" type="date" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventTime" className="text-slate-900">Event Time</Label>
          <Input id="eventTime" name="eventTime" type="time" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ticketType" className="text-slate-900">Ticket Type</Label>
          <Input id="ticketType" name="ticketType" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" placeholder="e.g., VIP, General" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numberOfTickets" className="text-slate-900">Number of Tickets</Label>
          <Input id="numberOfTickets" name="numberOfTickets" type="number" min="1" defaultValue="1" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="attendeeName" className="text-slate-900">Attendee Name</Label>
          <Input id="attendeeName" name="attendeeName" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" placeholder="Full name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmationNumber" className="text-slate-900">Confirmation Number</Label>
          <Input id="confirmationNumber" name="confirmationNumber" required autoComplete="off" className="bg-white border-slate-300 text-slate-900" placeholder="e.g., TIX987654" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seatNumber" className="text-slate-900">Seat Number (Optional)</Label>
          <Input id="seatNumber" name="seatNumber" autoComplete="off" className="bg-white border-slate-300 text-slate-900" placeholder="e.g., A12" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="text-slate-900">Price (Optional)</Label>
          <Input id="price" name="price" type="number" autoComplete="off" className="bg-white border-slate-300 text-slate-900" placeholder="$" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-slate-900">Notes (Optional)</Label>
        <Input id="notes" name="notes" autoComplete="off" className="bg-white border-slate-300 text-slate-900" placeholder="Any additional information..." />
      </div>
    </>
  );
}
