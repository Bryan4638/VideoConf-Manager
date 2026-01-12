import React, { useState } from "react";
import { Plus, Search, Phone, Mail, Briefcase } from "lucide-react";
import { useDataStore } from "../../stores/dataStore";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import TechnicianForm from "./TechnicianForm";

const TechnicianList: React.FC = () => {
  const { technicians, deleteTechnician } = useDataStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState<string | null>(
    null
  );

  // Filter technicians based on search term
  const filteredTechnicians = technicians.filter(
    (tech) =>
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    setEditingTechnician(id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este técnico?")) {
      deleteTechnician(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTechnician(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Técnicos</h1>
          <p className="text-gray-600">Gestiona tu personal técnico</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <Plus size={18} className="mr-1" />
          Nuevo Técnico
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
            placeholder="Buscar técnicos..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Technician Grid */}
      {filteredTechnicians.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTechnicians.map((technician) => (
            <Card
              key={technician.id}
              className="hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col h-full">
                <div>
                  <div className="mb-3">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                      <span className="text-purple-700 font-medium text-lg">
                        {technician.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-medium text-lg">{technician.name}</h3>
                    <p className="text-purple-600 text-sm">
                      {technician.specialization}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{technician.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{technician.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span>{technician.specialization}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(technician.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(technician.id)}
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
          <p className="text-gray-600">No se encontraron técnicos.</p>
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
        <TechnicianForm onClose={handleCloseForm} editId={editingTechnician} />
      )}
    </div>
  );
};

export default TechnicianList;
