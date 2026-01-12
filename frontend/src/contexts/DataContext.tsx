import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VideoConference, Location, Technician } from '../types';

// Initial mock data
const initialConferences: VideoConference[] = [
  {
    id: '1',
    title: 'Quarterly Team Meeting',
    description: 'Review Q2 results and plan for Q3',
    date: '2025-06-15',
    startTime: '10:00',
    endTime: '12:00',
    locationId: '1',
    technicianIds: ['1'],
    participantCount: 25,
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Client Presentation',
    description: 'New product demo for potential clients',
    date: '2025-06-18',
    startTime: '14:00',
    endTime: '15:30',
    locationId: '2',
    technicianIds: ['1', '2'],
    participantCount: 12,
    status: 'scheduled'
  }
];

const initialLocations: Location[] = [
  {
    id: '1',
    name: 'Main Conference Room',
    address: '123 Business Ave, Suite 200',
    capacity: 30,
    hasVideoEquipment: true
  },
  {
    id: '2',
    name: 'Executive Boardroom',
    address: '123 Business Ave, Suite 300',
    capacity: 15,
    hasVideoEquipment: true
  }
];

const initialTechnicians: Technician[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-123-4567',
    specialization: 'Video Systems'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '555-987-6543',
    specialization: 'Audio Engineering'
  }
];

interface DataContextType {
  conferences: VideoConference[];
  locations: Location[];
  technicians: Technician[];
  addConference: (conference: Omit<VideoConference, 'id'>) => void;
  updateConference: (id: string, conference: Partial<VideoConference>) => void;
  deleteConference: (id: string) => void;
  addLocation: (location: Omit<Location, 'id'>) => void;
  updateLocation: (id: string, location: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
  addTechnician: (technician: Omit<Technician, 'id'>) => void;
  updateTechnician: (id: string, technician: Partial<Technician>) => void;
  deleteTechnician: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conferences, setConferences] = useState<VideoConference[]>(() => {
    const savedConferences = localStorage.getItem('conferences');
    return savedConferences ? JSON.parse(savedConferences) : initialConferences;
  });
  
  const [locations, setLocations] = useState<Location[]>(() => {
    const savedLocations = localStorage.getItem('locations');
    return savedLocations ? JSON.parse(savedLocations) : initialLocations;
  });
  
  const [technicians, setTechnicians] = useState<Technician[]>(() => {
    const savedTechnicians = localStorage.getItem('technicians');
    return savedTechnicians ? JSON.parse(savedTechnicians) : initialTechnicians;
  });

  // Save to localStorage whenever data changes
  React.useEffect(() => {
    localStorage.setItem('conferences', JSON.stringify(conferences));
  }, [conferences]);

  React.useEffect(() => {
    localStorage.setItem('locations', JSON.stringify(locations));
  }, [locations]);

  React.useEffect(() => {
    localStorage.setItem('technicians', JSON.stringify(technicians));
  }, [technicians]);

  // Conference functions
  const addConference = (conference: Omit<VideoConference, 'id'>) => {
    const newConference = {
      ...conference,
      id: Date.now().toString()
    };
    setConferences([...conferences, newConference]);
  };

  const updateConference = (id: string, updatedFields: Partial<VideoConference>) => {
    setConferences(
      conferences.map((conf) =>
        conf.id === id ? { ...conf, ...updatedFields } : conf
      )
    );
  };

  const deleteConference = (id: string) => {
    setConferences(conferences.filter((conf) => conf.id !== id));
  };

  // Location functions
  const addLocation = (location: Omit<Location, 'id'>) => {
    const newLocation = {
      ...location,
      id: Date.now().toString()
    };
    setLocations([...locations, newLocation]);
  };

  const updateLocation = (id: string, updatedFields: Partial<Location>) => {
    setLocations(
      locations.map((loc) =>
        loc.id === id ? { ...loc, ...updatedFields } : loc
      )
    );
  };

  const deleteLocation = (id: string) => {
    // Don't delete if there are conferences using this location
    if (conferences.some(conf => conf.locationId === id)) {
      alert('Cannot delete location as it is being used by one or more conferences');
      return;
    }
    setLocations(locations.filter((loc) => loc.id !== id));
  };

  // Technician functions
  const addTechnician = (technician: Omit<Technician, 'id'>) => {
    const newTechnician = {
      ...technician,
      id: Date.now().toString()
    };
    setTechnicians([...technicians, newTechnician]);
  };

  const updateTechnician = (id: string, updatedFields: Partial<Technician>) => {
    setTechnicians(
      technicians.map((tech) =>
        tech.id === id ? { ...tech, ...updatedFields } : tech
      )
    );
  };

  const deleteTechnician = (id: string) => {
    // Don't delete if there are conferences using this technician
    if (conferences.some(conf => conf.technicianIds.includes(id))) {
      alert('Cannot delete technician as they are assigned to one or more conferences');
      return;
    }
    setTechnicians(technicians.filter((tech) => tech.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        conferences,
        locations,
        technicians,
        addConference,
        updateConference,
        deleteConference,
        addLocation,
        updateLocation,
        deleteLocation,
        addTechnician,
        updateTechnician,
        deleteTechnician
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};