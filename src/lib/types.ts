export type UserRole = 'admin' | 'peminjam';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
}

export type RequestStatus = 'Pending' | 'Disetujui' | 'Ditolak';

export interface VehicleRequest {
  id: string;
  userId: string;
  userName: string;
  startDate: string;
  endDate: string;
  destination: string;
  purpose: string;
  vehicleId?: string;
  status: RequestStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  name: string;
  plate?: string;
  active: boolean;
}

export const VEHICLES: Vehicle[] = [
  { id: 'v1', name: 'Innova 02', active: true },
  { id: 'v2', name: 'Innova 05', active: true },
  { id: 'v3', name: 'Terios', active: true },
  { id: 'v4', name: 'Xenia', active: true },
  { id: 'v5', name: 'Panther', active: true },
];
