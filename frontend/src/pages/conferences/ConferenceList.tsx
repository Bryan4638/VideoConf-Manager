import React, { useState } from "react";
import { Plus, Search, Calendar, Clock, Users, MapPin } from "lucide-react";
import { useDataStore } from "../../stores/dataStore";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Badge from "../../components/UI/Badge";
import ConferenceForm from "./ConferenceForm";

const ConferenceList: React.FC = () => {
  const { conferences, locations, technicians, deleteConference } =
    useDataStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingConference, setEditingConference] = useState<string | null>(
    null
  );

  // Filter conferences based on search term
  const filteredConferences = conferences.filter(
    (conf) =>
      conf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conf.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    setEditingConference(id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar esta conferencia?")
    ) {
      deleteConference(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingConference(null);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "scheduled":
        return "info";
      case "in-progress":
        return "warning";
      case "completed":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Videoconferencias
          </h1>
          <p className="text-gray-600">Gestiona tus conferencias programadas</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <Plus size={18} className="mr-1" />
          Nueva Conferencia
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
            placeholder="Buscar conferencias..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Conference List */}
      <div className="space-y-4">
        {filteredConferences.length > 0 ? (
          filteredConferences.map((conference) => {
            const location = locations.find(
              (loc) => loc.id === conference.locationId
            );
            const conferenceTechnicians = technicians.filter((tech) =>
              conference.technicianIds.includes(tech.id)
            );

            return (
              <Card
                key={conference.id}
                className="hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium">
                        {conference.title}
                      </h3>
                      <Badge
                        variant={getStatusVariant(conference.status)}
                        className="ml-2"
                      >
                        {conference.status}
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-3">
                      {conference.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        <span>{conference.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span>
                          {conference.startTime} - {conference.endTime}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        <span>{location?.name || "Sin ubicación"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users size={16} className="mr-2" />
                        <span>{conference.participantCount} participantes</span>
                      </div>
                    </div>

                    {conferenceTechnicians.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-1">Técnicos:</p>
                        <div className="flex flex-wrap gap-1">
                          {conferenceTechnicians.map((tech) => (
                            <Badge key={tech.id} variant="default">
                              {tech.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col justify-end space-x-2 md:space-x-0 md:space-y-2 mt-4 md:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(conference.id)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(conference.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No se encontraron conferencias.</p>
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
      </div>

      {/* Form Modal */}
      {showForm && (
        <ConferenceForm onClose={handleCloseForm} editId={editingConference} />
      )}
    </div>
  );
};

export default ConferenceList;
