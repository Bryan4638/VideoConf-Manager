import React, { useState } from "react";
import { Plus, Search, MapPin, User } from "lucide-react";
import { useDataStore } from "../../stores/dataStore";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Badge from "../../components/UI/Badge";
import LocationForm from "./LocationForm";

const LocationList: React.FC = () => {
  const { locations, deleteLocation } = useDataStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<string | null>(null);

  // Filter locations based on search term
  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    setEditingLocation(id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar esta ubicación?")
    ) {
      deleteLocation(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLocation(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ubicaciones</h1>
          <p className="text-gray-600">
            Gestiona los lugares para videoconferencias
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <Plus size={18} className="mr-1" />
          Nueva Ubicación
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar ubicaciones..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Location Grid */}
      {filteredLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.map((location) => (
            <Card
              key={location.id}
              className="hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 mr-3">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-lg">{location.name}</h3>
                  </div>

                  {location.hasVideoEquipment && (
                    <Badge variant="success">Equipado</Badge>
                  )}
                </div>

                <p className="text-gray-600 mt-2 text-sm">{location.address}</p>

                <div className="flex items-center mt-3 text-sm text-gray-600">
                  <User size={16} className="mr-1" />
                  <span>Capacidad: {location.capacity}</span>
                </div>

                <div className="mt-auto pt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(location.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(location.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No se encontraron ubicaciones.</p>
          {searchTerm && (
            <p className="text-gray-500 mt-1">
              Intenta ajustar tu búsqueda o
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => setSearchTerm("")}
              >
                Limpiar Búsqueda
              </Button>
            </p>
          )}
        </Card>
      )}

      {/* Form Modal */}
      {showForm && (
        <LocationForm onClose={handleCloseForm} editId={editingLocation} />
      )}
    </div>
  );
};

export default LocationList;
