import { User, VehicleRequest, Vehicle, VEHICLES, RequestStatus } from './types';

const USERS_KEY = 'vms_users';
const REQUESTS_KEY = 'vms_requests';
const VEHICLES_KEY = 'vms_vehicles';
const AUTH_KEY = 'vms_auth';

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function setItem(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Auth ---
export function login(name: string, role: 'admin' | 'peminjam'): User {
  const users = getItem<User[]>(USERS_KEY, []);
  let user = users.find(u => u.name === name && u.role === role);
  if (!user) {
    user = { id: crypto.randomUUID(), name, role };
    users.push(user);
    setItem(USERS_KEY, users);
  }
  setItem(AUTH_KEY, user);
  return user;
}

export function getAuth(): User | null {
  return getItem<User | null>(AUTH_KEY, null);
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

// --- Vehicles ---
export function getVehicles(): Vehicle[] {
  return getItem<Vehicle[]>(VEHICLES_KEY, VEHICLES);
}

export function saveVehicles(v: Vehicle[]) {
  setItem(VEHICLES_KEY, v);
}

// --- Requests ---
export function getRequests(): VehicleRequest[] {
  return getItem<VehicleRequest[]>(REQUESTS_KEY, []);
}

export function saveRequests(r: VehicleRequest[]) {
  setItem(REQUESTS_KEY, r);
}

export function createRequest(data: Omit<VehicleRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): VehicleRequest {
  const requests = getRequests();
  const req: VehicleRequest = {
    ...data,
    id: crypto.randomUUID(),
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  requests.push(req);
  saveRequests(requests);
  return req;
}

export function updateRequestStatus(id: string, status: RequestStatus, vehicleId?: string, adminNote?: string) {
  const requests = getRequests();
  const idx = requests.findIndex(r => r.id === id);
  if (idx >= 0) {
    requests[idx] = { ...requests[idx], status, vehicleId, adminNote, updatedAt: new Date().toISOString() };
    saveRequests(requests);
  }
  return requests[idx];
}

export function getAvailableVehicles(startDate: string, endDate: string): Vehicle[] {
  const vehicles = getVehicles().filter(v => v.active);
  const requests = getRequests().filter(r =>
    r.status === 'Disetujui' && r.vehicleId &&
    !(r.endDate < startDate || r.startDate > endDate)
  );
  const usedIds = new Set(requests.map(r => r.vehicleId));
  return vehicles.filter(v => !usedIds.has(v.id));
}
