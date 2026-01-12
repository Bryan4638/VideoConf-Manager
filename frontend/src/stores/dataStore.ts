import { create } from "zustand";
import api from "../lib/api";
import { VideoConference, Location, Technician } from "../types";

interface DataState {
  conferences: VideoConference[];
  locations: Location[];
  technicians: Technician[];
  isLoading: boolean;
  error: string | null;

  // Fetch all data
  fetchConferences: () => Promise<void>;
  fetchLocations: () => Promise<void>;
  fetchTechnicians: () => Promise<void>;
  fetchAll: () => Promise<void>;

  // Conferences CRUD
  addConference: (conference: Omit<VideoConference, "id">) => Promise<void>;
  updateConference: (
    id: string,
    conference: Partial<VideoConference>
  ) => Promise<void>;
  deleteConference: (id: string) => Promise<void>;

  // Locations CRUD
  addLocation: (location: Omit<Location, "id">) => Promise<void>;
  updateLocation: (id: string, location: Partial<Location>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;

  // Technicians CRUD
  addTechnician: (technician: Omit<Technician, "id">) => Promise<void>;
  updateTechnician: (
    id: string,
    technician: Partial<Technician>
  ) => Promise<void>;
  deleteTechnician: (id: string) => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  conferences: [],
  locations: [],
  technicians: [],
  isLoading: false,
  error: null,

  // Fetch functions
  fetchConferences: async () => {
    try {
      const response = await api.get("/conferences");
      set({ conferences: response.data });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Error fetching conferences",
      });
    }
  },

  fetchLocations: async () => {
    try {
      const response = await api.get("/locations");
      set({ locations: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.error || "Error fetching locations" });
    }
  },

  fetchTechnicians: async () => {
    try {
      const response = await api.get("/technicians");
      set({ technicians: response.data });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Error fetching technicians",
      });
    }
  },

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    await Promise.all([
      get().fetchConferences(),
      get().fetchLocations(),
      get().fetchTechnicians(),
    ]);
    set({ isLoading: false });
  },

  // Conferences CRUD
  addConference: async (conference) => {
    try {
      const response = await api.post("/conferences", conference);
      set({ conferences: [...get().conferences, response.data] });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Error creating conference",
      });
      throw error;
    }
  },

  updateConference: async (id, conference) => {
    try {
      const response = await api.put(`/conferences/${id}`, conference);
      set({
        conferences: get().conferences.map((c) =>
          c.id === id ? response.data : c
        ),
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Error updating conference",
      });
      throw error;
    }
  },

  deleteConference: async (id) => {
    try {
      await api.delete(`/conferences/${id}`);
      set({ conferences: get().conferences.filter((c) => c.id !== id) });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Error deleting conference",
      });
      throw error;
    }
  },

  // Locations CRUD
  addLocation: async (location) => {
    try {
      const response = await api.post("/locations", location);
      set({ locations: [...get().locations, response.data] });
    } catch (error: any) {
      set({ error: error.response?.data?.error || "Error creating location" });
      throw error;
    }
  },

  updateLocation: async (id, location) => {
    try {
      const response = await api.put(`/locations/${id}`, location);
      set({
        locations: get().locations.map((l) =>
          l.id === id ? response.data : l
        ),
      });
    } catch (error: any) {
      set({ error: error.response?.data?.error || "Error updating location" });
      throw error;
    }
  },

  deleteLocation: async (id) => {
    try {
      await api.delete(`/locations/${id}`);
      set({ locations: get().locations.filter((l) => l.id !== id) });
    } catch (error: any) {
      set({ error: error.response?.data?.error || "Error deleting location" });
      throw error;
    }
  },

  // Technicians CRUD
  addTechnician: async (technician) => {
    try {
      const response = await api.post("/technicians", technician);
      set({ technicians: [...get().technicians, response.data] });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Error creating technician",
      });
      throw error;
    }
  },

  updateTechnician: async (id, technician) => {
    try {
      const response = await api.put(`/technicians/${id}`, technician);
      set({
        technicians: get().technicians.map((t) =>
          t.id === id ? response.data : t
        ),
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Error updating technician",
      });
      throw error;
    }
  },

  deleteTechnician: async (id) => {
    try {
      await api.delete(`/technicians/${id}`);
      set({ technicians: get().technicians.filter((t) => t.id !== id) });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Error deleting technician",
      });
      throw error;
    }
  },
}));
