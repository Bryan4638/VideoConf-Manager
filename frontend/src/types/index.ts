export interface User {
  id: string;
  username: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  capacity: number;
  hasVideoEquipment: boolean;
}

export interface VideoConference {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  locationId: string;
  technicianIds: string[];
  participantIds: string[];
  participantCount: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
}
