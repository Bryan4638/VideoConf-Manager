import { useState } from "react";
import { type Usuario } from "../../mockData";

interface UserModalProps {
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<Usuario>({
    id: 0,
    nombre: "",
    correo: "",
    facultadDepartamento: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Guardar videoconferencia:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Nueva Usuario</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo
            </label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) =>
                setFormData({ ...formData, correo: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facultad/Departamento
            </label>
            <input
              type="text"
              value={formData.facultadDepartamento}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  facultadDepartamento: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={() => {
                onClose();
              }}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
