export interface FlightBooking {
  id: string;
  type: "flight";
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    date: string;
    time: string;
  };
  arrival: {
    airport: string;
    city: string;
    date: string;
    time: string;
  };
  confirmationNumber: string;
  passengerName: string;
  seatNumber?: string;
  bookingClass?: string;
  price?: number;
  notes?: string;
}

export interface HotelBooking {
  id: string;
  type: "hotel";
  hotelName: string;
  address: string;
  city: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  confirmationNumber: string;
  guestName: string;
  numberOfGuests: number;
  price?: number;
  amenities?: string[];
  notes?: string;
}

export interface CarRentalBooking {
  id: string;
  type: "car";
  company: string;
  vehicleType: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffDate: string;
  dropoffTime: string;
  confirmationNumber: string;
  driverName: string;
  price?: number;
  insurance?: boolean;
  notes?: string;
}

export interface TicketBooking {
  id: string;
  type: "ticket";
  eventName: string;
  venue: string;
  city: string;
  eventDate: string;
  eventTime: string;
  ticketType: string;
  confirmationNumber: string;
  attendeeName: string;
  numberOfTickets: number;
  seatNumber?: string;
  price?: number;
  notes?: string;
}

export type Booking = FlightBooking | HotelBooking | CarRentalBooking | TicketBooking;

export interface BookingCollection {
  tripName?: string;
  destination?: string;
  bookings: Booking[];
}

export function generateBookingId(): string {
  return `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function saveBookingsToStorage(bookings: Booking[]): void {
  try {
    localStorage.setItem("travel_bookings", JSON.stringify(bookings));
  } catch (error) {
    console.error("Failed to save bookings:", error);
  }
}

export function loadBookingsFromStorage(): Booking[] {
  try {
    const stored = localStorage.getItem("travel_bookings");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load bookings:", error);
    return [];
  }
}

export function deleteBooking(bookings: Booking[], bookingId: string): Booking[] {
  return bookings.filter(b => b.id !== bookingId);
}

export function getBookingsByType(bookings: Booking[], type: Booking["type"]): Booking[] {
  return bookings.filter(b => b.type === type);
}
