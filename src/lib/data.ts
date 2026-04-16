import innovaImg from "@/assets/innova.jpg";
import teriosImg from "@/assets/terios.jpg";
import xeniaImg from "@/assets/xenia.jpg";
import pantherImg from "@/assets/panther.jpg";

export interface Car {
  id: string;
  name: string;
  image: string;
  capacity: number;
  type: string;
}

export interface Booking {
  id: string;
  borrowerName: string;
  teamName: string;
  keperluan: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  carId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export const cars: Car[] = [
  { id: "innova-02", name: "Toyota Innova 02", image: innovaImg, capacity: 7, type: "MPV" },
  { id: "innova-05", name: "Toyota Innova 05", image: innovaImg, capacity: 7, type: "MPV" },
  { id: "terios-1", name: "Daihatsu Terios", image: teriosImg, capacity: 7, type: "SUV" },
  { id: "xenia-1", name: "Daihatsu Xenia", image: xeniaImg, capacity: 7, type: "MPV" },
  { id: "panther-1", name: "Isuzu Panther", image: pantherImg, capacity: 8, type: "MPV" },
];

// --- Google Sheets API Integration ---
const API_URL_KEY = "bps_sheets_api_url";

export function getApiUrl(): string {
  return localStorage.getItem(API_URL_KEY) || "";
}

export function setApiUrl(url: string) {
  localStorage.setItem(API_URL_KEY, url);
}

// Fetch bookings from Google Sheets API
export async function fetchBookingsFromSheet(): Promise<Booking[]> {
  const url = getApiUrl();
  if (!url) return getBookingsLocal();
  try {
    const res = await fetch(`${url}?action=getBookings`);
    const data = await res.json();
    if (data.status === "success") return data.data as Booking[];
    return getBookingsLocal();
  } catch {
    return getBookingsLocal();
  }
}

// Save booking to Google Sheets API
export async function saveBookingToSheet(booking: Booking): Promise<boolean> {
  const url = getApiUrl();
  if (!url) {
    saveBookingLocal(booking);
    return true;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "addBooking", data: booking }),
    });
    const result = await res.json();
    // Also save locally as cache
    saveBookingLocal(booking);
    return result.status === "success";
  } catch {
    saveBookingLocal(booking);
    return false;
  }
}

// Update booking status via Google Sheets API
export async function updateBookingStatusOnSheet(
  id: string,
  status: Booking["status"],
  carId?: string
): Promise<boolean> {
  const url = getApiUrl();
  // Always update local
  updateBookingStatusLocal(id, status, carId);
  if (!url) return true;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "updateStatus", data: { id, status, carId: carId || "" } }),
    });
    const result = await res.json();
    return result.status === "success";
  } catch {
    return false;
  }
}

// Update booking fields via Google Sheets API
export async function updateBookingOnSheet(id: string, updates: Partial<Booking>): Promise<boolean> {
  const url = getApiUrl();
  updateBookingLocal(id, updates);
  if (!url) return true;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "updateBooking", data: { id, ...updates } }),
    });
    const result = await res.json();
    return result.status === "success";
  } catch {
    return false;
  }
}

// --- Local Storage fallback ---
const BOOKINGS_KEY = "bps-car-bookings";

export function getBookingsLocal(): Booking[] {
  const raw = localStorage.getItem(BOOKINGS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveBookingLocal(booking: Booking) {
  const bookings = getBookingsLocal();
  bookings.push(booking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

function updateBookingStatusLocal(id: string, status: Booking["status"], carId?: string) {
  const bookings = getBookingsLocal().map((b) =>
    b.id === id ? { ...b, status, ...(carId ? { carId } : {}) } : b
  );
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

function updateBookingLocal(id: string, updates: Partial<Booking>) {
  const bookings = getBookingsLocal().map((b) =>
    b.id === id ? { ...b, ...updates } : b
  );
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

// Legacy sync functions (used by components that haven't migrated to async)
export function getBookings(): Booking[] {
  return getBookingsLocal();
}

export function saveBooking(booking: Booking) {
  saveBookingLocal(booking);
}

export function updateBookingStatus(id: string, status: Booking["status"], carId?: string) {
  updateBookingStatusLocal(id, status, carId);
}

export function updateBooking(id: string, updates: Partial<Booking>) {
  updateBookingLocal(id, updates);
}

export function isCarAvailable(carId: string, startDate: string, endDate: string): boolean {
  const bookings = getBookingsLocal().filter(
    (b) => b.carId === carId && b.status !== "rejected"
  );
  return !bookings.some(
    (b) =>
      new Date(startDate) <= new Date(b.endDate) &&
      new Date(endDate) >= new Date(b.startDate)
  );
}
