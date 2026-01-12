import React, { useState } from "react";
import { Plus, Edit2, Trash2, Mail, Building, User } from "lucide-react";
import { usuarios } from "../../mockData";
import UserModal from "./UserModal";

export const UserTabs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFacultad, setFilterFacultad] = useState("");
  const [showModal, setShowModal] = useState(false);

  const facultades = [
    ...new Set(usuarios.map((u) => u.facultadDepartamento).filter(Boolean)),
  ];

  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFacultad =
      !filterFacultad || usuario.facultadDepartamento === filterFacultad;

    return matchesSearch && matchesFacultad;
  });

  const handleEdit = (id: number) => {
    console.log("Editar usuario:", id);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de que desea eliminar este usuario?")) {
      console.log("Eliminar usuario:", id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600">Gestión de usuarios del sistema</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filterFacultad}
              onChange={(e) => setFilterFacultad(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las facultades</option>
              {facultades.map((facultad) => (
                <option key={facultad} value={facultad}>
                  {facultad}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsuarios.map((usuario) => (
          <div
            key={usuario.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {usuario.nombre}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {usuario.id}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(usuario.id)}
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(usuario.id)}
                  className="text-red-600 hover:text-red-900 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <span className="truncate">{usuario.correo}</span>
              </div>

              {usuario.facultadDepartamento && (
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{usuario.facultadDepartamento}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Usuario registrado</span>
                <span className="text-green-600 font-medium">Activo</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsuarios.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No se encontraron usuarios</p>
        </div>
      )}
      {showModal && <UserModal onClose={() => setShowModal(false)} />}
    </div>
  );
};
